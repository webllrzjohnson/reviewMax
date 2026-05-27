import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }

  const migrationPath = path.join(process.cwd(), "drizzle", "0000_initial.sql");
  const content = fs.readFileSync(migrationPath, "utf8");
  const statements = content
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean);

  const sql = postgres(url, { max: 1 });

  try {
    for (const statement of statements) {
      await sql.unsafe(statement);
    }
    console.log("Migration complete");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
