import { Request, Response, Router } from "express";
import User from "../entities/User";
import { isEmpty, validate } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import auth from "../middlewares/auth";

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    // check if the user already exist's
    let errors: any = {};
    const userEmail = await User.findOne({ email });
    const userUsername = await User.findOne({ username });
    if (userEmail) {
      errors.email = "Email already taken";
    }
    if (userUsername) {
      errors.username = "Username already taken";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    const user = new User({ username, email, password });
    errors = await validate(user);
    if (errors.length > 0) return res.status(400).json({ errors });
    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

// login
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    let errors: any = {};
    if (isEmpty(username)) {
      errors.username = "Username must not be empty";
    }
    if (isEmpty(password)) {
      errors.password = "Password must not be empty";
    }

    // send errors res
    if (Object.keys(errors).length > 0) {
      return res.status(400).send({
        error: errors,
      });
    }

    const user = await User.findOne({
      username,
    });
    if (!user) {
      return res.status(404).send({
        error: "No user found",
      });
    }
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.status(401).send({
        password: "Password didn't match",
      });
    }
    // if pass correct create jsonToken and store inside cookie and send to user
    const token = jwt.sign(
      {
        username,
      },
      process.env.JWT_SECRECT!
    );
    // setting token inside a cookie
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );
    return res.json({
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send({
      error: err,
    });
  }
};

// authenticator
const authMe = (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

// logout
const logout = async (_: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );
  return res.status(200).json({
    success: true,
  });
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/authMe", auth, authMe);
router.get("/logout", auth, logout);

export default router;
