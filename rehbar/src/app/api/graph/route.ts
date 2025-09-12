import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Check for authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { graph } = body;

    if (!graph) {
      return NextResponse.json({ error: "Graph is required" }, { status: 400 });
    }

    const skill = await prisma.skillsGraph.create({
      data: { graph },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check for authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const skillsGraph = await prisma.skillsGraph.findMany();
    return NextResponse.json(skillsGraph);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}