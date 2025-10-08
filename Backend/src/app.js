import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import sequelize from "../config/db.js";

const PORT = "5000";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // only allow our React app
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });

sequelize
  .sync({ alter: true }) // or { force: true } to drop & recreate tables
  .then(() => {
    console.log("✅ All tables synced successfully");
  })
  .catch((err) => {
    console.error("❌ Table sync error:", err);
  });

// ========================== Server start =============================///
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;
