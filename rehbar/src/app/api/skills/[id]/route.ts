import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // notice Promise
) {
  try {
    const { id } = await params; // must await
    const skillId = id;

  
    const deleted = await prisma.skill.delete({
      where: { id: skillId },
    });

    return NextResponse.json(deleted, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
