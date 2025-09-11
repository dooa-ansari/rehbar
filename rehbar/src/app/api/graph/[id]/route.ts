import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const skillsGraph = await prisma.skillsGraph.findUnique({
            where: {
                id,
            },
        });

        return NextResponse.json(skillsGraph);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
