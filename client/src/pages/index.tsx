import Axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { Post } from "../types";
import useSWR from "swr";
import { Fragment } from "react";

export default function Home() {
  const { data: posts } = useSWR("/posts");

  return (
    <Fragment>
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
    </Fragment>
  );
}
