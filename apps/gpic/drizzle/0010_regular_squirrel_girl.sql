CREATE TABLE `apikey` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`start` text,
	`prefix` text,
	`key` text NOT NULL,
	`user_id` text NOT NULL,
	`refill_internal` integer,
	`refill_amount` integer,
	`last_refill_at` integer,
	`enabled` integer NOT NULL,
	`rate_limit_enabled` integer NOT NULL,
	`rate_limit_time_window` integer,
	`rate_limit_max` integer,
	`request_count` integer NOT NULL,
	`remain` integer,
	`last_request` integer,
	`expires_at` integer,
	`permissions` text,
	`metadata` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `apikey_key_index` ON `apikey` (`key`);--> statement-breakpoint
CREATE INDEX `apikey_prefix_key_index` ON `apikey` (`prefix`,`key`);--> statement-breakpoint
CREATE INDEX `apikey_user_id_index` ON `apikey` (`user_id`);