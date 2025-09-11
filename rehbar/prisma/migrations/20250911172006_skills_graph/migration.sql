-- CreateTable
CREATE TABLE "public"."SkillsGraph" (
    "id" TEXT NOT NULL,
    "graph" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillsGraph_pkey" PRIMARY KEY ("id")
);
