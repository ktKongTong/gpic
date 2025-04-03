PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_credit` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`balance` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_credit`("id", "user_id", "balance", "created_at", "updated_at") SELECT "id", "user_id", "balance", "created_at", "updated_at" FROM `credit`;--> statement-breakpoint
DROP TABLE `credit`;--> statement-breakpoint
ALTER TABLE `__new_credit` RENAME TO `credit`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `credit_user_id_unique` ON `credit` (`user_id`);--> statement-breakpoint
CREATE INDEX `credit_user_id_idx` ON `credit` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_examples` (
	`id` text PRIMARY KEY NOT NULL,
	`input_urls` text,
	`style` text,
	`prompt` text,
	`description` text,
	`url` text NOT NULL,
	`user_id` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_examples`("id", "input_urls", "style", "prompt", "description", "url", "user_id", "created_at", "updated_at") SELECT "id", "input_urls", "style", "prompt", "description", "url", "user_id", "created_at", "updated_at" FROM `examples`;--> statement-breakpoint
DROP TABLE `examples`;--> statement-breakpoint
ALTER TABLE `__new_examples` RENAME TO `examples`;--> statement-breakpoint
CREATE INDEX `examples_user_id_idx` ON `examples` (`user_id`);--> statement-breakpoint
CREATE INDEX `examples_style_idx` ON `examples` (`style`);--> statement-breakpoint
CREATE TABLE `__new_styles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`prompt` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_styles`("id", "name", "prompt", "created_at", "updated_at") SELECT "id", "name", "prompt", "created_at", "updated_at" FROM `styles`;--> statement-breakpoint
DROP TABLE `styles`;--> statement-breakpoint
ALTER TABLE `__new_styles` RENAME TO `styles`;--> statement-breakpoint
CREATE INDEX `styles_user_id_idx` ON `styles` (`name`);--> statement-breakpoint
CREATE TABLE `__new_usage` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`cost` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_usage`("id", "task_id", "cost", "created_at", "updated_at") SELECT "id", "task_id", "cost", "created_at", "updated_at" FROM `usage`;--> statement-breakpoint
DROP TABLE `usage`;--> statement-breakpoint
ALTER TABLE `__new_usage` RENAME TO `usage`;--> statement-breakpoint
CREATE INDEX `usage_task_id_idx` ON `usage` (`task_id`);--> statement-breakpoint
CREATE TABLE `__new_task_history` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`task_id` text NOT NULL,
	`credit_usage` integer NOT NULL,
	`input` text NOT NULL,
	`output` text,
	`state` text,
	`status` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_task_history`("id", "name", "task_id", "credit_usage", "input", "output", "state", "status", "created_at", "updated_at") SELECT "id", "name", "task_id", "credit_usage", "input", "output", "state", "status", "created_at", "updated_at" FROM `task_history`;--> statement-breakpoint
DROP TABLE `task_history`;--> statement-breakpoint
ALTER TABLE `__new_task_history` RENAME TO `task_history`;--> statement-breakpoint
CREATE INDEX `task_history_user_id_idx` ON `task_history` (`task_id`);--> statement-breakpoint
CREATE INDEX `task_history_status_idx` ON `task_history` (`status`);--> statement-breakpoint
CREATE TABLE `__new_task` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_id` text,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`input` text NOT NULL,
	`type` text NOT NULL,
	`retry` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`metadata` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_task`("id", "parent_id", "name", "user_id", "input", "type", "retry", "status", "metadata", "created_at", "updated_at") SELECT "id", "parent_id", "name", "user_id", "input", "type", "retry", "status", "metadata", "created_at", "updated_at" FROM `task`;--> statement-breakpoint
DROP TABLE `task`;--> statement-breakpoint
ALTER TABLE `__new_task` RENAME TO `task`;--> statement-breakpoint
CREATE INDEX `task_user_id_idx` ON `task` (`user_id`);--> statement-breakpoint
CREATE INDEX `task_status_idx` ON `task` (`status`);