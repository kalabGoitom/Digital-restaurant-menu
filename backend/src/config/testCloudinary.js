import "dotenv/config";
import cloudinary from "./cloudinary.js";

const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();

    console.log("Cloudinary connection successful!");
    console.log(result);
  } catch (error) {
    console.error("Cloudinary connection failed:");
    console.error(error.message);
  }
};

testCloudinaryConnection();
