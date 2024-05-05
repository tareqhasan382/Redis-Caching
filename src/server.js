import express from "express";
import axios from "axios";
import responseTime from "response-time";
import { RedisClient } from "./shared/redis.js";

const app = express();
const port = 8000;

app.use(responseTime());
app.use(express.json());

let server;

async function main() {
  await RedisClient.redisConnect();
  try {
    // Define routes
    app.get("/", (req, res) => {
      res
        .status(200)
        .json({ status: 200, message: "Our server is Running 🚀" });
    });

    // Route to fetch and cache user data
    app.get("/users", async (req, res) => {
      try {
        // Check if user data is cached
        //await RedisClient.deleteData("userData");
        const cachedData = await RedisClient.getData("userData");
        if (cachedData) {
          console.log("Returning cached user data...");
          return res.status(200).json(JSON.parse(cachedData));
        }

        // If not cached, fetch from the API
        console.log("fetch data");
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        const userData = response.data;

        // Cache the fetched user data with an expiration time of 60 seconds
        await RedisClient.setData("userData", JSON.stringify(userData), 60);

        res.status(200).json(userData);
      } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal Server Error");
      }
    });

    // Route not found handling
    app.use((req, res, next) => {
      res.status(404).json({
        success: false,
        message: "Not Found",
        errorMessage: [{ path: req.originalUrl, message: "API NOT FOUND!" }],
      });
    });

    // Start server
    server = app.listen(port, () => {
      console.log(`Application app listening on port ${port}`);
    });

    // Handle unhandled rejections
    process.on("unhandledRejection", (error) => {
      console.error("Unhandled Rejection:", error);
      if (server) {
        server.close(() => {
          console.log("Server closed due to unhandled rejection");
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    // Handle SIGTERM signal
    process.on("SIGTERM", () => {
      console.log("SIGTERM is received");
      if (server) {
        server.close(() => {
          console.log("Server closed due to SIGTERM signal");
        });
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
