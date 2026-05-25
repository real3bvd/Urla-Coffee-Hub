const { spawn } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");

function loadLocalEnv() {
  const envPath = path.resolve(__dirname, "..", ".local", "dev.env");
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const env = {};
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    env[trimmed.slice(0, separator)] = trimmed.slice(separator + 1);
  }

  return env;
}

const localEnv = loadLocalEnv();
const adminPassword = process.env.ADMIN_PASSWORD ?? localEnv.ADMIN_PASSWORD;

if (!adminPassword) {
  console.error("ADMIN_PASSWORD is missing. Add it to .local/dev.env or set it in the terminal.");
  process.exit(1);
}

const services = [
  {
    name: "API",
    port: 5000,
    args: ["pnpm", "--filter", "@workspace/api-server", "run", "dev"],
    env: { PORT: "5000", NODE_ENV: "development", ADMIN_PASSWORD: adminPassword },
  },
  {
    name: "Website",
    port: 5175,
    args: ["pnpm", "--filter", "@workspace/urlas", "run", "dev"],
    env: { PORT: "5175" },
  },
];

const children = [];

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port });
    socket.setTimeout(500);
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => resolve(false));
  });
}

function startService(service) {
  const child = spawn("corepack", service.args, {
    env: { ...process.env, ...service.env },
    shell: true,
    stdio: "inherit",
  });
  children.push(child);
}

async function main() {
  for (const service of services) {
    if (await isPortOpen(service.port)) {
      console.log(`${service.name} already running on port ${service.port}; using it.`);
      continue;
    }
    console.log(`Starting ${service.name} on port ${service.port}...`);
    startService(service);
  }

  console.log("");
  console.log("Open http://localhost:5175");
  console.log("Manage: http://localhost:5175/manage");
  console.log("Admin password loaded from local environment.");
}

function stopChildren() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on("SIGINT", () => {
  stopChildren();
  process.exit(0);
});
process.on("SIGTERM", () => {
  stopChildren();
  process.exit(0);
});

main().catch((error) => {
  console.error(error);
  stopChildren();
  process.exit(1);
});
