"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/hello-world", async function (request, reply) {
    return "Hello World! this is an route.";
  });
};
