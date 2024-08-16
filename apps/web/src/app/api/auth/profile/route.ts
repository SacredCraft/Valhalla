import { auth } from "@/server/auth";
import { db } from "@sacred-craft/valhalla-database";

const handler = async () => {
  const session = await auth();

  if (!session || session.user?.id === undefined) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  return Response.json(user);
};

export { handler as GET, handler as POST };
