import { ObjectId } from "mongodb";
import connectMongoDB from "../../mongoDB/mongoDB";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let { db } = await connectMongoDB();

    const documentID = req.body.documentId;

    if (!documentID) {
      res.status(400).send({ message: "Bad Request!" });
    }

    const deletion = await db.collection("broker").deleteOne({
      _id: ObjectId(documentID),
    });
    res.send({ message: "Sucessfully deleted", id: documentID });
  }
}
