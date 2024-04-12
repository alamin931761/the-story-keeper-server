const express = require("express");
const notFound = require("./app/middlewares/notFound");
const router = require("./app/routes");

const app = express();
const cors = require("cors");
const globalErrorHandler = require("./app/middlewares/globalErrorHandler");

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Hello from The Story Keeper!");
});

app.use(globalErrorHandler);
app.use(notFound);

module.exports = app;
