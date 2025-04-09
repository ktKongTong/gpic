ALTER TABLE `styles` RENAME TO `style`;--> statement-breakpoint
CREATE TABLE `style_i18n` (
	`id` text PRIMARY KEY NOT NULL,
	`style_friendly_id` text NOT NULL,
	`i18n` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`aliases` text,
	`description` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `style_i18n_idx` ON `style_i18n` (`style_friendly_id`,`i18n`);--> statement-breakpoint
DROP TABLE `examples`;--> statement-breakpoint
DROP INDEX `styles_user_id_idx`;--> statement-breakpoint
ALTER TABLE `style` ADD `style_friendly_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `style` ADD `prompt_version` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `style` ADD `type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `style` ADD `reference` text;--> statement-breakpoint
CREATE INDEX `style_friendly_id_idx` ON `style` (`style_friendly_id`);--> statement-breakpoint
ALTER TABLE `style` DROP COLUMN `name`;
