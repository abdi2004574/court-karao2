import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["player", "owner", "admin"]).default("player").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const venues = mysqlTable("venues", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  sportType: mysqlEnum("sportType", ["cricket", "football", "badminton", "tennis", "padel"]).notNull(),
  area: varchar("area", { length: 100 }).notNull(),
  address: text("address").notNull(),
  pricePerHour: decimal("pricePerHour", { precision: 10, scale: 2 }).notNull(),
  coverImage: text("coverImage"),
  amenities: json("amenities"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.80"),
  reviewsCount: int("reviewsCount").default(0),
  isPublished: int("isPublished").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Venue = typeof venues.$inferSelect;
export type InsertVenue = typeof venues.$inferInsert;

export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  venueId: int("venueId").notNull(),
  playerId: int("playerId").notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  timeSlot: varchar("timeSlot", { length: 50 }).notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platformFee", { precision: 10, scale: 2 }).notNull(),
  ownerPayout: decimal("ownerPayout", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "online"]).default("online").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "completed"]).default("pending").notNull(),
  qrCodeToken: varchar("qrCodeToken", { length: 128 }).notNull(),
  coPlayersCount: int("coPlayersCount").default(1).notNull(),
  splitAmount: decimal("splitAmount", { precision: 10, scale: 2 }).notNull(),
  whatsappMessage: text("whatsappMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  venueId: int("venueId").notNull(),
  playerId: int("playerId").notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fullName: varchar("fullName", { length: 255 }),
  whatsappNumber: varchar("whatsappNumber", { length: 50 }),
  avatarUrl: text("avatarUrl"),
  preferredSports: json("preferredSports"),
  cnic: varchar("cnic", { length: 50 }),
  payoutMethod: varchar("payoutMethod", { length: 50 }),
  payoutNumber: varchar("payoutNumber", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tournaments = mysqlTable("tournaments", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  sport: varchar("sport", { length: 100 }).notNull(),
  teamsCount: int("teamsCount").notNull(), // 4, 8, or 16
  entryFee: decimal("entryFee", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["upcoming", "ongoing", "completed"]).default("upcoming").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
