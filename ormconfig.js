module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: "reddit",
  synchronize: true,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
  cli: {
    entitiesDir: "src/entities",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
