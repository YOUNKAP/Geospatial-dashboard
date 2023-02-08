import connectMongoDB from "../../../mongoDB/mongoDB";

const EXCLUDED_COLLECTIONS = ["broker", "internal_users", "score_weights"];

export default async function handler(req, res) {
  const { db } = await connectMongoDB();

  let defaultLayers = await db.listCollections().toArray();

  defaultLayers = defaultLayers
    .filter((x) => !EXCLUDED_COLLECTIONS.includes(x.name))
    .map((layer) => ({
      name: layer.name,
      layer_name: layer.name.split("_").join(" "),
      classification: "general",
      benefitWeight: 0,
      riskWeight: 0,
      disqualification_zone: 0.804672,
      status: "enabled",
    }));

  res.send(defaultLayers);
}
