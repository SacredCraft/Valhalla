import { Server } from "@hocuspocus/server";

import { configuration } from "./configuration";

const server = Server.configure(
  configuration({
    port: 1234,
  }),
);

void server.listen();
