import Axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { Post } from "../types";
import useSWR from "swr";

export default function Home() {
  const { data: posts } = useSWR("/posts");
  // const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {
  //   Axios.get("/posts")
  //     .then((res) => setPosts(res.data.posts))
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <div className="pt-12">
      <Head>
        <title>Maddit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-160">
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
}
