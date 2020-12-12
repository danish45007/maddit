import { Request, Response, Router } from "express";
import Post from "../entities/Post";
import auth from "../middlewares/auth";

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;
  const user = res.locals.user;
  if (title.trim() === "") {
    return res.status(400).json({
      title: "Title must not be empty",
    });
  }

  try {
    //   TODO: find sub
    const post = new Post({ title, body, user });
    await post.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const router = Router();
router.post("/", auth, createPost);

export default router;
