import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgon from "morgan";

const app = express();

// middlewares
app.use(express.json());
app.use(morgon("dev"));

// test route
app.get("/", (req, res) => {
  res.json("Hello");
});

app.listen(5000, async () => {
  console.log("Server running at http://localhost:5000/");

  try {
    await createConnection();
    console.log("Database connected!");
  } catch (err) {
    console.log(err);
  }
});
