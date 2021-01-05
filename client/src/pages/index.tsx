import Axios from "axios";
import Head from "next/head";
import Link from "next/Link";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Post } from "../types";
dayjs.extend(relativeTime);

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    Axios.get("/posts")
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="pt-12">
      <Head>
        <title>Maddit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-160">
          {posts.map((post) => (
            <div key={post.identifier} className="flex mb-4 bg-white rounded">
              {/* Vote section */}
              <div className="w-10 text-center bg-gray-200 rounded-l">
                <p>V</p>
              </div>
              {/* Post data section */}
              <div className="w-full p-2">
                {/* top post meta data */}
                <div className="flex items-center">
                  <Link href={`/r/${post.subName}`}>
                    <img
                      src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=robohash&f=y"
                      className="w-6 h-6 mr-1 rounded-full"
                    />
                  </Link>
                  <Link href={`/r/${post.subName}`}>
                    <a className="text-xs font-bold cursor-pointer hover:underline">
                      r/{post.subName}
                    </a>
                  </Link>
                  <p className="ml-1 mr-1 text-xs text-gray-500">
                    • Posted by
                    <Link href={`/u/${post.username}`}>
                      <a className="ml-1 text-xs font-bold cursor-pointer hover:underline">
                        u/{post.username}
                      </a>
                    </Link>
                    <Link href={post.url}>
                      <a className="mx-1 text-xs cursor-pointer hover:underline">
                        {dayjs(post.createdAt).fromNow()}
                      </a>
                    </Link>
                  </p>
                </div>
                {/* post title */}
                <Link href={`${post.url}/${post.title}`}>
                  <a className="my-1 text-lg font-bold cursor-pointer">
                    {post.title}
                  </a>
                </Link>
                {post.body && <p className="my-1 text-sm">{post.body}</p>}

                {/* action button */}
                <div className="flex">
                  <Link href={post.url}>
                    <a>
                      <div className="px-1 py-1 mr-1 text-xs font-bold text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-comment-alt"></i>
                        <span>20 commnets</span>
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
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
}
