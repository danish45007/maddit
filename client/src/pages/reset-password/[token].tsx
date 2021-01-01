import axios from "axios";
import Head from "next/head";
import Link from "next/Link";
import { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/router";

import InputGroup from "../../components/InputGroup";
export default function Register() {
  const [response, setResponse] = useState("");
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
      const { token } = router.query;
      const res = await axios.post("auth/reset-password", {
        password,
        token,
      });
      //   console.log(res.data.message);
      await setResponse(res.data.message);
      alert(response);
      setPassword("");
      router.push("/login");
    } catch (err) {
      //   console.log(err);
      setErrors(err.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Maddit:Reset Password</title>
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
            Choose a new password here, then log in to your account.
          </p>
          <form onSubmit={submitForm}>
            {/* Password */}
            <InputGroup
              className="mb-2"
              type="password"
              placeholder="Password"
              value={password}
              error={errors.password}
              setValue={setPassword}
            />
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                Changing your password logs you out of all browsers on your
                device(s). Checking this box also logs you out of all apps you
                have authorized.
              </label>
              <small className="block font-medium text-red-600">
                {errors.agreement}
              </small>
            </div>
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded hover:bg-blue-400">
              Set password
            </button>
          </form>
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
