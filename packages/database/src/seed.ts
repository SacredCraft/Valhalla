import { genSaltSync, hashSync } from "bcrypt-ts";

import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const salt = genSaltSync(10);

const userData: Prisma.UserCreateInput[] = [
  {
    username: "Valhalla",
    password: hashSync("ValhallaAdmin", salt),
    role: "ADMIN",
  },
];

async function main() {
  console.log(`Start seeding ...`);

  const isEmpty = (await prisma.user.count()) === 0;

  if (isEmpty) {
    for (const u of userData) {
      const user = await prisma.user.create({
        data: u,
      });
      console.log(`Created user with id: ${user.id}`);
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
