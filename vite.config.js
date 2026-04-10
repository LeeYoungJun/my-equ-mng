import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { writeFileSync } from "fs";
import { resolve } from "path";

const DATA_DIR = resolve(__dirname, "src/data");

const FILE_MAP = {
  members: {
    path: resolve(DATA_DIR, "members.js"),
    exportName: "INITIAL_MEMBERS",
  },
  assets: {
    path: resolve(DATA_DIR, "assets.js"),
    exportName: "INITIAL_ASSETS",
  },
  history: {
    path: resolve(DATA_DIR, "history.js"),
    exportName: "INITIAL_HISTORY",
  },
};

function persistPlugin() {
  return {
    name: "persist-data",
    configureServer(server) {
      server.middlewares.use("/api/persist", async (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end();
          return;
        }
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const { key, data } = JSON.parse(body);
            const target = FILE_MAP[key];
            if (!target) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: "unknown key" }));
              return;
            }
            const content = `export const ${target.exportName} = ${JSON.stringify(data, null, 2)};\n`;
            writeFileSync(target.path, content, "utf-8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), persistPlugin()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
});
