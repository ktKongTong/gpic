CREATE TABLE `exchange_coupon` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`code` text NOT NULL,
	`amount` integer NOT NULL,
	`msg` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `exchange_user_id_idx` ON `exchange_coupon` (`user_id`);--> statement-breakpoint
CREATE INDEX `exchange_code_idx` ON `exchange_coupon` (`code`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_order` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`status` text NOT NULL,
	`paddle_price_id` text,
	`task_id` text,
	`msg` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_order`("id", "user_id", "type", "amount", "status", "paddle_price_id", "task_id", "msg", "created_at", "updated_at") SELECT "id", "user_id", "type", "amount", "status", "paddle_price_id", "task_id", "msg", "created_at", "updated_at" FROM `order`;--> statement-breakpoint
DROP TABLE `order`;--> statement-breakpoint
ALTER TABLE `__new_order` RENAME TO `order`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `usage_task_id_idx` ON `order` (`task_id`);--> statement-breakpoint
CREATE INDEX `usage_user_id_idx` ON `order` (`user_id`);