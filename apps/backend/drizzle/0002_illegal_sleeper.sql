ALTER TABLE `usage` RENAME TO `order`;--> statement-breakpoint
ALTER TABLE `order` RENAME COLUMN "cost" TO "count";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_order` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`task_id` text,
	`type` text,
	`amount` integer NOT NULL,
	`msg` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_order`("id", "user_id", "task_id", "type", "amount", "msg", "created_at", "updated_at") SELECT "id", "user_id", "task_id", "type", "count", "msg", "created_at", "updated_at" FROM `order`;--> statement-breakpoint
DROP TABLE `order`;--> statement-breakpoint
ALTER TABLE `__new_order` RENAME TO `order`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `usage_task_id_idx` ON `order` (`task_id`);--> statement-breakpoint
CREATE INDEX `usage_user_id_idx` ON `order` (`user_id`);