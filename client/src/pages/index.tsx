import Head from "next/head";
import PostCard from "../components/PostCard";
import useSWR from "swr";
import { Fragment } from "react";
import { Post, Sub } from "../types";
import Image from "next/image";
import Link from "next/Link";
import { useAuthState } from "../context/auth";

export default function Home() {
  // global state
  const { authenticated } = useAuthState();

  const { data: posts } = useSWR<Post[]>("/posts");
  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");

  return (
    <Fragment>
      <Head>
        <title>Maddit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-full px-4 md:w-160 md:p-0">
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* Sidebar */}
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Trending Communities
              </p>
            </div>
            <div>
              {topSubs &&
                topSubs?.map((sub) => (
                  <div
                    key={sub.name}
                    className="flex items-center px-4 py-2 text-xs border-b"
                  >
                    <Link href={`/r/${sub.name}`}>
                      <a>
                        <Image
                          src={sub.imageUrl}
                          className="rounded-full cursor-pointer"
                          alt="Sub"
                          width={(6 * 16) / 4}
                          height={(6 * 16) / 4}
                        />
                      </a>
                    </Link>

                    <Link href={`/r/${sub.name}`}>
                      <a className="ml-2 font-bold hover:curser-pointer">
                        {`r/${sub.name}`}
                      </a>
                    </Link>
                    <p className="ml-auto font-medium">{sub.postCount}</p>
                  </div>
                ))}
              {authenticated && (
                <div className="p-4 border-t-2">
                  <Link href="/subs/create">
                    <a className="w-full px-2 py-1 button blue">
                      Create Community
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
