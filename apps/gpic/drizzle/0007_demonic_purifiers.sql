PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_credit` (
	`user_id` text PRIMARY KEY NOT NULL,
	`balance` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_credit`("user_id", "balance", "created_at", "updated_at") SELECT "user_id", "balance", "created_at", "updated_at" FROM `credit`;--> statement-breakpoint
DROP TABLE `credit`;--> statement-breakpoint
ALTER TABLE `__new_credit` RENAME TO `credit`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `usage` ADD `user_id` text NOT NULL;--> statement-breakpoint
CREATE INDEX `usage_user_id_idx` ON `usage` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_style_i18n` (
	`id` text PRIMARY KEY NOT NULL,
	`style_friendly_id` text NOT NULL,
	`i18n` text NOT NULL,
	`name` text NOT NULL,
	`aliases` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`style_friendly_id`) REFERENCES `style`(`style_friendly_id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_style_i18n`("id", "style_friendly_id", "i18n", "name", "aliases", "description", "created_at", "updated_at") SELECT "id", "style_friendly_id", "i18n", "name", "aliases", "description", "created_at", "updated_at" FROM `style_i18n`;--> statement-breakpoint
DROP TABLE `style_i18n`;--> statement-breakpoint
ALTER TABLE `__new_style_i18n` RENAME TO `style_i18n`;--> statement-breakpoint
CREATE UNIQUE INDEX `style_i18n_idx` ON `style_i18n` (`style_friendly_id`,`i18n`);
