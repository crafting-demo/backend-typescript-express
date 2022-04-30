import express from "express";

const server = express();
const PORT = 8080;

// TODO:
// cors
// dotenv (port and envs)

server.use(express.json());

// TODO: handler
server.post("/", (req, res) => {
  res.json(req.body);
});

server.listen(PORT);
