import axios from "axios";
import Head from "next/head";
import Link from "next/Link";
import { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import InputGroup from "../components/InputGroup";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [session, loading] = useSession();

  const router = useRouter();

  const handleSignin = (event: FormEvent) => {
    event.preventDefault();
    signIn();
  };

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await axios.post("/auth/login", {
        password,
        username,
      });
      router.push("/");
      //console.log(res.data);
    } catch (err) {
      console.log(err);
      setErrors(err.response.data);
    }
  };

  return (
    <>
      <div className="flex">
        <Head>
          <title>Maddit:Login</title>
        </Head>

        <div
          className="h-screen bg-center bg-cover w-36"
          style={{ backgroundImage: "url('/images/bricks.jpg')" }}
        ></div>
        <div className="flex flex-col justify-center pl-6">
          <div className="w-72">
            <div
              className="mb-4 bg-center bg-cover w-14 h-14"
              style={{ backgroundImage: "url('/images/maddit.png')" }}
            ></div>
            <h1 className="mb-2 text-lg font-medium">Login</h1>
            <p className="mb-10 text-xs">
              By continuing, you agree to our{" "}
              <a
                className="no-underline hover:underline ... text-blue-600"
                href="https://www.redditinc.com/policies/user-agreement"
              >
                User Agreement
              </a>{" "}
              and{" "}
              <a
                className="no-underline hover:underline ... text-blue-600"
                href="https://www.redditinc.com/policies/privacy-policy"
              >
                Privacy Policy.
              </a>
            </p>
            {!session && (
              <>
                <button
                  className="w-full py-2 mb-4 text-base font-bold text-blue-500 uppercase border border-blue-500 rounded hover:bg-blue-400 hover:text-white"
                  onClick={handleSignin}
                >
                  CONTINUE WITH GITHUB
                </button>
              </>
            )}
            {session && window.location.replace("http://localhost:3000")}
            <span className="flex flex-col justify-center w-full mb-6 border-t-2"></span>
            <form onSubmit={submitForm}>
              {/* Username */}
              <InputGroup
                className="mb-2"
                type="text"
                placeholder="Username"
                value={username}
                error={errors.username}
                setValue={setUsername}
              />
              {/* password */}
              <InputGroup
                className="mb-2"
                type="password"
                placeholder="Password"
                value={password}
                error={errors.password}
                setValue={setPassword}
              />

              <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded hover:bg-blue-400">
                Log in
              </button>
            </form>
            <small>
              Forgot your
              <Link href="/resend-email">
                <a className="ml-1 text-blue-600 uppercase ">Password</a>
              </Link>
            </small>
            <br />
            <small>
              New to madditor?
              <Link href="/register">
                <a className="mt-4 ml-1 font-extrabold text-blue-600 uppercase ">
                  SIGN UP
                </a>
              </Link>
            </small>
          </div>
        </div>
      </div>
    </>
  );
}
