import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
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
