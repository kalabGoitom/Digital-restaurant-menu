import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async () => {
  await prisma.$connect();
  console.log("Database connected");
};

const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log("Database disconnected");
};

export { prisma, connectDB, disconnectDB };
