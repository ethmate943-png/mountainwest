/**
 * Local security-awareness demo server.
 *
 * Serves a clearly-labeled phishing simulation on 127.0.0.1 only.
 * Captured input is printed to this terminal and discarded — it is never
 * sent anywhere over the network.
 *
 * Usage: node server.js   (http://127.0.0.1:4321)
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const HOST = "127.0.0.1";
const PORT = process.env.PORT || 4321;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/event") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10_000) req.destroy();
    });
    req.on("end", () => {
      let parsed = {};
      try {
        parsed = JSON.parse(body || "{}");
      } catch {
        parsed = { parse_error: true };
      }

      const line = `[${new Date().toISOString()}] ${parsed.step || "event"} ${JSON.stringify(
        parsed.data || {},
      )}`;
      console.log(line);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, note: "logged locally only" }));
    });
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405);
    res.end("Method Not Allowed");
    return;
  }

  const urlPath = req.url.split("?")[0];
  const rel = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, rel));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
    });
    res.end(req.method === "HEAD" ? undefined : data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`\nSecurity-awareness demo running at http://${HOST}:${PORT}`);
  console.log("Simulation only. Captured input is printed to this terminal and discarded.\n");
});
