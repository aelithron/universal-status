import { UserDoc } from "@/universalstatus";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
}

let client: MongoClient | undefined;
export default function getClient() {
  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("There is no MONGODB_URI environment variable, please include one!")
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line prefer-const
      let globalWithMongo = global as typeof globalThis & { _mongoClient?: MongoClient; }
      if (!globalWithMongo._mongoClient) globalWithMongo._mongoClient = new MongoClient(uri, options);
      client = globalWithMongo._mongoClient;
    } else client = new MongoClient(uri, options);
  }
  return client;
}

export async function createUserDoc(user: string): Promise<UserDoc | null> {
  const userDoc: UserDoc = {
    _id: new ObjectId(),
    user: user,
    status: { status: "Just joined Universal Status!", emoji: "✨", expiry: null, setAt: new Date() },
    previousStatuses: [],
    slackToken: null,
    githubToken: null,
    statusCafeCookie: null,
    statusCafeCSRF: null
  };
  await getClient().db(process.env.MONGODB_DB).collection<UserDoc>("statuses").insertOne(userDoc);
  return userDoc;
}
export async function getUserDoc(user: string): Promise<UserDoc | null> {
  const userDoc = await getClient().db(process.env.MONGODB_DB).collection<UserDoc>("statuses").findOne({ user });
  if (userDoc && userDoc.status.expiry && new Date(userDoc?.status.expiry) <= new Date()) {
    const oldStatuses = userDoc.previousStatuses;
    oldStatuses.push(userDoc.status);
    await getClient().db(process.env.MONGODB_DB).collection<UserDoc>("statuses").updateOne({ user: userDoc.user }, {
      $set: {
        status: { status: "No status set.", emoji: "✨", expiry: null, setAt: new Date() },
        previousStatuses: oldStatuses
      },
    });
    userDoc.status = { status: "No status set.", emoji: "✨", expiry: null, setAt: new Date() };
  }
  return userDoc;
}