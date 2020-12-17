import { isEmpty } from "class-validator";
import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import Sub from "../entities/Subs";
import User from "../entities/User";
import auth from "../middlewares/auth";

const createSubs = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;
  const user: User = res.locals.user;
  try {
    let errors: any = {};
    if (isEmpty(name)) {
      errors.name = "Names must not be empty";
    }
    if (isEmpty(title)) {
      errors.name = "Title must not be empty";
    }
    const sub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();
    if (sub) {
      errors.name = "Sub already exists";
    }

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    return res.status(400).json({ error });
  }

  //   creating the sub
  try {
    const sub = new Sub({ name, title, description, user });
    await sub.save();
    return res.status(201).json({ sub });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const router = Router();
router.post("/", auth, createSubs);

export default router;