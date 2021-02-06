import "reflect-metadata";
import cors from "cors";
import { createConnection } from "typeorm";
import express from "express";
import morgon from "morgan";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import subsRoutes from "./routes/subs";
import miscRoutes from "./routes/misc";
import trim from "./middlewares/trim";
// const io = require("socket.io")(process.env.SOCKET_PORT);
const app = express();

// middlewares
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
// access the static folder(public)
app.use(express.static("public"));
app.use(express.json());
app.use(morgon("dev"));
app.use(cookieParser());
app.use(trim);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subs", subsRoutes);
app.use("/api/misc", miscRoutes);

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

    // TODO: Setup real time online user count
    // var userCount = 0;

    // io.sockets.on("connection", function (socket: any) {
    //   userCount++;
    //   io.sockets.emit("userCount", { userCount: userCount });
    //   socket.on("disconnect", function () {
    //     userCount--;
    //     io.sockets.emit("userCount", { userCount: userCount });
    //   });
    // });
    // console.log(`Socket Connection Setup on PORT:${process.env.SOCKET_PORT}`);
  } catch (err) {
    console.log(err);
  }
});
