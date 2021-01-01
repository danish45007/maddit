import axios from "axios";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Provider } from "next-auth/client";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
