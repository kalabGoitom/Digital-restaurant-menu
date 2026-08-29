import crypto from "crypto";
import bcrypt from "bcryptjs";

const generateVerificationCode = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const hashVerificationCode = async (code) => {
  return await bcrypt.hash(code, 10);
};

const compareVerificationCode = async (code, hashedCode) => {
  return await bcrypt.compare(code, hashedCode);
};

export {
  generateVerificationCode,
  hashVerificationCode,
  compareVerificationCode,
};
