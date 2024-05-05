import dotenv from "dotenv";
dotenv.config();
export default {
  redisUrl: process.env.REDIS_URL,
  baseUrl: process.env.BASE_URL,
};
