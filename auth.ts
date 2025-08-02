import NextAuth from "next-auth"
import { createUserDoc } from "./utils/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    logo: "",
  },
  providers: [],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    }
  },
});
