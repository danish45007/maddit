import { isEmpty } from "class-validator";
import { NextFunction, Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import Post from "../entities/Post";
import Sub from "../entities/Subs";
import User from "../entities/User";
import auth from "../middlewares/auth";
import upload from "../middlewares/upload";
import user from "../middlewares/user";
import fs from "fs";

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

// get the single sub using sub-name param
const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;
  try {
    const sub = await Sub.findOneOrFail({
      name,
    });
    const posts = await Post.find({
      where: { subName: sub },
      order: { createdAt: "DESC" },
      relations: ["comments", "votes"],
    });
    sub.posts = posts;
    if (res.locals.user) {
      sub.posts.forEach((post) => post.setUserVote(res.locals.user));
    }
    return res.status(200).json(sub);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ sub: "Sub not found" });
  }
};

// middleware to check sub-owner
const subOwner = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;
  try {
    const sub = await Sub.findOneOrFail({
      where: {
        name: req.params.name,
      },
    });

    if (sub.username !== user.username) {
      return res.status(401).json({ error: "Unauthorized Action Type" });
    }
    res.locals.sub = sub;
    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// upload subs image handler
const uploadSubsImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;
  try {
    const type = req.body.type;
    console.log("Type----------------", type);
    if (type !== "image" && type !== "banner") {
      // delete the file using the path as the type is invaild
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Invaild Type",
      });
    }

    let oldImageUrn: string = "";
    if (type === "image") {
      oldImageUrn = sub.imageUrn ?? "";
      sub.imageUrn = req.file.filename;
    } else if (type === "banner") {
      oldImageUrn = sub.bannerUrn ?? "";
      sub.bannerUrn = req.file.filename;
    }
    await sub.save();
    // check if the old-link is not empty then delete the old image from the dir
    if (oldImageUrn !== "") {
      fs.unlinkSync(`public\\images\\${oldImageUrn}`);
    }
    return res.status(200).json(sub);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const router = Router();
router.post("/", user, auth, createSubs);
router.get("/:name", user, getSub);
router.post(
  "/:name/image",
  user,
  auth,
  subOwner,
  upload.single("file"),
  uploadSubsImage
);

export default router;
