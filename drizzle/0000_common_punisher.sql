CREATE TABLE `beans` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`origin` text NOT NULL,
	`region` text,
	`farm` text,
	`altitude` text,
	`variety` text,
	`process` text NOT NULL,
	`roast_level` text NOT NULL,
	`roast_date` text,
	`tasting_notes` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`capacity_ml` integer NOT NULL,
	`kind` text NOT NULL,
	`notes` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_id` text,
	`bean_id` text NOT NULL,
	`cup_id` text NOT NULL,
	`name` text NOT NULL,
	`version` integer NOT NULL,
	`beverage_style` text NOT NULL,
	`dose_g` real NOT NULL,
	`brew_water_g` real NOT NULL,
	`brew_ice_g` real NOT NULL,
	`serving_ice_g` real NOT NULL,
	`nominal_ratio` real NOT NULL,
	`grinder` text NOT NULL,
	`grind_setting` text NOT NULL,
	`bloom_ratio` real NOT NULL,
	`bloom_seconds` integer NOT NULL,
	`bloom_temp_c` real NOT NULL,
	`pulse_count` integer NOT NULL,
	`pulse_interval_seconds` integer NOT NULL,
	`pulse_temps_c` text NOT NULL,
	`water_profile` text,
	`retention_factor` real NOT NULL,
	`drop_temp_c` real NOT NULL,
	`goal` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_recipes_bean_created` ON `recipes` (`bean_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_recipes_parent` ON `recipes` (`parent_id`);--> statement-breakpoint
CREATE TABLE `tastings` (
	`id` text PRIMARY KEY NOT NULL,
	`recipe_id` text NOT NULL,
	`brewed_at` text NOT NULL,
	`acidity` integer NOT NULL,
	`sweetness` integer NOT NULL,
	`bitterness` integer NOT NULL,
	`astringency` integer NOT NULL,
	`body` integer NOT NULL,
	`aroma` integer NOT NULL,
	`overall` integer NOT NULL,
	`finish` text,
	`drawdown` text NOT NULL,
	`ice_remaining` integer NOT NULL,
	`final_beverage_g` real,
	`notes` text
);
--> statement-breakpoint
CREATE INDEX `idx_tastings_recipe_brewed` ON `tastings` (`recipe_id`,`brewed_at`);