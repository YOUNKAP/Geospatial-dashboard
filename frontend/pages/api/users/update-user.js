import connectMongoDB from "../../../mongoDB/mongoDB";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let { db } = await connectMongoDB();

    const userUpdates = req.body.updates;

    if (!userUpdates) {
      res.status(400).send({ message: "Bad Request!" });
    }

    const { email, ...remUpdates } = userUpdates;

    const updateUser = await db.collection("internal_users").updateOne(
      { email: email },
      {
        $set: remUpdates,
      },
      { upsert: true }
    );

    console.log(remUpdates, updateUser);

    res.send({ message: "Update successful" });
  }
}
