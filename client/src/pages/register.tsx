import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Register() {
  return (
    <div className="flex">
      <Head>
        <title>Maddit: Register</title>
        <link rel="icon" href="/reddit.svg" />
      </Head>

      <div
        className="w-40 h-screen"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
    </div>
  );
}
