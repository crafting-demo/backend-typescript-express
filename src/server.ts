import "isomorphic-unfetch";
import cors from "cors";
import express from "express";

import { ApiHandler } from "./handlers";
import { KafkaProducer } from "./kafka";
import { logger } from "./logger";

const server = express();
var { PORT } = process.env;
if (!PORT) {
  PORT = "8080";
}

server.use(express.json());
server.use(cors());

server.post("/api", ApiHandler);
KafkaProducer.getInstance().start();

server.listen(PORT, () => {
  logger.Write(`Server: listening on port ${PORT}`);
});
