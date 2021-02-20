import Head from "next/head";
import Link from "next/Link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";
import { Post, Comment } from "../../../../types";
import Image from "next/image";
import Sidebar from "../../../../components/Sidebar";
import axios from "axios";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuthState } from "../../../../context/auth";
import ActionButton from "../../../../components/ActionButton";
import { FormEvent } from "react";
dayjs.extend(relativeTime);

function PostPage() {
  // Local state
  const [newComment, setNewComment] = useState("");
  // Global state
  const { authenticated, user } = useAuthState();
  //   Utils
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  // fetching single post
  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );
  // fetching comments on that post
  const { data: comments, revalidate } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comment` : null
  );

  if (error) {
    router.push("/");
  }
  // get the votes
  const vote = async (value: number, comment?: Comment) => {
    //   if not logged in go to login
    if (!authenticated) router.push("/login");
    // if vote is the same reset the vote
    if (
      (!comment && value === post.userVote) ||
      (comment && value === comment.userVote)
    )
      value = 0;
    try {
      await axios.post("/misc/vote", {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });
      revalidate();
    } catch (err) {
      console.log(err);
      // router.push("/");
    }
  };

  // send comment
  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === "") return;
    try {
      await axios.post(`/posts/${identifier}/${slug}/comment`, {
        body: newComment,
      });
      setNewComment("");
      revalidate();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Image
                    src={post.sub.imageUrl}
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        {/* Post */}
        <div className="w-160">
          <div className="bg-white rounded">
            {post && (
              <>
                <div className="flex">
                  {/* Vote section */}
                  <div className="flex-shrink-0 w-10 py-3 text-center rounded-l">
                    {/* Upvote */}
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      onClick={() => vote(1)}
                    >
                      <i
                        className={classNames("icon-arrow-up", {
                          "text-red-500": post.userVote === 1,
                        })}
                      ></i>
                    </div>
                    <p className="text-xs font-bold">{post.voteCount}</p>
                    {/* Downvote */}
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                      onClick={() => vote(-1)}
                    >
                      <i
                        className={classNames("icon-arrow-down", {
                          "text-blue-600": post.userVote === -1,
                        })}
                      ></i>
                    </div>
                  </div>
                  <div className="py-2 pr-2">
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500">
                        Posted by
                        <Link href={`/u/${post.username}`}>
                          <a className="mx-1 hover:underline">
                            /u/{post.username}
                          </a>
                        </Link>
                        <Link href={post.url}>
                          <a className="mx-1 hover:underline">
                            {dayjs(post.createdAt).fromNow()}
                          </a>
                        </Link>
                      </p>
                    </div>
                    {/* Post title */}
                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                    {/* Post body */}
                    <p className="my-3 text-sm">{post.body}</p>
                    {/* Actions */}
                    <div className="flex">
                      <Link href={post.url}>
                        <a>
                          <ActionButton>
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span className="font-bold">
                              {post.commentCount} Comments
                            </span>
                          </ActionButton>
                        </a>
                      </Link>
                      <ActionButton>
                        <i className="mr-1 fas fa-share fa-xs"></i>
                        <span className="font-bold">Share</span>
                      </ActionButton>
                      <ActionButton>
                        <i className="mr-1 fas fa-bookmark fa-xs"></i>
                        <span className="font-bold">Save</span>
                      </ActionButton>
                    </div>
                  </div>
                </div>
                {/* Comment input */}
                <div className="pl-10 pr-6 mb-4">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        Comment as{" "}
                        <Link href={`/u/${user.username}`}>
                          <a className="font-semibold text-blue-500 underline">
                            {user.username}
                          </a>
                        </Link>
                      </p>
                      <form onSubmit={submitComment}>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                          onChange={(e) => setNewComment(e.target.value)}
                          value={newComment}
                        ></textarea>
                        <div className="flex justify-end">
                          <button
                            className="px-3 py-1 blue button"
                            disabled={newComment.trim() === ""}
                          >
                            Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded ">
                      <p className="font-semibold text-gray-400">
                        Login or sign up to leave a comment
                      </p>
                      <div>
                        <Link href="/login">
                          <a className="px-4 py-1 mr-5 hollow blue button">
                            Log in
                          </a>
                        </Link>
                        <Link href="/register">
                          <a className="px-4 py-1 blue button">Sign up</a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <hr />
                {/* Comments feed*/}
                {comments?.map((comment) => (
                  <div className="flex" key={comment.identifier}>
                    <div className="flex-shrink-0 w-10 py-3 text-center rounded-l">
                      {/* upvote */}
                      <div
                        onClick={() => vote(1, comment)}
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-600"
                      >
                        <i
                          className={classNames("icon-arrow-up", {
                            "text-red-600": comment.userVote === 1,
                          })}
                        ></i>
                      </div>
                      {/* votes count */}
                      <p className="text-xs font-bold">{comment.voteCount}</p>
                      {/* downvote */}
                      <div
                        onClick={() => vote(-1, comment)}
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                      >
                        <i
                          className={classNames("icon-arrow-down", {
                            "text-blue-600": comment.userVote === -1,
                          })}
                        ></i>
                      </div>
                    </div>
                    <div className="py-2 pr-2">
                      <p className="mb-1 text-xs leading-none">
                        <Link href={`/u/${comment.username}`}>
                          <a className="mr-1 font-bold hover:underline">
                            {comment.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`${comment.voteCount} point • ${dayjs(
                            comment.createdAt
                          ).fromNow()}`}
                        </span>
                      </p>
                      <p className="pt-1">{comment.body}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
}

export default PostPage;
