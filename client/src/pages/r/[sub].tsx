import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Fragment } from "react";
import useSWR from "swr";
import LoadingPage from "../../components/LoadingPage";
import PostCard from "../../components/PostCard";

function Sub() {
  const router = useRouter();
  const subName = router.query.sub;
  const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null);

  if (error) {
    // console.log(error);
    router.push("/");
  }

  let postsMarkup;
  if (!sub) {
    postsMarkup = <LoadingPage />;
  } else if (sub.posts.length === 0) {
    postsMarkup = <LoadingPage />;
  } else {
    postsMarkup = sub?.posts.map((post) => (
      <PostCard post={post} key={post.identifier} />
    ));
  }
  return (
    <Fragment>
      <Head>
        <title>{`/r/${subName}`}</title>
      </Head>
      <div className="container flex pt-6">
        {/* Posts feed */}
        <div className="w-160">{postsMarkup}</div>
        {/* Sidebar */}
      </div>
    </Fragment>
  );
}

export default Sub;
