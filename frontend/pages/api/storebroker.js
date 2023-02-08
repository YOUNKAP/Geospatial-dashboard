import connectMongoDB from "../../mongoDB/mongoDB";
import Fuse from "fuse.js";
import moment from "moment";

export default async function handler(req, res) {
  if (req.method === "GET") {
    let searchQuery = req.query.search;

    let { db } = await connectMongoDB();
    let data = await db
      .collection("broker")
      .find()
      .sort({ $natural: -1 })
      .toArray();

    data.forEach(
      (item) => (item.formatted_date = moment(item.Date).format("MMM D, YYYY"))
    );

    if (searchQuery) {
      const options = {
        keys: [
          "Email",
          "Price",
          "Area",
          "Name",
          "Company",
          "analysis.totalRiskScore",
          "formatted_date",
          "BrokerName",
          "BrokerID",
        ],
      };

      const fuse = new Fuse(data, options);
      const pattern = searchQuery;

      data = fuse.search(pattern).map((x) => x.item);
    }
    res.send(data);
  } else if (req.method === "POST") {
    let { db } = await connectMongoDB();
    db.collection("broker").insertMany(req.body);
    res.status(200).json({ message: req.body });
  }
}
