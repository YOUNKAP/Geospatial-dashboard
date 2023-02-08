import connectMongoDB from "../../mongoDB/mongoDB";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { db } = await connectMongoDB();
    const email = req.body.email;

    let validUsers = await db.collection("internal_users").find({}).toArray();

    console.log("Checking internal user =>", email);

    const checkAccess = validUsers.find((x) => x.email === email);

    let accessStatus;

    if (checkAccess) {
      accessStatus = "valid user";
    }

    if (!checkAccess) {
      accessStatus = "invalid user";
    }

    res.send(accessStatus);
  }
}
