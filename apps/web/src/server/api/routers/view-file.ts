/* eslint-disable no-unused-vars */
import { EventEmitter } from "events";

import { observable } from "@trpc/server/observable";

import { createTRPCRouter, protectedProcedure } from "../trpc";

interface ViewFilesEvents {
  enter: (user: string) => void;
  leave: (user: string) => void;
}

declare interface ViewFilesEventsEmitter {
  on<TEv extends keyof ViewFilesEvents>(
    event: TEv,
    listener: ViewFilesEvents[TEv],
  ): this;
  off<TEv extends keyof ViewFilesEvents>(
    event: TEv,
    listener: ViewFilesEvents[TEv],
  ): this;
  once<TEv extends keyof ViewFilesEvents>(
    event: TEv,
    listener: ViewFilesEvents[TEv],
  ): this;
  emit<TEv extends keyof ViewFilesEvents>(
    event: TEv,
    ...args: Parameters<ViewFilesEvents[TEv]>
  ): boolean;
}

// eslint-disable-next-line no-redeclare
class ViewFilesEventsEmitter extends EventEmitter {}

const ee = new ViewFilesEventsEmitter();

export const viewFilesRouter = createTRPCRouter({
  enter: protectedProcedure.mutation(async ({ ctx }) => {
    const { username } = ctx.session.user;
    ee.emit("enter", username);
    return username;
  }),

  leave: protectedProcedure.mutation(async ({ ctx }) => {
    const { username } = ctx.session.user;
    ee.emit("leave", username);
    return username;
  }),

  users: protectedProcedure.subscription(async () => {
    return observable<string>((observer) => {
      const onEnter = (user: string) => {
        observer.next(user);
      };

      const onLeave = (user: string) => {
        observer.next(user);
      };

      ee.on("enter", onEnter);
      ee.on("leave", onLeave);

      return () => {
        ee.off("enter", onEnter);
        ee.off("leave", onLeave);
      };
    });
  }),
});
