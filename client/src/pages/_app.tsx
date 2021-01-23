import axios from "axios";
import type { AppProps } from "next/app";
import { Provider } from "next-auth/client";
import NavBar from "../components/NavBar";
import { useRouter } from "next/router";
import "../styles/tailwind.css";
import "../styles/icons.css";
import { AuthProvider } from "../context/auth";
import { SWRConfig } from "swr";

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
    <SWRConfig
      value={{
        fetcher: (url) => axios.get(url).then((res) => res.data),
      }}
    >
      <AuthProvider>
        <Provider session={pageProps.session}>
          {!authRoutes && <NavBar />}
          <Component {...pageProps} />
        </Provider>
      </AuthProvider>
    </SWRConfig>
  );
}

export default MyApp;
