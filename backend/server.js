"use strict";

// Read the .env file.
require("dotenv").config();

// Require the framework
const Fastify = require("fastify");
const cors = require("@fastify/cors");

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
  pluginTimeout: 120000,
});
// configure cors
app.register(cors, {
  origin: true,
});

// Register your application as a normal plugin.
app.register(require("./app.js"));

// Start listening.
app.listen(process.env.PORT || 8080, "0.0.0.0", (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
