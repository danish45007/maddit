import { Request, Response, Router } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import User from "../entities/User";
import user from "../middlewares/user";

const getUserSubmissions = async (req: Request, res: Response) => {
  const username = req.params.username;
  try {
    const user = await User.findOneOrFail({
      where: {
        username,
      },
      select: ["username", "createdAt"],
    });

    const posts = await Post.find({
      where: { user },
      relations: ["comments", "votes", "sub"],
    });
    const comments = await Comment.find({
      where: { user },
      relations: ["post"],
    });
    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
      comments.forEach((c) => c.setUserVote(res.locals.user));
    }

    // submission <array>
    let submissions: any[] = [];
    posts.forEach((p) => submissions.push({ type: "Posts", ...p.toJSON() }));
    comments.forEach((c) =>
      submissions.push({ type: "Comments", ...c.toJSON() })
    );
    return res.status(200).json({ user, submissions });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const router = Router();

router.get("/:username", user, getUserSubmissions);

export default router;
