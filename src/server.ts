import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgon from "morgan";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import subsRoutes from "./routes/subs";
import trim from "./middlewares/trim";
const app = express();

// middlewares
app.use(express.json());
app.use(morgon("dev"));
app.use(cookieParser());
app.use(trim);
// routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subs", subsRoutes);

// test route
app.get("/", (_, res) => {
  res.send("Welcone to maddit.com");
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}/`);

  try {
    await createConnection();
    console.log("Database connected!");
  } catch (err) {
    console.log(err);
  }
});
