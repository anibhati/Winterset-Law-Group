import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { checkRateLimit } from "./rate-limit";

// Two layers, catching two different attack patterns:
//  - per-email: stops repeated brute-force against one known account
//  - per-IP: stops credential stuffing (spraying many different
//    email/password pairs from one source) which wouldn't trip the
//    per-email limit since each email is only tried a couple times
const LOGIN_LIMIT_PER_EMAIL = 8;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_LIMIT_PER_IP = 20;

declare module "next-auth" {
  interface Session {
    user: { id: string; email: string; name?: string | null; role: string };
  }
  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/login", error: "/login" },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase();

        // next-auth's `req` here is a plain headers object, not a Fetch
        // Request, so we read x-forwarded-for directly rather than reusing
        // getClientIp (which expects a real Request instance).
        const forwardedFor = req?.headers?.["x-forwarded-for"];
        const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

        const [emailLimit, ipLimit] = await Promise.all([
          checkRateLimit(`login:email:${email}`, LOGIN_LIMIT_PER_EMAIL, LOGIN_WINDOW_MS),
          checkRateLimit(`login:ip:${ip}`, LOGIN_LIMIT_PER_IP, LOGIN_WINDOW_MS),
        ]);

        if (!emailLimit.success || !ipLimit.success) {
          // NextAuth's credentials flow only surfaces a generic error to
          // the client either way (it never reveals *why* auth failed),
          // so returning null here just looks like "invalid credentials"
          // to an attacker — which is what we want.
          return null;
        }

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { ...session.user, id: token.id, role: token.role };
      return session;
    },
  },
};