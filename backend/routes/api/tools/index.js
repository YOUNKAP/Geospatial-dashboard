"use strict";
const connectToDatabase = require("../../../utils/database");

module.exports = async function (fastify, opts) {
  // provides a template object for all the layers and their respective weights
  const { db } = await connectToDatabase();
  fastify.get("/layer-score-template", async function (req, res) {
    let layers = await db.listCollections().toArray();

    layers = layers.map((layer) => ({
      name: layer.name,
      benefitWeight: 0,
      riskWeight: 0,
    }));

    return layers;
  });
};
