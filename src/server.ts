import cors from "cors";
import express from "express";

import { NestedCallHandler } from "./handlers";
import { logger } from "./logger";

const server = express();
const { PORT } = process.env;
if (!PORT) {
  logger.Write("server", "PORT must be set", null);
  process.exit(1);
}

server.use(express.json());
server.use(cors());

server.post("/api", NestedCallHandler);

server.listen(PORT, () => {
  logger.Write("server listening on port", PORT, null);
});
