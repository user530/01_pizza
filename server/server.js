require("dotenv").config({ path: "./.env" });

const express = require("express");
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("SERVER IS UNDER CONSTRUCTION"));

void (function start() {
  try {
    app.listen(port, () => {
      console.log("Server is up and running at port " + port);
    });
  } catch (error) {
    console.log("Server failed to start, terminating...");
    console.error(error);
    process.exit(1);
  }
})();
