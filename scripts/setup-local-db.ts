import postgres from "postgres";

const DEFAULTS = {
  dbName: "reviewmax",
  dbUser: "reviewmax",
  dbPassword: "reviewmax",
};

function quoteIdent(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function quoteLiteral(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}

async function main() {
  const adminUrl =
    process.env.POSTGRES_ADMIN_URL ??
    process.env.DATABASE_URL?.replace(/\/[^/]+$/, "/postgres");

  if (!adminUrl || adminUrl.includes("YOUR_POSTGRES_PASSWORD")) {
    throw new Error(
      "Set POSTGRES_ADMIN_URL in .env.local, e.g. postgresql://postgres:YOUR_PASSWORD@localhost:5432/postgres",
    );
  }

  const sql = postgres(adminUrl, { max: 1 });

  try {
    const dbName = process.env.POSTGRES_DB ?? DEFAULTS.dbName;
    const dbUser = process.env.POSTGRES_USER ?? DEFAULTS.dbUser;
    const dbPassword = process.env.POSTGRES_PASSWORD ?? DEFAULTS.dbPassword;

    const [{ exists: userExists }] = await sql<{ exists: boolean }[]>`
      select exists(
        select 1 from pg_roles where rolname = ${dbUser}
      ) as exists
    `;

    if (!userExists) {
      await sql.unsafe(
        `create user ${quoteIdent(dbUser)} with password ${quoteLiteral(dbPassword)}`,
      );
      console.log(`Created user ${dbUser}`);
    } else {
      await sql.unsafe(
        `alter user ${quoteIdent(dbUser)} with password ${quoteLiteral(dbPassword)}`,
      );
      console.log(`Updated password for user ${dbUser}`);
    }

    const [{ exists: dbExists }] = await sql<{ exists: boolean }[]>`
      select exists(
        select 1 from pg_database where datname = ${dbName}
      ) as exists
    `;

    if (!dbExists) {
      await sql.unsafe(
        `create database ${quoteIdent(dbName)} owner ${quoteIdent(dbUser)}`,
      );
      console.log(`Created database ${dbName}`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }

    await sql.unsafe(
      `grant all privileges on database ${quoteIdent(dbName)} to ${quoteIdent(dbUser)}`,
    );
    console.log("Local database ready");
    console.log(
      `DATABASE_URL=postgresql://${dbUser}:${encodeURIComponent(dbPassword)}@localhost:5432/${dbName}`,
    );
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
