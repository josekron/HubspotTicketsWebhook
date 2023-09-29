import * as mongoose from "mongoose";
import { TicketsModel } from "./TicketsSchema";
import { getParameterWorker } from "./../utils";

let database: mongoose.Connection;

export const getConnection = async (environment: string) => {
  if (!process.env[`MONGODB_${environment}_URI`]) {
    const mongodbURI: string = await getParameterWorker(
      `/mongodb/${environment}/uri`,
      true
    );
    process.env[`MONGODB_${environment}_URI`] = mongodbURI;
  }

  const db = await connect(
    process.env[`MONGODB_${environment}_URI`] as string,
    {
      maxPoolSize: Number(process.env.MAX_POOL_SIZE),
    }
  );

  if (!db) {
    throw new Error("Couldn't connect to DB");
  }

  return db;
};

const connect = async (mongodbURI: string, environmentOptions: any) => {
  await mongoose.connect(mongodbURI, {
    maxPoolSize: environmentOptions.maxPoolSize,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  database = mongoose.connection;

  return {
    TicketsModel,
  };
};

export const disconnect = async () => {
  if (!database) {
    return;
  }

  await mongoose.disconnect();
};
