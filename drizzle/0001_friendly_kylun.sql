CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`venueId` int NOT NULL,
	`playerId` int NOT NULL,
	`date` varchar(50) NOT NULL,
	`timeSlot` varchar(50) NOT NULL,
	`totalAmount` decimal(10,2) NOT NULL,
	`platformFee` decimal(10,2) NOT NULL,
	`ownerPayout` decimal(10,2) NOT NULL,
	`paymentMethod` enum('cash','online') NOT NULL DEFAULT 'online',
	`status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
	`qrCodeToken` varchar(128) NOT NULL,
	`coPlayersCount` int NOT NULL DEFAULT 1,
	`splitAmount` decimal(10,2) NOT NULL,
	`whatsappMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`isRead` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `venues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`sportType` enum('cricket','football','badminton','tennis','padel') NOT NULL,
	`area` varchar(100) NOT NULL,
	`address` text NOT NULL,
	`pricePerHour` decimal(10,2) NOT NULL,
	`coverImage` text,
	`amenities` json,
	`rating` decimal(3,2) DEFAULT '4.80',
	`reviewsCount` int DEFAULT 0,
	`isPublished` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `venues_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('player','owner','admin') NOT NULL DEFAULT 'player';