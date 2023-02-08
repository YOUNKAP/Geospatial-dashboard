import connectMongoDB from "../../../mongoDB/mongoDB";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { db } = await connectMongoDB();

    let users = await db.collection("internal_users").find({}).toArray();

    let userList = users.map((user) => {
      const { _id, ...rest } = user;
      return rest;
    });

    res.send(userList);
  }
}
