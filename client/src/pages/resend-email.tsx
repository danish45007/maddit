import axios from "axios";
import Head from "next/head";
import Link from "next/Link";
import { FormEvent } from "react";
import { useState } from "react";

import InputGroup from "../components/InputGroup";
export default function Register() {
  const [response, setResponse] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<any>({});

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    // check if the agreement is checked

    try {
      const res = await axios.post("auth/forgot-password", {
        email,
      });
      await setResponse(res.data);
      alert(response);
      setEmail("");
    } catch (err) {
      //   console.log(err);
      setErrors(err.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Maddit:Forgot Password</title>
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
          <h1 className="mb-2 text-lg font-medium">Reset your password</h1>
          <p className="mb-10 text-base">
            Tell us the username and email address associated with your Maddit
            account, and we’ll send you an email with a link to reset your
            password.
          </p>
          <form onSubmit={submitForm}>
            {/* Email */}
            <InputGroup
              className="mb-2"
              type="text"
              placeholder="Email"
              value={email}
              error={errors.email}
              setValue={setEmail}
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded hover:bg-blue-400">
              Reset password
            </button>
          </form>
          <small>
            Don't have an email or need assistance logging in? Get Help.
            <Link href="https://reddithelp.com/hc/en-us/sections/360008917491-Account-Security">
              <a className="ml-1 text-blue-400">Get Help</a>
            </Link>
          </small>
          <br />
          <small className="mt-7">
            <Link href="/login">
              <a className="font-extrabold text-blue-600 uppercase">log in</a>
            </Link>
            <Link href="/register">
              <a className="ml-3 font-extrabold text-blue-600 uppercase">
                sign up
              </a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
