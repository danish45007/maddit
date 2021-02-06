import { Request, Response, Router } from "express";
import { getConnection } from "typeorm";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Subs";
import User from "../entities/User";
import Vote from "../entities/Vote";
import auth from "../middlewares/auth";
import user from "../middlewares/user";

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;

  //   validate the vote values
  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({
      value: "Value must be -1, 0 or 1",
    });
  }

  try {
    const user: User = res.locals.user;
    let post = await Post.findOneOrFail({
      identifier,
      slug,
    });
    // console.log("Post-------------------", post);
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      //   if there is commentIdentifier find vote by comment
      comment = await Comment.findOneOrFail({
        identifier: commentIdentifier,
      });
      vote = await Vote.findOne({
        user,
        comment,
      });
    } else {
      // Else find vote by post
      vote = await Vote.findOne({
        user,
        post,
      });
    }
    if (!vote && value === 0) {
      // if no vote and value === 0 return error
      return res.status(404).json({
        error: "vote not found",
      });
    } else if (!vote) {
      // if no vote created
      vote = new Vote({ user, value });
      if (comment) {
        vote.comment = comment;
      } else {
        vote.post = post;
      }

      await vote.save();
    } else if (value == 0) {
      // if vote exists and value === 0 then remove vote from db
      await vote.remove();
    } else if (vote.value !== value) {
      // if vote and value has changed then update the value with the new value
      vote.value = value;
      await vote.save();
    }

    // refetch post or comment with the updated vote value and send back to user

    post = await Post.findOneOrFail(
      {
        identifier,
        slug,
      },
      {
        relations: ["comments", "comments.votes", "votes", "sub"],
      }
    );

    post.setUserVote(user);
    post.comments.forEach((c) => c.setUserVote(user));

    return res.status(200).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// get the top-5 subs based on no.of posts
const topSubs = async (_: Request, res: Response) => {
  try {
    // Raw SQL Query
    /**
     * SELECT s.title, s.name,
     * COALESCE('http://localhost:5000/image-url' || s.'imageUrn', 'gravtor-image-url) as imageUrl,
     * count(p.id) as "postCount"
     * FROM subs s
     * LEFT JOIN posts p ON s.name = p."subName"
     * GROUP BY s.title, s.name, imageUrl
     * ORDER BY "postcount" DESC
     * LIMIT 5;
     */
    const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn", 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;
    const subs = await getConnection()
      .createQueryBuilder()
      .select(
        `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, "s")
      .leftJoin(Post, "p", `s.name = p."subName"`)
      .groupBy(`s.title, s.name,"imageUrl"`)
      .orderBy(`"postCount"`, "DESC")
      .limit(5)
      .execute();

    return res.status(200).json(subs);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const router = Router();
router.post("/vote", user, auth, vote);
router.get("/top-subs", topSubs);

export default router;
