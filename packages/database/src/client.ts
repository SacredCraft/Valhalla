import { PrismaClient } from "@prisma/client";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      process.env.ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// eslint-disable-next-line no-undef
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.ENV !== "production") globalForPrisma.prisma = db;

export * from "@prisma/client";
