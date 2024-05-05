import { createClient } from "redis";
import responseTime from "response-time";
import config from "../config/index.js";
const redisClient = createClient({
  url: config.redisUrl,
});

// redisClient.on("error", (err) => console.log("Redis Error"));
// redisClient.on("connect", (res) => console.log("Redis connected 🚀"));
// redis connect
const redisConnect = async () => {
  await redisClient.connect();
};
const setData = async (key, data, expireTime) => {
  //console.log("time:", expireTime);
  await redisClient.set(key, data, { EX: expireTime });
};
const getData = async (key) => {
  return await redisClient.get(key);
};
const deleteData = async (key) => {
  await redisClient.del(key);
};
const redisDisconnect = async () => {
  await redisClient.quit();
};
export const RedisClient = {
  redisConnect,
  setData,
  getData,
  deleteData,
  redisDisconnect,
};
