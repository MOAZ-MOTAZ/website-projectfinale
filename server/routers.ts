import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { addComment, listComments, deleteComment, trackVisitor } from "./db";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  comments: router({
    list: publicProcedure.query(async () => {
      return await listComments();
    }),
    add: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required").max(255),
          message: z.string().min(1, "Message is required"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await addComment({
          name: input.name,
          message: input.message,
        });
        // Track gift unlock event
        await trackVisitor({
          eventType: "gift_unlock",
          ipAddress: (ctx.req.ip || ctx.req.headers["x-forwarded-for"])?.toString(),
          userAgent: ctx.req.headers["user-agent"]?.toString(),
        });
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can delete comments" });
        }
        await deleteComment(input.id);
        return { success: true };
      }),
  }),

  visitors: router({
    trackTeaserVisit: publicProcedure.mutation(async ({ ctx }) => {
      await trackVisitor({
        eventType: "teaser_visit",
        ipAddress: (ctx.req.ip || ctx.req.headers["x-forwarded-for"])?.toString(),
        userAgent: ctx.req.headers["user-agent"]?.toString(),
      });
      
      // Send email notification to owner
      const ipAddress = (ctx.req.ip || ctx.req.headers["x-forwarded-for"])?.toString() || "Unknown";
      const timestamp = new Date().toLocaleString();
      
      await notifyOwner({
        title: "🎁 Mariam visited the teaser page!",
        content: `Someone visited the birthday gift teaser page at ${timestamp}.\n\nIP Address: ${ipAddress}\n\nShe's waiting for the big reveal! 🎉`,
      });
      
      return { success: true };
    }),
    trackGiftUnlock: publicProcedure.mutation(async ({ ctx }) => {
      // Track the gift unlock event
      await trackVisitor({
        eventType: "gift_unlock",
        ipAddress: (ctx.req.ip || ctx.req.headers["x-forwarded-for"])?.toString(),
        userAgent: ctx.req.headers["user-agent"]?.toString(),
      });
      
      // Send email notification to owner
      const timestamp = new Date().toLocaleString();
      
      await notifyOwner({
        title: "🎉 Mariam unlocked the gift!",
        content: `The birthday gift was unlocked at ${timestamp}.\n\nShe's now experiencing the special surprise you created! 🎁✨`,
      });
      
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
