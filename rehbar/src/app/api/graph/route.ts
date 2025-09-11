import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
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
    const skillsGraph = await prisma.skillsGraph.findMany();
    return NextResponse.json(skillsGraph);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}