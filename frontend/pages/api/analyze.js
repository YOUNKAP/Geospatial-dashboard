import connectMongoDB from "../../mongoDB/mongoDB";
import { layerMetaData } from "../../components/MainTab/layerMetaData";
import { layersWeights } from "../../utilities/layerWeights";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { db } = await connectMongoDB();

    const { lat, lon, radius, weightSettings } = req.body;

    let layerWeightSettings = [...weightSettings];
    // only use items that has risk and benefit weight
    layerWeightSettings = layerWeightSettings.filter(
      (lx) => lx.status !== "skipped"
    );

    if (lon && lat && radius && layerWeightSettings) {
      console.log(
        `[Skyhawk] Start Analysis: Layers (${layerWeightSettings.length})`
      );
      let analysisResults = {
        lat: lat,
        lon: lon,
        radius: radius,
        totalRiskScore: 0,
        qualifiedArea: false,
        factorSummary: [],
        scoreFactors: [],
        autoDisqualified: false,
      };
      for (var i = 0; i < layerWeightSettings.length; i++) {
        let lx = layerWeightSettings[i];
        const targetLayer = lx.name;

        let layerQuery = [];

        if (!lx.testWithin) {
          await db
            .collection(targetLayer)
            .createIndex({ geometry: "2dsphere" });
          layerQuery = await db
            .collection(targetLayer)
            .aggregate([
              {
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [Number(lon), Number(lat)],
                  },
                  distanceField: "dist.calculated",
                  maxDistance: Number(radius) * 1000,
                  includeLocs: "dist.geometry",
                  spherical: true,
                },
              },
            ])
            .limit(1)
            .toArray();

          // check if layer satisfies the qualification rules. GeoNear
          let layerData = layersWeights.find((x) => x.name === targetLayer);
          if (layerData && layerData.minDistance) {
            console.log(
              "[Skyhawk]: (GeoNear) Scanning for possible disqualifications.."
            );
            let disqualifications = layerQuery.filter(
              (x) => x.dist.calculated / 1000 < layerData.minDistance
            );
            if (disqualifications.length !== 0) {
              console.log(
                "[Skyhawk]: (GeoNear) Item Disqualified. Reason =>",
                targetLayer
              );
              analysisResults.totalRiskScore = 10;
              analysisResults.qualifiedArea = false;
              analysisResults.autoDisqualified = true;
              layerData = {
                ...layerData,
                details: disqualifications[0].properties,
                distance: disqualifications[0].dist
                  ? disqualifications[0].dist
                  : { calculated: 100 },
                iconColor:
                  disqualifications[0].riskWeight >
                  disqualifications[0].benefitWeight
                    ? "text-danger"
                    : "text-success",
              };

              layerData.name = layerData.name.split("_").join(" ");
              analysisResults.scoreFactors.push(layerData);

              // generate factor summary
              analysisResults.scoreFactors.forEach((factor) => {
                let factorMetadata = layerMetaData.find((x) =>
                  x.name.toLowerCase().includes(factor.name.toLowerCase())
                );

                // use generic metadata if no meta data is available
                if (!factorMetadata) {
                  factorMetadata = {
                    name: factor.name,
                    description: "Score factor placeholder",
                    icon: "/images/satellite.png",
                  };
                }

                let factorInstance = analysisResults.factorSummary.find(
                  (x) => x.name && x.name.toLowerCase() === factor.name
                );

                if (factorInstance) {
                  let factorIndex =
                    analysisResults.factorSummary.indexOf(factorInstance);
                  analysisResults.factorSummary[factorIndex].count += 1;
                } else {
                  analysisResults.factorSummary.push({
                    ...factorMetadata,
                    count: 1,
                    riskWeight: factor.riskWeight,
                    benefitWeight: factor.benefitWeight,
                    distance: factor.distance,
                    minDistance: factor.minDistance ? factor.minDistance : 0,
                  });
                }
              });

              // sort factor summary by minDistance for diqualified areas
              analysisResults.factorSummary =
                analysisResults.factorSummary.sort(
                  (a, b) => b.minDistance - a.minDistance
                );

              res.send(analysisResults);
              return false;
            }
          }
          // end of disqualification checker for geoNear
        } else {
          layerQuery = await db
            .collection(targetLayer)
            .find({
              geometry: {
                $geoIntersects: {
                  $geometry: {
                    type: "Point",
                    coordinates: [Number(lon), Number(lat)],
                  },
                },
              },
            })
            .limit(50)
            .toArray();
          console.log("Check Intersect =>", targetLayer, layerQuery.length);
        }

        if (layerQuery.length !== 0) {
          layerQuery.forEach((item) => {
            analysisResults.scoreFactors.push({
              name: lx.name.split("_").join(" "),
              details: item.properties,
              riskWeight: lx.riskWeight,
              benefitWeight: lx.benefitWeight,
              distance: item.dist ? item.dist : { calculated: 100 },
              minDistance: lx.minDistance ? lx.minDistance : 0,
              iconColor:
                lx.riskWeight > lx.benefitWeight
                  ? "text-danger"
                  : "text-success",
            });
          });

          console.log(targetLayer, layerQuery.length);
        }
      }

      // calculate score
      analysisResults.scoreFactors.forEach((factor) => {
        const minDistance = 120;
        let distance = factor.distance.calculated;
        let distanceKM = distance / 1000;

        if (factor.distance.calculated === 0) {
          distanceKM = 0;
        }

        // make sure that distance does not go below minDistance (meters)
        if (distance < minDistance) {
          distanceKM = minDistance / 1000;
        }

        if (factor.riskWeight !== 0) {
          if (distanceKM != 0) {
            analysisResults.totalRiskScore +=
              (factor.riskWeight - factor.benefitWeight / distanceKM) * 0.1;
          }

          if (distanceKM === 0) {
            analysisResults.totalRiskScore +=
              factor.riskWeight - factor.benefitWeight * 0.1;
          }
        }
      });

      // determine qualification of area
      if (analysisResults.totalRiskScore < 3) {
        analysisResults.qualifiedArea = true;
      } else {
        analysisResults.qualifiedArea = false;
      }

      // post process analysis results
      analysisResults.scoreFactors = analysisResults.scoreFactors.sort(
        (a, b) => b.riskWeight - a.riskWeight
      );

      // generate factor summary
      analysisResults.scoreFactors.forEach((factor) => {
        let factorMetadata = layerMetaData.find((x) =>
          x.name.toLowerCase().includes(factor.name.toLowerCase())
        );

        // use generic metadata if no meta data is available
        if (!factorMetadata) {
          factorMetadata = {
            name: factor.name,
            description: "Score factor placeholder",
            icon: "/images/satellite.png",
          };
        }

        let factorInstance = analysisResults.factorSummary.find(
          (x) => x.name && x.name.toLowerCase() === factor.name
        );

        if (factorInstance) {
          let factorIndex =
            analysisResults.factorSummary.indexOf(factorInstance);
          analysisResults.factorSummary[factorIndex].count += 1;
        } else {
          analysisResults.factorSummary.push({
            ...factorMetadata,
            count: 1,
            riskWeight: factor.riskWeight,
            benefitWeight: factor.benefitWeight,
            distance: factor.distance,
          });
        }
      });

      // sort factor summary by risk weight
      analysisResults.factorSummary = analysisResults.factorSummary.sort(
        (a, b) => b.riskWeight - a.riskWeight
      );

      console.log("[Skyhawk] END Analysis");

      res.send(analysisResults);
    } else {
      res.send({ message: "Incomplete Parameters" });
    }
  } else {
    res.status(400).json({ message: "Bad Request" });
  }
}
