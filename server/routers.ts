import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { addComment, listComments } from "./db";

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
      .mutation(async ({ input }) => {
        await addComment({
          name: input.name,
          message: input.message,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
