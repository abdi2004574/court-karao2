import { COOKIE_NAME } from "@shared/const";
import { SignJWT } from "jose";
import { getSessionCookieOptions } from "./cookies";
import { getDb, upsertUser } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { ENV } from "./env";

export async function authenticateCronOrDev(req: any, res: any) {
  const authHeader = req.headers["authorization"];
  const isCronRequest = authHeader === `Bearer ${ENV.forgeApiKey}`;
  
  if (isCronRequest) {
    const openId = "cron-system-bot";
    let user = await upsertUser({
      openId,
      name: "Cron System Bot",
      role: "admin",
    });
    const dbUser = await getDb() ? (await (await getDb())!.select().from(users).where(eq(users.openId, openId)).limit(1))[0] : null;
    return dbUser || {
      id: 0,
      openId,
      name: "Cron System Bot",
      email: null,
      loginMethod: "cron",
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
  }
  return null;
}
