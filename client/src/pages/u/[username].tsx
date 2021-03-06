import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import PostCard from "../../components/PostCard";

function user() {
  const router = useRouter();
  const username = router.query.username;
  const { data, error } = useSWR<any>(username ? `/users/${username}` : null);
  if (error) router.push("/");
  if (data) console.log(data);
  return (
    <>
      <Head>
        <title>{`u/${data?.user.username}`}</title>
      </Head>
      {data && (
        <div className="container flex pt-5">
          <div className="w-160">
            {data.submissions.map((submission: any) => {
              if (submission.type === "Posts") {
                const post = submission;
                return <PostCard key={post.identifier} post={post} />;
              }
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default user;
