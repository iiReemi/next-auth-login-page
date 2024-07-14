import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const user = await response.json();

        if (response.ok && user) {
          return user;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.user = user;
      }

      return token;
    },

    async session({ session, token }: any) {
      session = token.user;
      return session;
    },
  },
};

const handler = async (req: NextRequest, res: NextResponse) => {
  const cookieStore = cookies();
  const rememberMe = cookieStore.get("rememberMe");

  let maxAge = 24 * 60 * 60;
  if (rememberMe) {
    maxAge = rememberMe.value == "true" ? 24 * 60 * 60 * 90 : 24 * 60 * 60;
  }

  return NextAuth(
    req as unknown as NextApiRequest,
    res as unknown as NextApiResponse,
    {
      ...authOptions,

      session: { maxAge: maxAge },
    }
  );
};

export { handler as GET, handler as POST };
