import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import { validate } from "class-validator";

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

const router = Router();
router.post("/register", register);

export default router;
