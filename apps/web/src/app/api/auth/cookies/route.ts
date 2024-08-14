import { cookies } from "next/headers";

const handler = async () => {
  return cookies().toString();
};

export { handler as GET, handler as POST };
