import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { rateLimiter } from "@/lib/rate_limiter";
import { signupSchema } from "@/lib/validations";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    try {
      await rateLimiter.consume(req.socket.remoteAddress!);
    } catch {
      return res.status(429).json({ message: "Too many requests" });
    }

    const parsed = signupSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: parsed.email },
    });
    if (existing)
      return res.status(400).json({ message: "Invalid email or password" }); // generic error

    const hashed = await bcrypt.hash(parsed.password, 12);

    const user = await prisma.user.create({
      data: { name: parsed.name, email: parsed.email, password: hashed },
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid input" });
  }
}
