import express from "express";

const server = express();
const PORT = 8080;

server.use(express.json());

server.get("/", (req, res) => {
  res.json(req.body);
});

server.listen(PORT);
