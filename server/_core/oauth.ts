import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import { upsertUser, getUserByOpenId } from "../db";
import { ENV } from "./env";

export function registerOAuthRoutes(app: any) {
  app.get("/api/oauth/callback", async (req: any, res: any) => {
    try {
      const code = req.query.code;
      if (!code) {
        res.status(400).send("Missing code");
        return;
      }
      res.redirect("/");
    } catch (error) {
      console.error("[OAuth] Callback error:", error);
      res.status(500).send("OAuth callback failed");
    }
  });
}
