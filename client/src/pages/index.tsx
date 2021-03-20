import Head from "next/head";
import PostCard from "../components/PostCard";
import useSWR, { useSWRInfinite } from "swr";
import { Fragment, useState } from "react";
import { Post, Sub } from "../types";
import Image from "next/image";
import Link from "next/Link";
import { useAuthState } from "../context/auth";
import { useEffect } from "react";
import LoadingPage from "../components/LoadingPage";

export default function Home() {
  // global state
  const { authenticated } = useAuthState();
  // local
  const title = "Maddit: the front page of the internet";
  const description =
    "Maddit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!";
  const [observedPost, setObservedPost] = useState("");

  // const { data: posts } = useSWR<Post[]>("/posts");
  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");
  const {
    data,
    size: page,
    setSize: setPage,
    error,
    revalidate,
  } = useSWRInfinite<Post[]>((index) => `/posts?page=${index}`);
  const posts: Post[] = data ? [].concat(...data) : [];

  const initalLoading = !data && !error;

  useEffect(() => {
    if (!posts || posts.length === 0) return;
    const id = posts[posts.length - 1].identifier;
    // incase when getting post[] from server
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log("Reached bottom of the post");
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
  };

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        {/* For Facebook SEO */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {/* For Twitter SEO */}
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-full px-4 md:w-160 md:p-0">
          {initalLoading && <LoadingPage />}
          {posts?.map((post) => (
            <PostCard
              post={post}
              key={post.identifier}
              revalidate={revalidate}
            />
          ))}
          {initalLoading && posts.length > 0 && <LoadingPage />}
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
