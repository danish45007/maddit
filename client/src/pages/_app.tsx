import axios from "axios";
import type { AppProps } from "next/app";
import "../styles/tailwind.css";
import { Provider } from "next-auth/client";
import NavBar from "../components/NavBar";
import { Fragment } from "react";
import { useRouter } from "next/router";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;
function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoute = [
    "/login",
    "/register",
    "/reset-password/:token",
    "/resend-email",
  ];
  const authRoutes = authRoute.includes(pathname);
  return (
    <Fragment>
      <Provider session={pageProps.session}>
        {!authRoute && <NavBar />}
        <Component {...pageProps} />
      </Provider>
    </Fragment>
  );
}

export default MyApp;
