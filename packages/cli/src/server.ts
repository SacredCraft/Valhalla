import dotenv from "dotenv";
import kleur from "kleur";
import next from "next";
import { createServer } from "node:http";
import { parse } from "node:url";
import path from "path";
import { WebSocketServer } from "ws";

import { Server, configuration } from "@sacred-craft/valhalla-collaboration";

import meta from "../../../apps/web/package.json";

dotenv.config({ path: "../../.env" });

const port = parseInt(process.env.PORT || "3000", 10);

const hostname = process.env.HOSTNAME || "localhost";
const dev = process.env.ENV !== "production";

process.chdir(path.resolve(process.cwd(), "..", "..", "apps", "web"));

const app = next({
  dev,
  hostname,
  dir: process.cwd(),
});
const handler = app.getRequestHandler();

void app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    if (!req.url) return;
    const parsedUrl = parse(req.url, true);
    await handler(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ server });

  const hocuspocus = Server.configure(configuration());

  wss.on("connection", (server, request) => {
    hocuspocus.handleConnection(server as any, request);
  });

  const originalOn = server.on.bind(server);
  server.on = function (event, listener) {
    return event !== "upgrade" ? originalOn(event, listener) : server;
  };

  server.once("error", (err) => {
    console.error(err);
    process.exit(1);
  });

  server.listen(port);

  console.log();
  console.log(
    `  ${kleur.cyan(`Valhalla v${meta.version}`)}${kleur.green(" running at:")}`,
  );
  console.log();
  console.log(`  > NextJS: ${kleur.cyan(`http://${hostname}:${port}`)}`);
  console.log(`  > WebSocket: ${`ws://${hostname}:${port}`}`);
  console.log(
    `  > Environment: ${kleur.cyan(dev ? "Development" : "Production")}`,
  );
  console.log();

  console.log("  Extensions:");

  console.log(`  - ValhallaAuth`);
  console.log(`  - ValhallaCollaboration`);
  console.log(`  - ValhallaDatabase`);

  console.log();
  console.log(`  ${kleur.green("Ready.")}`);
  console.log();
});
