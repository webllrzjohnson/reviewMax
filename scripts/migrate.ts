import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }

  const migrationDir = path.join(process.cwd(), "drizzle");
  const migrationFiles = fs
    .readdirSync(migrationDir)
    .filter((name) => name.endsWith(".sql"))
    .sort();

  const sql = postgres(url, { max: 1 });

  try {
    for (const file of migrationFiles) {
      const content = fs.readFileSync(path.join(migrationDir, file), "utf8");
      const statements = content
        .split("--> statement-breakpoint")
        .map((statement) => statement.trim())
        .filter(Boolean);

      for (const statement of statements) {
        await sql.unsafe(statement);
      }
      console.log(`Applied ${file}`);
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
