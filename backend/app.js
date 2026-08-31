import "dotenv/config";
import cors from "cors";
import express, { json } from "express";
import authRouters from "./src/routes/auth.js";
import adminRoutes from "./src/routes/admin.js";
import publicRouters from "./src/routes/public.js";
import { connectDB, disconnectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import notFound from "./src/middlewares/notFound.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use("/api/admin", authRouters);
app.use("/api/admin", adminRoutes);
app.use("/api/menu", publicRouters);
app.use(notFound);

const port = process.env.PORT || 5000;
let server;
const start = async () => {
  try {
    await connectDB();
    server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
};
const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down`);
  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }
};
start();
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  shutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  shutdown("uncaughtException");
});
process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});
process.on("SIGINT", () => {
  shutdown("SIGINT");
});
