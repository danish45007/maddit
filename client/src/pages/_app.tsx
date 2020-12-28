import axios from "axios";
import type { AppProps } from "next/app";
import "../styles/globals.css";

axios.defaults.baseURL = "http://localhost:5000/api";
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
