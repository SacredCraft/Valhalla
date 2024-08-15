import { auth } from "@/server/auth";

const handler = async () => {
  const session = await auth();

  if (!session || session.user?.id === undefined) {
    return new Response("Unauthorized", { status: 401 });
  }

  return Response.json(session.user);
};

export { handler as GET, handler as POST };
