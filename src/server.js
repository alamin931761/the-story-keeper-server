const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config");

let server;

async function main() {
  try {
    await mongoose.connect(config.database_url);

    server = app.listen(config.port, () => {
      console.log(`Listening to port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on("unhandledRejection", () => {
  console.log("😈 unhandledRejection is detected. shutting down the server");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("😈 uncaughtException is detected. shutting down the server");

  process.exit(1);
});
