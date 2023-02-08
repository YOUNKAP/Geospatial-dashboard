"use strict";
const connectToDatabase = require("../../utils/database");

const layersWeights = [
  {
    name: "wastewater",
    benefitWeight: 0,
    riskWeight: 1.2,
  },
  {
    name: "railroads",
    benefitWeight: 2,
    riskWeight: 0.3,
  },
  {
    name: "faults",
    benefitWeight: 0,
    riskWeight: 5,
  },
  {
    name: "volcanoes",
    benefitWeight: 0,
    riskWeight: 5,
  },
  {
    name: "fuelst",
    benefitWeight: 1,
    riskWeight: 0.2,
  },
  {
    name: "hospitals",
    benefitWeight: 1.5,
    riskWeight: 0.2,
  },
  {
    name: "universities",
    benefitWeight: 1,
    riskWeight: 0.1,
  },
  //   {
  //     name: "land_use",
  //     benefitWeight: 0,
  //     riskWeight: 2,
  //   },
  {
    name: "nuclear",
    benefitWeight: 0,
    riskWeight: 2.5,
  },
  {
    name: "airports",
    benefitWeight: 0,
    riskWeight: 2.5,
  },
  //   {
  //     name: "sediment_housecollapse",
  //     benefitWeight: 0,
  //     riskWeight: 6,
  //   },
  {
    name: "schools",
    benefitWeight: 2,
    riskWeight: 0,
  },
  {
    name: "ports",
    benefitWeight: 2,
    riskWeight: 1,
  },
  {
    name: "sediment_inundur",
    benefitWeight: 0,
    riskWeight: 5,
  },
  {
    name: "ferries",
    benefitWeight: 0.5,
    riskWeight: 0.1,
  },
  {
    name: "railwaysln",
    benefitWeight: 2,
    riskWeight: 0,
  },
  //   {
  //     name: "bizareas",
  //     benefitWeight: 0.5,
  //     riskWeight: 1,
  //   },
  {
    name: "submarine_landing",
    benefitWeight: 0.3,
    riskWeight: 0.4,
  },
];

module.exports = async function (fastify, opts) {
  const { db } = await connectToDatabase();
  fastify.get("/analyze", async function (req, res) {
    const lon = req.query.lon;
    const lat = req.query.lat;
    const radius = req.query.radius;

    if (lon && lat && radius) {
      console.log("start");
      let analysisResults = {
        ...req.query,
        totalRiskScore: 0,
        qualifiedArea: false,
        scoreFactors: [],
      };
      for (var i = 0; i < layersWeights.length; i++) {
        let lx = layersWeights[i];
        const targetLayer = lx.name;
        await db.collection(targetLayer).createIndex({ geometry: "2dsphere" });
        let layerQuery = await db
          .collection(targetLayer)
          .find({
            geometry: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [Number(lon), Number(lat)],
                },
                $minDistance: 50,
                $maxDistance: Number(radius) * 1000,
              },
            },
          })
          .limit(50)
          .toArray();

        if (layerQuery.length !== 0) {
          analysisResults.totalRiskScore += lx.riskWeight;
          //   if (analysisResults.totalRiskScore > lx.benefitWeight) {
          //     analysisResults.totalRiskScore -= lx.benefitWeight;
          //   }

          layerQuery.forEach((item) => {
            analysisResults.scoreFactors.push({
              name: lx.name,
              details: item.properties,
              riskWeight: lx.riskWeight,
              distance: 0,
            });
          });

          if (analysisResults.totalRiskScore < 3) {
            analysisResults.qualifiedArea = true;
          } else {
            analysisResults.qualifiedArea = false;
          }

          console.log(targetLayer, layerQuery.length);
        }
      }
      console.log("end");
      return analysisResults;
      //   };
    } else {
      return { message: "Incomplete Parameters" };
    }
  });
};
