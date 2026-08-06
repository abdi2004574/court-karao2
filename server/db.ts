import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, venues, InsertVenue, bookings, InsertBooking, notifications, InsertNotification } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) return;

  try {
    const values: InsertUser = {
      openId: user.openId,
      name: user.name ?? null,
      email: user.email ?? null,
      loginMethod: user.loginMethod ?? null,
      role: user.role ?? 'player',
      lastSignedIn: user.lastSignedIn ?? new Date(),
    };

    if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: {
        name: values.name,
        email: values.email,
        loginMethod: values.loginMethod,
        lastSignedIn: values.lastSignedIn,
      },
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Venue helpers
export async function getVenues(filters?: { sportType?: string; area?: string }) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(venues).where(eq(venues.isPublished, 1));
  const allVenues = await query;
  
  return allVenues.filter(v => {
    if (filters?.sportType && filters.sportType !== 'all' && v.sportType !== filters.sportType) return false;
    if (filters?.area && filters.area !== 'all' && !v.area.toLowerCase().includes(filters.area.toLowerCase())) return false;
    return true;
  });
}

export async function getVenueById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(venues).where(eq(venues.id, id)).limit(1);
  return result[0];
}

export async function createVenue(data: InsertVenue) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const res = await db.insert(venues).values(data);
  return res;
}

// Booking helpers
export async function createBooking(data: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const res = await db.insert(bookings).values(data);
  return res;
}

export async function getBookingsByPlayer(playerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(eq(bookings.playerId, playerId)).orderBy(desc(bookings.createdAt));
}

export async function getBookingsByOwner(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  // Get venues owned by owner
  const ownerVenues = await db.select({ id: venues.id }).from(venues).where(eq(venues.ownerId, ownerId));
  const venueIds = ownerVenues.map(v => v.id);
  if (venueIds.length === 0) return [];
  
  const allBookings = [];
  for (const vid of venueIds) {
    const bList = await db.select().from(bookings).where(eq(bookings.venueId, vid)).orderBy(desc(bookings.createdAt));
    allBookings.push(...bList);
  }
  return allBookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function updateBookingStatus(bookingId: number, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(bookings).set({ status }).where(eq(bookings.id, bookingId));
}

// Notifications
export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values(data);
}

export async function getNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
}
