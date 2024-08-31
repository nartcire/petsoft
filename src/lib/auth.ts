import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";

const config = {
  pages: {
    signIn: "/login",
  },
  // Determines how users log in
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on login
        const { email, password } = credentials;

        const user = await getUserByEmail(email);

        if (!user) {
          console.log("No user found");
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (!passwordMatch) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],
  // This is run when the user attempts to log in
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

      // User is logged in but we want to redirect them to the private portion of the app
      if (isLoggedIn && !isTryingToAccessApp) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }

      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }

      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }

      return false;
    },
    jwt: ({ token, user }) => {
      // on sign in --- Need to do this in order to store info on token
      // but cannot directly access this information
      if (user) {
        token.userId = user.id;
      }

      return token;
    },
    session: ({ session, token }) => {
      // This info is made availlable to the client
      if (session.user) {
        session.user.id = token.userId;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
