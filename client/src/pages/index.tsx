import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Post } from "../types";
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios
      .get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="pt-12">
      <Head>
        <title>Maddit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts */}
        <div className="w-160">
          {posts.map((post) => (
            <div key={post.identifier} className="flex mb-4 bg-white rounded">
              {/* Vote section */}
              <div className="w-10 text-center bg-gray-200 rounded-l">
                <p>V</p>
              </div>
              {/* Post data section */}
              <div className="w-full p2">
                <p>{post.body}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
}
