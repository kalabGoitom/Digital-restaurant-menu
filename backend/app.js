import "dotenv/config";
import express, { json } from "express";
import authRouters from "./src/routes/auth.js";
import adminRoutes from "./src/routes/admin.js";
import publicRouters from "./src/routes/public.js";
import { connectDB, disconnectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/admin", authRouters);
app.use("/api/admin", adminRoutes);
app.use("/api/menu/menu-items", publicRouters);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
};

start();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection", err);
  app.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtRejection", (err) => {
  console.error("Uncaught Rejection", err);
  app.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("SIGTERM", (err) => {
  console.error("SIGTERM received, shutting down");
  app.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});
