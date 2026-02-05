require('dotenv').config();
 
const express = require("express");
const path = require("path");
const session = require("express-session");
const nodemailer = require("nodemailer");
const client = require("prom-client");
const db = require("./config/db");
 
const app = express();
 
/* =========================
   BASIC MIDDLEWARE
========================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
 
app.use(
  session({
    secret: process.env.SESSION_SECRET || "capsule-secret-change-this-in-production",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: parseInt(process.env.SESSION_MAX_AGE) || 1800000,
      secure: process.env.SECURE_COOKIES === "true",
    },
  })
);
 
/* =========================
   AUTH MIDDLEWARE
========================= */
function requireAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}
 
function requireAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") return next();
  res.status(403).send("Access denied. Admin privileges required.");
}
 
/* =========================
   ACTIVITY LOGGER
========================= */
async function logActivity(userId, type, description) {
  try {
    await db.execute(
      "INSERT INTO user_activity (user_id, activity_type, activity_description) VALUES (?, ?, ?)",
      [userId, type, description]
    );
  } catch (err) {
    console.error("Activity log error:", err);
  }
}
 
/* =========================
   PUBLIC ROUTES
========================= */
app.get("/", (req, res) => {
  if (!req.session.user)
    return res.sendFile(path.join(__dirname, "public/html/index.html"));
 
  res.redirect(req.session.user.role === "admin" ? "/admin-dashboard" : "/dashboard");
});
 
app.get("/login", (req, res) =>
  req.session.user
    ? res.redirect("/dashboard")
    : res.sendFile(path.join(__dirname, "public/html/login.html"))
);
 
app.get("/register", (req, res) =>
  req.session.user
    ? res.redirect("/dashboard")
    : res.sendFile(path.join(__dirname, "public/html/register.html"))
);
 
app.get("/contact", (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/contact.html"))
);
 
/* =========================
   USER ROUTES
========================= */
app.get("/dashboard", requireAuth, (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/dashboard.html"))
);
 
app.get("/inventory", requireAuth, (_, res) =>
  res.sendFile(path.join(__dirname, "public/html/inventory.html"))
);
 
/* =========================
   API ROUTES (EXAMPLES)
========================= */
app.post("/inventory", requireAuth, async (req, res) => {
  const { name, quantity, price, category, supplier } = req.body;
  const [result] = await db.execute(
    "INSERT INTO inventory (name, quantity, price, category, supplier) VALUES (?, ?, ?, ?, ?)",
    [name, quantity, price, category, supplier]
  );
  await logActivity(req.session.user.id, "INVENTORY_ADD", `Added ${name}`);
  res.json({ success: true, id: result.insertId });
});
 
app.get("/inventory-data", async (_, res) => {
  const [rows] = await db.execute("SELECT * FROM inventory");
  res.json(rows);
});
 
/* =========================
   HEALTH CHECK (AKS)
========================= */
app.get("/health", (_, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
 
/* =========================
   PROMETHEUS METRICS
========================= */
client.collectDefaultMetrics();
 
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request latency",
  labelNames: ["method", "route", "status"],
});
 
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () =>
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    })
  );
  next();
});
 
app.get("/metrics", async (_, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});
 
/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
