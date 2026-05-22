import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const startServer = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MONGO DB CONNECTED! DB HOST: ${connectionInstance.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`LISTENING ON PORT ${app.get("port")}`);
    });
  } catch (error) {
    console.error("MONGODB connection error: ", error);
    process.exit(1);
  }
};

startServer();