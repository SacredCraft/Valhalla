import { cookies } from "next/headers";

const handler = async () => {
  return new Response(cookies().toString(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

export { handler as GET, handler as POST };
