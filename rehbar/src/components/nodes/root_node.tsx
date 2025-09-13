"use client";

import React, { useState } from "react";

import {  useSkillsCollectionStore } from "@/store/skills_collection";
import { motion } from "framer-motion";
import { Handle, Position } from "@xyflow/react";
import { useTreeStore } from "@/store/tree_store";
import { v4 as uuidv4 } from "uuid";
import { ROOT_NODE_ID, CHILD_NODE_ID } from "@/utils/constants";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";
import Panel, { usePanel } from "@/components/panel";
import Input from "../input";
import { MemoizedSearchPopup, SearchPopupData } from "../search_popup";
import { useSkills } from "@/providers/apis/skills";
import Status, { StatusType  } from "../status";
import { slugify } from "@/lib/utils";

interface RootNodeProps {
  id: string;
  data: {
    label: string;
    payload: Record<string, unknown>;
    mainNode: boolean;
  };
}

const RootNode: React.FC<RootNodeProps> = ({ id, data }) => {
  const { t } = useTranslation("root_node");
  const insertSiblingAfter = useTreeStore((state) => state.insertSiblingAfter);
  const [panelContentId, setPanelContentId] = useState("root-node-panel");
  const { isPanelOpen, openPanel, closePanel } = usePanel("root-node-panel");
  const [isEditingContent, setIsEditingContent] = useState(false);

  const { getRootNodeData, addNodeData, getNodeTitle, updateNodeProperty } =
    useSkillsCollectionStore();
  const rootNodeData = getRootNodeData();
  const rootNodeTitle = getNodeTitle(id);

  const [keywordSkills, setSkillsKeyword] = useState("");
  const {
    data: skillsData,
    isLoading,
    isError,
    error,
  } = useSkills(keywordSkills);

  const [slug, setSlug] = useState("");

  const [status, setStatus] = useState<StatusType>("published");

  const addChild = (item: SearchPopupData) => {
    const newChildId = uuidv4()
    addNodeData({
      parentId: ROOT_NODE_ID,
      id: newChildId,
    });
    insertSiblingAfter(id, newChildId, CHILD_NODE_ID, item.name);
  };

  const onTitleChange = (title: string) => {
    updateNodeProperty(id, "title", title);
    generateSlug(title);
  };

  const generateSlug = (title: string) => {
    setSlug(slugify(title));
    updateNodeProperty(id, "slug", slug);
  };

  const onStatusChange = (status: StatusType) => {
    setStatus(status);
    updateNodeProperty(id, "status", status);

  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="rood_node"
    >
      {data.mainNode && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            style={{ background: "var(--color-green-500)" }}
          />
          <Handle
            type="target"
            position={Position.Top}
            id="top"
            style={{ background: "var(--color-green-500)" }}
          />
        </>
      )}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: "var(--color-green-500)" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: "var(--color-green-500)" }}
      />

      <div>
        <div className="float-right mb-4">
          <Status status={status} onToggle={onStatusChange}/>
        </div>
        <Input
          placeHolder={t("designation")}
          onChange={onTitleChange}
          name={"forTitle"}
          defaultValue={rootNodeTitle}
        />
        <div className="flex items-center gap-2 text-sm text-secondary font-semibold mt-2 ml-1 underline">
          <span>{slug}</span>
        </div>

        <div className="flex items-end justify-center flex-1 mt-8">
          <MemoizedSearchPopup
            data={(skillsData ?? []).map((item) => ({
              id: item.id,
              name: item.name,
            }))}
            isLoading={false}
            error={null}
            refetch={() => {}}
            searchKeyword={keywordSkills}
            setSearchKeyword={setSkillsKeyword}
            onClickItem={addChild}
            trigger={
              <FaPlus className="text-primary text-3xl rounded-full p-2 shadow-md cursor-pointer" />
            }
          />
        </div>
      </div>
      <Panel
        width="60vw"
        trigger={() => null}
        isOpen={isPanelOpen}
        onClose={closePanel}
        panelId="root-node-panel"
      >
        <div></div>
      </Panel>
    </motion.div>
  );
};

export default RootNode;
