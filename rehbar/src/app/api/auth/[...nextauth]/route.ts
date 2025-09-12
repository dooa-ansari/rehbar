import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/validations";
import { rateLimiter } from "@/lib/rate_limiter";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        console.log("Authorize called with:", credentials);
        try {
          await rateLimiter.consume(credentials.email);
        } catch {
          return null;
        }
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          console.log("Validation failed:", parsed.error);
          return null;
        }
        console.log("Validation passed:", parsed.data);
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user || !user.password) {
          console.log("User not found or no password");
          return null;
        }
        console.log("User found:", user.email);
        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) {
          console.log("Password invalid");
          return null;
        }
        console.log("Authentication successful");
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT callback:", { token, user });
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback:", { session, token });
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 }, // 24 hours
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  pages: { signIn: "/signin", error: "/error" },
});

export { handler as GET, handler as POST };
