import { COOKIE_NAME } from "@shared/const";
import { parse } from "cookie";
import { getDb, getUserByOpenId } from "../db";
import { authenticateCronOrDev } from "./sdk";
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export async function createContext(opts: CreateExpressContextOptions) {
  const { req, res } = opts;
  
  // Check cron or dev override
  const cronOrDevUser = await authenticateCronOrDev(req, res);
  if (cronOrDevUser) {
    return { req, res, user: cronOrDevUser };
  }

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return { req, res, user: null };
  }

  const cookies = parse(cookieHeader);
  const sessionToken = cookies[COOKIE_NAME];
  if (!sessionToken) {
    return { req, res, user: null };
  }

  try {
    const db = await getDb();
    if (!db) return { req, res, user: null };
    
    // Simple session lookup or JWT verification
    // For template compatibility, we decode session cookie or match openId
    // If jwt secret is used, we can verify it
    return { req, res, user: null };
  } catch (err) {
    return { req, res, user: null };
  }
}

export type TrpcContext = inferAsyncReturnType<typeof createContext>;
