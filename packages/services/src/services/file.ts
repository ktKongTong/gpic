import { backendEnv as env} from "../libs/env";
import {typeid} from "typeid-js";
import {getClient} from "../libs/s3";

  
export class FileService {
    constructor() {
    }

    async signUpload(data?:{prefix?: string, filename?: string, filesize?: number, md5?: string}) {
        const p = data?.prefix ? `${data?.prefix}_` : ''
        const key = `${p}${typeid().toString()}`
      const R2_URL = env().S3_ENDPOINT
      const bucketName = env().S3_BUCKET
        const url = (
            await getClient().sign(
              new Request(`${R2_URL}/${bucketName}/${key}?X-Amz-Expires=${1800}`, { method: "PUT" }),
              { aws: { signQuery: true,  } },
            )
          ).url.toString()
        return {
            fileKey: key,
            uploadURL: url,
        }
    }

    async uploadFile(file: Uint8Array, prefix?: string) {
        const {fileKey, uploadURL} = await this.signUpload({ prefix })
        const res = await fetch(uploadURL, { method: 'PUT', body: file })
        if (!res.ok) {
          throw new Error("failed to upload file")
        }
        return `${env().S3_UC_ENDPOINT}/${fileKey}`
    }
}