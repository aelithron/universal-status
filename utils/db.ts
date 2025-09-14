import { UserDoc } from "@/universalstatus";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}
if (!uri) throw new Error("No MONGODB_URI environment variable.");
 
let client: MongoClient;
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line prefer-const
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  }
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri, options);
}
export default client;

export async function createUserDoc(user: string): Promise<UserDoc | null> {
  const userDoc: UserDoc = { 
    _id: new ObjectId(),
    user: user,
    status: { status: "Just joined Universal Status!", emoji: "✨", setAt: new Date() },
    previousStatuses: [],
    slackToken: null,
    githubToken: null,
    statusCafeCookie: null,
    statusCafeToken: null
  };
  await client.db(process.env.MONGODB_DB).collection<UserDoc>("statuses").insertOne(userDoc);
  return userDoc;
}
export async function getUserDoc(user: string): Promise<UserDoc | null> {
  return await client.db(process.env.MONGODB_DB).collection<UserDoc>("statuses").findOne({ user });
}

export async function enterSlackToken(user: string, slackToken: string | null) {
  const collection = client.db(process.env.MONGODB_DB).collection<UserDoc>("statuses");
  await collection.updateOne({ user: user }, {
    $set: {
      slackToken: slackToken
    }
  });
}