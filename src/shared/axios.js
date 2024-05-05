import axios from "axios";
import config from "../config/index.js";

const HttpServer = (baseURL) => {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000, // 10 sec its have mili second
    headers: { "Content-Type": "Application/json" },
  });
  instance.interceptors.request.use(
    (coonfig) => {
      return coonfig;
    },
    (error) => {
      return error;
    }
  );
  instance.interceptors.response.use(
    (response) => {
      return response?.data;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return instance;
};

const axiosService = HttpServer(config.baseUrl);
const usersService = HttpServer(config.baseUrl);
export { HttpServer, axiosService, usersService };
