import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { Post } from "../../../../types";

function PostPage() {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );
  if (error) {
    router.push("/");
  }
  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
    </>
  );
}

export default PostPage;
