module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: "reddit",
  synchronize: false,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
  seeds: ["src/seeds/**/*{.ts,.js}"],
  cli: {
    entitiesDir: "src/entities",
    migrationsDir: "src/migrations",
    subscribersDir: "src/subscriber",
  },
};
