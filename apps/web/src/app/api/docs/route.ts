import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

export const POST = async (req: Request) => {
  const session = await auth();

  if (!session || session.user?.id === undefined) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await req.json()) as { documentName: string };

  const user = await api.users.getUserById({ id: session.user.id });

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (user.role === "ADMIN") {
    return new Response("OK", { status: 200 });
  }

  const { documentName } = body;

  if (!documentName) {
    return new Response("Bad Request", { status: 400 });
  }

  const [resource] = documentName.split(" ");

  if (!resource) {
    return new Response("Bad Request", { status: 400 });
  }

  const ownedResources = await api.resources.getOwnedResources();

  const hasAccess = ownedResources.includes(resource);

  if (!hasAccess) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response("OK", { status: 200 });
};
