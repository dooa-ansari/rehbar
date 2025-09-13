"use client";
import Button from "@/components/button"
import { useSkillsCollectionStore } from "@/store/skills_collection";
import { useTreeStore } from "@/store/tree_store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ROOT_NODE_ID } from "@/utils/constants";
import { v4 as uuidv4 } from "uuid";
import { useGraph, useGraphs } from "@/providers/apis/graph";
import Status from "@/components/status";
import { StatusType } from "@/components/status";
import Loading from "@/components/loading";
import Link from "next/link";
import { NodeData, SkillsGraph } from "@/types/skills_graph";
import { useEffect, useState } from "react";


const ListSkillsGraph = () => {
    const { t } = useTranslation("skills_graph");
    const router = useRouter();
    const { resetSkillsCollection } = useSkillsCollectionStore();
    const { setRootNodeData, setSkillsGraph, setNodeMap, setIsEditing } = useSkillsCollectionStore();
    const { addChild, resetTree, setTreeData } = useTreeStore();
    const { data: skillsGraph, isLoading } = useGraphs();
    const [selectedSkillsGraphId, setSelectedSkillsGraphId] = useState<string | null>(null);
    const { data: skillsGraphData, isLoading: isLoadingSkillsGraph } = useGraph(selectedSkillsGraphId);

    console.log(selectedSkillsGraphId)

    useEffect(() => {
        if (skillsGraphData) {
            console.log(skillsGraphData);
            const data = skillsGraphData.data;
            setSkillsGraph(data);
            setTreeData(data.graph.tree_data);
            const nodeMap: Map<string, NodeData> = new Map(data.graph.node_map_data);
            setNodeMap(nodeMap);
            setRootNodeData(data.graph.root_node_id);
            setIsEditing(true);
            router.push("/skills_graph/create");
            //router.push("/skills_graph/create")
        }
    }, [skillsGraphData]);

    const createSkillsGraph = () => {
        resetSkillsCollection();
        resetTree();
        const newRootNodeId = uuidv4();
        setRootNodeData({
            parentId: ROOT_NODE_ID,
            id: newRootNodeId,
            title: "",
        });

        addChild(ROOT_NODE_ID, newRootNodeId, "", "rootNode");
        router.push("/skills_graph/create");
    }

    const createSkill = () => {

    }

    const onEditSkillsGraph = (id: string) => {
        console.log(id);
        setSelectedSkillsGraphId(id);
    }

    const onViewSkillsGraph = (id: string) => {
        router.push(`/skills_graph/view/${id}`);
    }
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return <div className="container-padding relative">
        <div className="grid md:grid-cols-2 mb-6">
            <div>
                <h1>{t("your_skills_graphs")}</h1>
            </div>
            <div className="flex gap-2">
                <Button text={t("create_new")} variant={"primary"} onClick={createSkillsGraph} />
                <Button text={t("create_skill")} variant={"primary"} onClick={createSkill} />
            </div>
        </div>

        {isLoading && (
            <div className="flex justify-center items-center py-8">
                <Loading />
            </div>
        )}

        {isLoadingSkillsGraph && selectedSkillsGraphId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-background rounded-lg p-6 flex flex-col items-center">
                    <Loading />
                    <p className="mt-4 text-text-muted">{t("loading_skills_graph")}</p>
                </div>
            </div>
        )}

        {skillsGraph && skillsGraph.data?.length > 0 ? (
            <div className="bg-background shadow-sm rounded-lg">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-accent border-b border-primary text-xs font-medium text-text uppercase tracking-wider">
                    <div className="col-span-12 sm:col-span-3"> {t("title")} </div>
                    <div className="col-span-6 sm:col-span-2"> {t("status")} </div>
                    <div className="col-span-6 sm:col-span-3"> {t("slug")} </div>
                    <div className="col-span-12 sm:col-span-2"> {t("created")} </div>
                    <div className="col-span-12 sm:col-span-2"> {t("actions")} </div>
                </div>

                <div className="divide-y divide-primary">
                    {skillsGraph.data?.map((graph) => (
                        <div
                            key={graph.id}
                            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-primary-hover transition-colors"
                        >
                            <div className="col-span-12 sm:col-span-3 text-sm font-medium text-text-muted truncate">
                                {graph.title || t("untitled")}
                            </div>

                            <div className="col-span-6 sm:col-span-2 flex items-center">
                                <Status status={(graph.status as StatusType) || t("paused")} size="sm" />
                            </div>

                            <div className="col-span-6 sm:col-span-3 text-sm text-text-muted font-mono truncate">
                                {graph.slug || t("no_slug")}
                            </div>

                            <div className="col-span-12 sm:col-span-2 text-sm text-text-muted">
                                {formatDate(graph.created_at || "")}
                            </div>

                            <div className="col-span-12 sm:col-span-2 flex flex-col sm:flex-row gap-2">
                                <Button text={t("edit")} variant={"primary"} onClick={() => onEditSkillsGraph(graph.id)} />
                                <Button text={t("view")} variant={"primary"} onClick={() => onViewSkillsGraph(graph.id)} />
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        ) : (
            <div className="text-center py-12">
                <div className="text-text-muted text-lg mb-4">{t("no_skills_graphs_found")}</div>
            </div>
        )}
    </div>
}

export default ListSkillsGraph