import { Request, Response, Router } from "express";
import User from "../entities/User";
import { isEmpty, validate } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import auth from "../middlewares/auth";
import user from "../middlewares/user";
import { jwtToken, hashPassword } from "../util/authToken";
import sendMail from "../util/sendMail";
import validateEmail from "../util/emailValidation";
import { getConnection } from "typeorm";

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
    if (errors.length > 0) {
      // mapping errors
      let mapErrors: any = {};
      errors.forEach((e: any) => {
        const key = e.property;
        const value = Object.entries(e.constraints)[0][1];
        mapErrors[key] = value;
      });
      // console.log(mapErrors);
      return res.status(400).json(mapErrors);
    }
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
      return res.status(400).json(errors);
    }

    const user = await User.findOne({
      username,
    });
    if (!user) {
      return res.status(404).json({
        username: "No user found",
      });
    }
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.status(401).json({
        password: "Password is incorrect",
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
    return res.status(404).json({
      error: "Something went wrong",
    });
  }
};

// authenticator
const authMe = (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

// send password reset link
const sendResetLink = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!email) {
      return res.status(400).send({ email: "Email is required" });
    }
    if (!validateEmail(email)) {
      return res.status(400).send({ email: "Invalid email" });
    }
    if (!user) {
      return res.status(404).send({ email: "User not found" });
    }
    const token = jwtToken.createToken(user);
    // console.log(token);
    const link = `${req.protocol}://localhost:3000/reset-password/${token}`;
    await sendMail(
      "noreply@maddit.com",
      email,
      "Reset your password",
      `
       <h3>Click the link below to reset your password</h3><br/>
        <div>${link}</div>
      `
    );
    return res.status(200).send({
      message: "Password reset link has been successfully sent to your inbox",
    });
  } catch (err) {
    // console.log(err.response.data);/
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// reset password
const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, token } = req.body;
    // console.log(token);
    if (!password) {
      return res.status(400).send({ password: "Password is required" });
    }
    const decoded = jwtToken.verifyToken(token);
    const hash = hashPassword(password);
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ password: hash })
      .where("username = :username", { username: decoded.username })
      .execute();
    return res.status(200).json({
      message: "successfully updated your password",
    });
  } catch (e) {
    // console.log(e);
  }
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
router.get("/authMe", user, auth, authMe);
router.get("/logout", user, auth, logout);
router.post("/forgot-password", sendResetLink);
router.post("/reset-password", resetPassword);

export default router;
