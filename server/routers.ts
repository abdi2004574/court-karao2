import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  venues: router({
    list: publicProcedure
      .input(z.object({ sportType: z.string().optional(), area: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getVenues(input);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const venue = await db.getVenueById(input.id);
        if (!venue) throw new TRPCError({ code: "NOT_FOUND", message: "Venue not found" });
        return venue;
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        sportType: z.enum(["cricket", "football", "badminton", "tennis", "padel"]),
        area: z.string(),
        address: z.string(),
        pricePerHour: z.number(),
        coverImage: z.string().optional(),
        amenities: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createVenue({
          ownerId: ctx.user.id,
          name: input.name,
          sportType: input.sportType,
          area: input.area,
          address: input.address,
          pricePerHour: input.pricePerHour.toString(),
          coverImage: input.coverImage || "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop",
          amenities: input.amenities || ["Floodlights", "Parking", "Changing Rooms"],
        });
        return { success: true };
      }),
  }),

  bookings: router({
    create: protectedProcedure
      .input(z.object({
        venueId: z.number(),
        date: z.string(),
        timeSlot: z.string(),
        totalAmount: z.number(),
        paymentMethod: z.enum(["cash", "online"]),
        coPlayersCount: z.number().default(1),
      }))
      .mutation(async ({ ctx, input }) => {
        // Monetization Math:
        // If cash: platform_fee = 0, owner_payout = total
        // If online: platform_fee = (total * 0.05) + 150, owner_payout = total - platform_fee
        let platformFee = 0;
        let ownerPayout = input.totalAmount;
        if (input.paymentMethod === 'online') {
          platformFee = (input.totalAmount * 0.05) + 150;
          ownerPayout = input.totalAmount - platformFee;
        }

        const splitAmount = Math.round(input.totalAmount / (input.coPlayersCount + 1));
        const qrCodeToken = `CK-PASS-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`;
        const whatsappMsg = encodeURIComponent(`Hey! I booked a court on CourtKarao for ${input.date} at ${input.timeSlot}. Your share (split among ${input.coPlayersCount + 1} players) is Rs. ${splitAmount}. Pay via Easypaisa/JazzCash to confirm your spot!`);

        await db.createBooking({
          venueId: input.venueId,
          playerId: ctx.user.id,
          date: input.date,
          timeSlot: input.timeSlot,
          totalAmount: input.totalAmount.toString(),
          platformFee: platformFee.toString(),
          ownerPayout: ownerPayout.toString(),
          paymentMethod: input.paymentMethod,
          status: 'pending',
          qrCodeToken,
          coPlayersCount: input.coPlayersCount,
          splitAmount: splitAmount.toString(),
          whatsappMessage: whatsappMsg,
        });

        // Notify owner
        const venue = await db.getVenueById(input.venueId);
        if (venue) {
          await db.createNotification({
            userId: venue.ownerId,
            title: "New Booking Received!",
            message: `New booking for ${venue.name} on ${input.date} (${input.timeSlot}). Total: Rs. ${input.totalAmount}`,
          });
        }

        return { success: true, qrCodeToken, splitAmount, whatsappMessage: whatsappMsg };
      }),

    myBookings: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === 'owner' || ctx.user.role === 'admin') {
        return await db.getBookingsByOwner(ctx.user.id);
      }
      return await db.getBookingsByPlayer(ctx.user.id);
    }),

    updateStatus: protectedProcedure
      .input(z.object({ bookingId: z.number(), status: z.enum(["pending", "confirmed", "cancelled", "completed"]) }))
      .mutation(async ({ input }) => {
        await db.updateBookingStatus(input.bookingId, input.status);
        return { success: true };
      }),
  }),

  monetization: router({
    summary: protectedProcedure.query(async ({ ctx }) => {
      // Return platform revenue and breakdown
      const bookingsList = await db.getBookingsByOwner(ctx.user.id);
      let totalRevenue = 0;
      let platformCommission = 0;
      let ownerEarnings = 0;

      for (const b of bookingsList) {
        if (b.status === 'confirmed' || b.status === 'completed') {
          totalRevenue += Number(b.totalAmount);
          platformCommission += Number(b.platformFee);
          ownerEarnings += Number(b.ownerPayout);
        }
      }

      return {
        totalRevenue,
        platformCommission,
        ownerEarnings,
        totalBookings: bookingsList.length,
      };
    }),
  }),

  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getNotifications(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
