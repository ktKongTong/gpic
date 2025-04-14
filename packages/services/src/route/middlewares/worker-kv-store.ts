import { WorkersKVStore } from '@hono-rate-limiter/cloudflare';
import {
  type ClientRateLimitInfo,
} from 'hono-rate-limiter';

export class CloudflareKVStore extends WorkersKVStore<{
  Bindings: CloudflareEnv;
}> {
  /**
   * Expiration targets that are less than 60 seconds into the future are not supported. This is true for both expiration methods.
   *
   * see: https://developers.cloudflare.com/kv/api/write-key-value-pairs/#expiring-keys
   */
  private static readonly KV_MIN_EXPIRATION_BUFFER = 60;

  async increment(key: string): Promise<ClientRateLimitInfo> {
    const nowMS = Date.now();
    const record = await this.get(key);
    const defaultResetTime = new Date(nowMS + this.windowMs);

    const existingResetTimeMS =
      record?.resetTime && new Date(record.resetTime).getTime();
    const isActiveWindow = existingResetTimeMS && existingResetTimeMS > nowMS;

    const payload: ClientRateLimitInfo = {
      totalHits: isActiveWindow ? record.totalHits + 1 : 1,
      resetTime:
        isActiveWindow && existingResetTimeMS
          ? new Date(existingResetTimeMS)
          : defaultResetTime,
    };

    await this.updateRecord(key, payload);

    return payload;
  }

  async decrement(key: string): Promise<void> {
    const nowMS = Date.now();
    const record = await this.get(key);

    const existingResetTimeMS =
      record?.resetTime && new Date(record.resetTime).getTime();
    const isActiveWindow = existingResetTimeMS && existingResetTimeMS > nowMS;

    // Only decrement if in active window
    if (isActiveWindow && record) {
      const payload: ClientRateLimitInfo = {
        totalHits: Math.max(0, record.totalHits - 1), // Never go below 0
        resetTime: new Date(existingResetTimeMS),
      };

      await this.updateRecord(key, payload);
    }

    return;
  }

  /**
   * Method to calculate expiration.
   *
   * @param resetTime {Date} - The reset time.
   *
   * @returns {number} - The expiration in seconds.
   *
   * Note: KV expiration is always set to 60s after resetTime or nowSeconds to meet Cloudflare's minimum requirement.
   * This doesn't affect rate limiting behavior which is controlled by resetTime.
   */
  private calculateExpiration(resetTime: Date): number {
    const resetTimeSeconds = Math.floor(resetTime.getTime() / 1000);
    const nowSeconds = Math.floor(Date.now() / 1000);
    return Math.max(
      resetTimeSeconds + CloudflareKVStore.KV_MIN_EXPIRATION_BUFFER,
      nowSeconds + CloudflareKVStore.KV_MIN_EXPIRATION_BUFFER,
    );
  }

  /**
   * Method to update a record.
   *
   * @param key {string} - The identifier for a client.
   * @param payload {ClientRateLimitInfo} - The payload to update.
   */
  private async updateRecord(
    key: string,
    payload: ClientRateLimitInfo,
  ): Promise<void> {
    await this.namespace.put(this.prefixKey(key), JSON.stringify(payload), {
      expiration: this.calculateExpiration(payload.resetTime as Date),
    });
  }
}
