"use client";
import Button from "@/components/button"
import { useSkillsCollectionStore } from "@/store/skills_collection";
import { useTreeStore } from "@/store/tree_store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ROOT_NODE_ID } from "@/utils/constants";
import { v4 as uuidv4 } from "uuid";
import { useGraphs } from "@/providers/apis/graph";


const ListSkillsGraph = () => {
    const { t } = useTranslation("skills_graph");
    const router = useRouter();
    const { resetSkillsCollection } = useSkillsCollectionStore();
    const { setRootNodeData } = useSkillsCollectionStore();
    const { addChild, resetTree } = useTreeStore();
    const { data: skillsGraph, isLoading } = useGraphs();
    const createSkillsGraph = () => {
        resetSkillsCollection();
        resetTree();
        const newRootNodeId = uuidv4();
        setRootNodeData({
            parentId: ROOT_NODE_ID,
            id: newRootNodeId,
            title: "Skills Graph",
        });

        addChild(ROOT_NODE_ID, newRootNodeId, "Skills", "rootNode");
        router.push("/skills_graph/create");
    }

    const createSkill = () => {
        // router.push("/skills_graph/create");
    }
    return <div className="container-padding">
        <div className="grid md:grid-cols-2">
            <div>
                <h1>{t("your_skills_graphs")}</h1>
            </div>
            <div className="flex gap-2">
                <Button text={t("create_new")} variant={"primary"} onClick={createSkillsGraph} />
                <Button text={t("create_skill")} variant={"primary"} onClick={createSkill} />
            </div>
        </div>

        {isLoading && <div>Loading...</div>}
        {skillsGraph && skillsGraph.data?.map((skillGraph) => (
            <div key={skillGraph.id}>{skillGraph.title}</div>
        ))}

    </div>
}

export default ListSkillsGraph