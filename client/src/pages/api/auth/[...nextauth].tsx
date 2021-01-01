import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  providers: [
    Providers.GitHub({
      clientId: "a56dde85493253f2acde",
      clientSecret: "b5270728f40f6706e94349bf18fc4ce2fc406d86",
    }),
  ],
};

export default (req, res) => NextAuth(req, res, options);
