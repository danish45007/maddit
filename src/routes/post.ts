import { Request, Response, Router } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Subs";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

// create post for the present sub
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
    const subRecord = await Sub.findOneOrFail({ name: sub });
    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();
    return res.status(201).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// fetch all the posts with the associated subs

const getPosts = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 8) as number;
  try {
    const posts = await Post.find({
      order: {
        createdAt: "DESC",
      },
      relations: ["comments", "votes", "sub"],
      skip: currentPage * postsPerPage,
      take: postsPerPage,
    });

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// get single post
const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneOrFail(
      { identifier, slug },
      {
        relations: ["sub", "votes"],
      }
    );

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Post not found" });
  }
};

// comment on post
const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const { body } = req.body;
  const user = res.locals.user;

  try {
    const post = await Post.findOneOrFail({ identifier, slug });
    const comment = new Comment({
      body,
      user,
      post,
    });
    await comment.save();
    return res.status(201).json(comment);
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error: "Post not found",
    });
  }
};

const getPostComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneOrFail({ identifier, slug });
    const comments = await Comment.find({
      where: { post },
      order: { createdAt: "DESC" },
      relations: ["votes"],
    });
    if (res.locals.user) {
      comments.forEach((comment) => comment.setUserVote(res.locals.user));
    }
    return res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const router = Router();
router.post("/", user, auth, createPost);
router.get("/", user, getPosts);
router.get("/:identifier/:slug", user, getPost);
router.post("/:identifier/:slug/comment", user, auth, commentOnPost);
router.get("/:identifier/:slug/comment", user, getPostComments);

export default router;
