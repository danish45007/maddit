import axios from "axios";
import Head from "next/head";
import Link from "next/Link";
import { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/router";

import InputGroup from "../components/InputGroup";
export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    // check if the agreement is checked
    if (!agreement) {
      setErrors({ ...errors, agreement: "You must agree to T&Cs" });
      return;
    }

    try {
      await axios.post("/auth/register", {
        email,
        password,
        username,
      });
      router.push("/login");
      //console.log(res.data);
    } catch (err) {
      console.log(err);
      setErrors(err.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Maddit:Register</title>
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
          <h1 className="mb-2 text-lg font-medium">Sign up</h1>
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
          <form onSubmit={submitForm}>
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails about cool stuff on Maddit
              </label>
              <small className="block font-medium text-red-600">
                {errors.agreement}
              </small>
            </div>

            {/* Email */}
            <InputGroup
              className="mb-2"
              type="email"
              placeholder="Email"
              value={email}
              error={errors.email}
              setValue={setEmail}
            />
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
              Sign Up
            </button>
          </form>
          <small>
            Already a madditor?
            <Link href="/login">
              <a className="ml-1 font-extrabold text-blue-600 uppercase ">
                Log in
              </a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
