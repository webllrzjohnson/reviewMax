import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __reviewmaxDbClient: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Missing DATABASE_URL");
  }

  return postgres(url, {
    max: 10,
    prepare: false,
  });
}

const client = globalThis.__reviewmaxDbClient ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__reviewmaxDbClient = client;
}

export const db = drizzle(client, { schema });

export type Db = typeof db;
