import NextAuth, { NextAuthConfig } from "next-auth";

const config = {
  pages: {
    signIn: "/login",
  },
  // Determines how users log in
  providers: [],
  // This is run when the user attempts to log in
  callbacks: {
    authorized: ({ request }) => {
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

      if (isTryingToAccessApp) {
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const { auth } = NextAuth(config);
