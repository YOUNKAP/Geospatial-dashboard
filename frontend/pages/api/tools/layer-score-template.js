import connectMongoDB from "../../../mongoDB/mongoDB";

export default async function handler(req, res) {
  const { db } = await connectMongoDB();

  let layers = await db.listCollections().toArray();

  layers = layers.map((layer) => ({
    name: layer.name,
    benefitWeight: 0,
    riskWeight: 0,
  }));
  res.send(layers);
}
