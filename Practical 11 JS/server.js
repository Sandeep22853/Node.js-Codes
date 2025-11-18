const http = require("http");
const fs = require("fs");
const path = require("path");

const basePath = path.join(process.cwd(), "public");

const server = http.createServer((req, res) => {
  console.log("Requested URL:", req.url);

  const requestPath = req.url === "/" ? "/index.html" : req.url;
  const normalizedPath = path.normalize(requestPath);

  const parts = normalizedPath.split("/").filter(Boolean);
  const uniqueParts = new Set(parts);

  let filePath;
  if (uniqueParts.size !== parts.length) {
    console.log("⚠  Redundancy detected — resolving with path.resolve()");
    filePath = path.resolve(basePath, normalizedPath);
  } else {
    console.log("No redundancy — using path.join()");
    filePath = path.join(basePath, normalizedPath);
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - File Not Found");
      console.error("File read error:", err.message);
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});