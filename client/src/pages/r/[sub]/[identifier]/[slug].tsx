import Head from "next/head";
import Link from "next/Link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { Post } from "../../../../types";
import Image from "next/image";
import Sidebar from "../../../../components/Sidebar";
import axios from "axios";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuthState } from "../../../../context/auth";

function PostPage() {
  // Global state
  const { authenticated } = useAuthState();
  //   Utils
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );
  if (error) {
    router.push("/");
  }
  // get the votes
  const vote = async (value: number) => {
    //   if not logged in go to login
    if (!authenticated) router.push("/login");
    // if vote is the same reset the vote
    if (value === post.userVote) value = 0;
    try {
      await axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      });
    } catch (err) {
      console.log(err);
      router.push("/");
    }
  };
  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>

      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex w-full h-20 p-8 bg-blue-500 item-center">
            <div className="container flex">
              {post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Image
                    src={post.sub.imageUrl}
                    alt="Post"
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">{`r/${sub}`}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-6">
        {/* Post */}
        {post && (
          <div className="w-160">
            <div className="bg-white rounded">
              {/* Vote section */}
              <div className="w-10 py-3 text-center rounded-l">
                {/* upvote */}
                <div
                  onClick={() => vote(1)}
                  className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-600"
                >
                  <i
                    className={classNames("icon-arrow-up", {
                      "text-red-600": post.userVote === 1,
                    })}
                  ></i>
                </div>
                {/* votes count */}
                <p className="font-bold">{post.voteCount}</p>
                {/* downvote */}
                <div
                  onClick={() => vote(-1)}
                  className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                >
                  <i
                    className={classNames("icon-arrow-down", {
                      "text-blue-600": post.userVote === -1,
                    })}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
}

export default PostPage;
