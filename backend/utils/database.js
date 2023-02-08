"use strict";
const { MongoClient } = require("mongodb");

// for demo only, replace with env variables when stable
let uri =
  "mongodb+srv://skyhawk1:Uyulo9WjXkdG0C5I@cluster0.45wrsmn.mongodb.net/?retryWrites=true&w=majority";
let dbName = "skyhawk-demo";

let cachedClient = null;
let cachedDb = null;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!dbName) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

module.exports = async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
};
