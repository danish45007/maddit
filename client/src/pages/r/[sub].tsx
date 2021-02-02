import Head from "next/head";
import { useRouter } from "next/router";
import React, { createRef, useState } from "react";
import { Fragment } from "react";
import useSWR from "swr";
import LoadingPage from "../../components/LoadingPage";
import PostCard from "../../components/PostCard";
import { Sub } from "../../types";
import Image from "next/image";
import { useAuthState } from "../../context/auth";
import classNames from "classnames";
import { useEffect } from "react";
import axios from "axios";
import { ChangeEvent } from "react";

function SubPage() {
  // Local State
  const [ownSub, setOwnSub] = useState(false);
  // Global State
  const { authenticated, user } = useAuthState();
  // Utils
  const router = useRouter();
  const fileInputRef = createRef<HTMLInputElement>();
  const subName = router.query.sub;
  const { data: sub, error, revalidate } = useSWR<Sub>(
    subName ? `/subs/${subName}` : null
  );
  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  // select image from the folder
  const openFileInput = (type: string) => {
    if (!ownSub) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  // uplad image to server
  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    // grabbing the single image
    const file = event.target.files[0];
    const type = event.target.name;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        // header
        headers: { "Content-Type": "multipart/form-data" },
      });
      // refetch the subs after the upload
      revalidate();
    } catch (err) {
      console.log(err);
    }
  };

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
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <Fragment>
          <input
            type="file"
            hidden={true}
            ref={fileInputRef}
            onChange={uploadImage}
          ></input>
          {/* Sub info and banner image */}
          <div>
            {/* Banner image */}
            <div
              className={classNames("bg-blue-500", {
                "cursor-pointer": ownSub,
              })}
              onClick={() => openFileInput("banner")}
            >
              {sub.bannerUrl ? (
                <div
                  className="h-56 bg-blue-500"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-blue-500"></div>
              )}
            </div>
            {/* Sub info && sub-image*/}
            <div className="h-20 bg-white ">
              <div className="container relative flex">
                <div className="absolute" style={{ top: -15 }}>
                  <Image
                    src={sub.imageUrl}
                    alt="Sub"
                    className={classNames("rounded-full", {
                      "cursor-pointer": ownSub,
                    })}
                    width={60}
                    height={60}
                    onClick={() => openFileInput("image")}
                  />
                </div>
                <div className="pt-1 pl-20">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">{sub.name}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-500">
                    r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Posts and sidebar */}
          <div className="container flex pt-6">
            {/* Posts feed */}
            <div className="w-160">{postsMarkup}</div>
            {/* Sidebar */}
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default SubPage;
