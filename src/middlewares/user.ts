import { NextFunction, Request, Response } from "express";
import User from "../entities/User";
import jwt from "jsonwebtoken";
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await req.cookies.token;
    if (!token) return next();

    const { username }: any = await jwt.verify(token, process.env.JWT_SECRECT!);
    const user = await User.findOne({ username });

    res.locals.user = user;
    return next();
  } catch (err) {
    // console.log(err);
    return res.status(401).json({
      error: "Unauthenticated",
    });
  }
};
