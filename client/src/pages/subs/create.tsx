import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import { useState } from "react";
import className from "classnames";
import { FormEvent } from "react";
import { useRouter } from "next/router";

export default function create() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Partial<any>>({});
  const router = useRouter();
  const submitForm = async (event: FormEvent) => {
    event.preventDefault;
    try {
      const res = await axios.post("/subs", { name, title, description });
      router.push(`/r/${res.data.name}`);
    } catch (err) {
      console.log(err);
      setErrors(err.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Create a community</title>
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-98">
          <h1 className="mb-2 text-lg font-medium">Create a community</h1>
          <hr />
          <form onSubmit={submitForm}>
            {/* name */}
            <div className="my-6">
              <p className="font-medium">Name*</p>
              <p className="text-xs text-gray-500">
                Community names including capitalization cannot be changed.
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
                className={className(
                  "w-full p-3 mt-2 border border-gray-200 rounded hover:border-gray-500",
                  { "border-red-600": errors.name }
                )}
              />
              <small className="font-medium text-red-600">{errors.name}</small>
            </div>
            {/* title */}
            <div className="my-6">
              <p className="font-medium">Title*</p>
              <p className="text-xs text-gray-500">
                Community title represent topic and can be changed any time.
              </p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder=""
                className={className(
                  "w-full p-3 mt-2 border border-gray-200 rounded hover:border-gray-500",
                  { "border-red-600": errors.title }
                )}
              />
              <small className="font-medium text-red-600">{errors.title}</small>
            </div>
            {/* description */}
            <div className="my-6">
              <p className="font-medium">Description*</p>
              <p className="text-xs text-gray-500">
                This how new members can understand your community.
              </p>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder=""
                className={className(
                  "w-full p-3 mt-2 border border-gray-200 rounded hover:border-gray-500",
                  { "border-red-600": errors.description }
                )}
              />
              <small className="font-medium text-red-600">
                {errors.description}
              </small>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-1 text-sm font-semibold capitalize button blue">
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   try {
//     const cookie = req.headers.cookie;

//     if (!cookie) throw new Error("Missing auth token cookie");

//     await axios.get("/auth/me", { headers: { cookie } });

//     return { props: {} };
//   } catch (err) {
//     // Handle error

//     return {
//       redirect: {
//         destination: "/login",
//         statusCode: 307,
//       },
//     };
//   }
// };
