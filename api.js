const express = require("express");
const { spawn } = require("child_process");
var cors = require("cors");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();
const port = 3000;

app.use(cors());

app.get("/api/calculate", async (req, res) => {
  const result = await (
    await fetch("http://localhost:8000" + req.originalUrl)
  ).json();

  console.log(result);

  res.send(result);
});

app.get("/api/generate", (req, res) => {
  fs.readFile("nounlist.txt", "utf-8", function (err, data) {
    if (err) {
      throw err;
    }
    var lines = data.split("\n");

    var line = lines[Math.floor(Math.random() * lines.length)].trim();

    res.send({ word: line });
  });
});

app.listen(port, () =>
  console.log(`Example app listening on port 
${port}!`)
);
