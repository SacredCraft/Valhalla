import ky from "ky";

import { Extension, onAuthenticatePayload } from "@hocuspocus/server";

function getBaseUrl() {
  // eslint-disable-next-line no-undef
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export class ValhallaAuth implements Extension {
  async onAuthenticate({ documentName, token }: onAuthenticatePayload) {
    const user = await ky
      .post(`${getBaseUrl()}/api/docs`, {
        json: {
          documentName,
        },
        headers: {
          cookie: token,
        },
      })
      .text()
      .catch(() => null);

    if (!user) {
      throw new Error("Unauthorized");
    }

    return {};
  }
}
