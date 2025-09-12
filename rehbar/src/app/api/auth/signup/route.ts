import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { rateLimiter } from "@/lib/rate_limiter";
import { signupSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    try {
      await rateLimiter.consume(req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown');
    } catch {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = signupSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: parsed.email },
    });
    if (existing)
      return NextResponse.json({ message: "Invalid email or password" }, { status: 400 }); // generic error

    const hashed = await bcrypt.hash(parsed.password, 12);

    const user = await prisma.user.create({
      data: { name: parsed.name, email: parsed.email, password: hashed },
    });

    return NextResponse.json({ message: "Signup successful", user }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
}
