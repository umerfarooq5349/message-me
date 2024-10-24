import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let mongoClient: MongoClient;

if (process.env.NODE_ENV === "development") {
  // Use a global variable in development to avoid opening multiple connections during HMR
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  mongoClient = globalWithMongo._mongoClient;
} else {
  // For production, don't store the client globally
  mongoClient = new MongoClient(uri, options);
}

export default mongoClient;
