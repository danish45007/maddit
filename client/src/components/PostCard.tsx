import Link from "next/Link";
import React from "react";
import Axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Post } from "../types";
import classNames from "classnames";

import { useRouter } from "next/router";
dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({
  post: {
    identifier,
    title,
    body,
    slug,
    subName,
    username,
    createdAt,
    updatedAt,
    url,
    voteCount,
    commentCount,
    userVote,
  },
}) => {
  const router = useRouter();
  // get the votes
  const vote = async (value: number) => {
    try {
      await Axios.post("/misc/vote", {
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
    <div key={identifier} className="flex mb-4 bg-white rounded">
      {/* Vote section */}
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        {/* upvote */}
        <div
          onClick={() => vote(1)}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-600"
        >
          <i
            className={classNames("icon-arrow-up", {
              "text-red-600": userVote === 1,
            })}
          ></i>
        </div>
        {/* votes count */}
        <p className="font-bold">{voteCount}</p>
        {/* downvote */}
        <div
          onClick={() => vote(-1)}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
        >
          <i
            className={classNames("icon-arrow-down", {
              "text-blue-600": userVote === -1,
            })}
          ></i>
        </div>
      </div>
      {/* Post data section */}
      <div className="w-full p-2">
        {/* top post meta data */}
        <div className="flex items-center">
          <Link href={`/r/${subName}`}>
            <img
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=robohash&f=y"
              className="w-6 h-6 mr-1 rounded-full"
            />
          </Link>
          <Link href={`/r/${subName}`}>
            <a className="text-xs font-bold cursor-pointer hover:underline">
              r/{subName}
            </a>
          </Link>
          <p className="ml-1 mr-1 text-xs text-gray-500">
            • Posted by
            <Link href={`/u/${username}`}>
              <a className="ml-1 text-xs font-bold cursor-pointer hover:underline">
                u/{username}
              </a>
            </Link>
            <Link href={url}>
              <a className="mx-1 text-xs cursor-pointer hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        {/* post title */}
        <Link href={`${url}`}>
          <a className="my-1 text-lg font-bold cursor-pointer">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}

        {/* action button */}
        <div className="flex">
          <Link href={url}>
            <a>
              <div className="px-1 py-1 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                <i className="mr-1 fas fa-comment-alt"></i>
                <span>{commentCount}</span>
              </div>
            </a>
          </Link>
          <div className="px-1 py-1 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200">
            <i className="mr-1 fas fa-share"></i>
            <span>Share</span>
          </div>
          <div className="px-1 py-1 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200">
            <i className="mr-1 fas fa-bookmark" />
            <span>Save</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
