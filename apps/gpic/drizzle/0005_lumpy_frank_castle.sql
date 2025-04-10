ALTER TABLE `task_history` ADD `started_at` integer;--> statement-breakpoint
ALTER TABLE `task_history` ADD `ended_at` integer;--> statement-breakpoint
ALTER TABLE `task` ADD `started_at` integer;--> statement-breakpoint
ALTER TABLE `task` ADD `ended_at` integer;