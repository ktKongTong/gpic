ALTER TABLE `order` ADD `voucher_id` text;--> statement-breakpoint
ALTER TABLE `order` ADD `paddle_tx_id` text;--> statement-breakpoint
ALTER TABLE `order` DROP COLUMN `paddle_price_id`;