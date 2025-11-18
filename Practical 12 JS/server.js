import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import { body, validationResult } from "express-validator";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ["https://example.com", "http://localhost:3000"];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error("Not allowed by CORS"));
    },
  })
);

app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  req.id = req.get("X-Request-Id") || randomUUID();
  res.setHeader("X-Request-Id", req.id);

  const originalSend = res.send.bind(res);
  res.send = (body) => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    res.setHeader("X-Response-Time-ms", durationMs.toFixed(3));
    return originalSend(body);
  };

  next();
});

app.use(express.json({ limit: "1mb", strict: true }));

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get("/", (req, res) => {
  res.type("html").send(`
    <h1>✅ Middleware Pipeline Demo</h1>
    <p>Server is running at <code>http://localhost:${PORT}</code></p>
    <ul>
      <li><a href="/ping">GET /ping</a> – test endpoint</li>
      <li><code>POST /echo</code> – send JSON { "message": "Hello" }</li>
    </ul>
  `);
});

app.post(
  "/echo",
  [
    body("message")
      .isString()
      .isLength({ min: 1 })
      .withMessage("message must be a non-empty string"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const problem = {
        type: "https://example.com/validation-error",
        title: "Invalid request parameters",
        status: 400,
        detail: "Validation failed for one or more parameters",
        errors: errors.array(),
      };
      return res.status(400).type("application/problem+json").json(problem);
    }

    // Simulate async work
    await new Promise((resolve) => setTimeout(resolve, 50));

    res.json({
      requestId: req.id,
      echoed: req.body.message,
    });
  })
);

// ───────────────────────────────────────────────
// 7️⃣ Simple test endpoint
// ───────────────────────────────────────────────
app.get(
  "/ping",
  asyncHandler(async (req, res) => {
    res.json({ requestId: req.id, pong: true });
  })
);

// ───────────────────────────────────────────────
// 8️⃣ Centralized RFC-7807 error handler
// ───────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("Error:", err);

  const status = err.status || 500;
  const problem = {
    type: "about:blank",
    title: err.message || "Internal Server Error",
    status,
    detail: process.env.NODE_ENV === "production" ? undefined : err.stack,
  };

  res.status(status).type("application/problem+json").json(problem);
});

// ───────────────────────────────────────────────
// 9️⃣ Unhandled rejection / exception safety
// ───────────────────────────────────────────────
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// ───────────────────────────────────────────────
// 🔟 Start Server
// ───────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
