import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import cors from "cors";

const app = express();
const server = createServer(app);

app.set("port", process.env.PORT || 8000);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

server.listen(app.get("port"), () => {
  console.log(`LISTENING ON PORT ${app.get("port")}`);
});