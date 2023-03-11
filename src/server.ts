import "isomorphic-unfetch";
import cors from "cors";
import express from "express";

import { ApiHandler } from "./handlers";
import { KafkaProducer } from "./kafka";
import { logger } from "./logger";

const server = express();
const { PORT } = process.env;
if (!PORT) {
  logger.Write("Server: PORT must be set");
  process.exit(1);
}

server.use(express.json());
server.use(cors());

server.post("/api", ApiHandler);
KafkaProducer.getInstance().start();

server.listen(PORT, () => {
  logger.Write(`Server: listening on port ${PORT}`);
});
