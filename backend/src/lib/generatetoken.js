import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // will be true ✅
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // must be "none" in prod ✅
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  return token;
};

export default generateToken;
