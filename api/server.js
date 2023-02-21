// implement your server here
// require your posts router and connect it here

const express = require("express");
const server = express();
server.use(express.json());

const postsRoute = require("./../api/posts/posts-router");
server.use("/posts", postsRoute);

server.get("/", (req, res) => {
  res.status(200).json("Hello from the clean, simple and easy server.js file");
});

module.exports = server;
