import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

import { filesRouter } from "./routers/files";
import { resourceRouter } from "./routers/resource";
import { userRouter } from "./routers/user";
import { viewFilesRouter } from "./routers/view-file";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  resources: resourceRouter,
  files: filesRouter,
  viewFiles: viewFilesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
