import { spawn } from "child_process";
import { program } from "commander";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: "../../.env" });

function runCommand(command: string, args: string[] = []) {
  spawn(command, args, { stdio: "inherit" });
}

program
  .name("valhalla")
  .description("CLI to manage the Valhalla project")
  .version("0.0.1");

program
  .command("dev")
  .description("run the development server")
  .option("-p, --port <port>", "port to run the server on", "3000")
  .option(
    "-H, --hostname <hostname>",
    "hostname to run the server on",
    "localhost",
  )
  .action((options) => {
    process.chdir(path.resolve(process.cwd(), "..", "..", "packages", "cli"));

    process.env.PORT = options.port;
    process.env.HOSTNAME = options.hostname;
    process.env.ENV = "development";
    runCommand("tsx", [
      "watch",
      "--ignore",
      "./../../apps/web/.next/**/*",
      "./src/server.ts",
    ]);
  });

program
  .command("build")
  .description("build the project")
  .action(() => {
    runCommand("next", ["build"]);
  });

program
  .command("start")
  .description("start the server")
  .option("-p, --port <port>", "port to run the server on", "3000")
  .option(
    "-H, --hostname <hostname>",
    "hostname to run the server on",
    "localhost",
  )
  .action((options) => {
    process.chdir(path.resolve(process.cwd(), "..", "..", "packages", "cli"));

    process.env.PORT = options.port;
    process.env.HOSTNAME = options.hostname;
    process.env.ENV = "production";
    runCommand("tsx", ["./src/server.ts"]);
  });

program.parse(process.argv);
