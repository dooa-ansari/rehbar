"use client";

import React, { useState } from "react";

import { useContentCollectionStore } from "@/store/content_collection";
import { motion } from "framer-motion";
import { Handle, Position } from "@xyflow/react";
import { useTreeStore } from "@/store/tree_store";
import { v4 as uuidv4 } from "uuid";
import { PageStatus, ROOT_NODE_ID, CHILD_NODE_ID } from "@/utils/constants";
import { useTranslation } from "react-i18next";
import Button from "@/components/button";
import { FaPlus } from "react-icons/fa";
import Panel, { usePanel } from "@/components/panel";
import Input from "../input";

interface RootNodeProps {
  id: string;
  data: {
    label: string;
    payload: Record<string, unknown>;
    mainNode: boolean;
  };
}

const RootNode: React.FC<RootNodeProps> = ({ id, data }) => {
  const { t } = useTranslation();
  const insertSiblingAfter = useTreeStore((state) => state.insertSiblingAfter);
  const [panelContentId, setPanelContentId] = useState("root-node-panel");
  const { isPanelOpen, openPanel, closePanel } = usePanel("root-node-panel");
  const [isEditingContent, setIsEditingContent] = useState(false);

  const { getRootNodeData, addNodeData, getNodeTitle, updateNodeProperty } =
    useContentCollectionStore();
  const rootNodeData = getRootNodeData();
  const rootNodeTitle = getNodeTitle(id);

  // const [searchKeywordAssociatedPages, setSearchKeywordAssociatedPages] =
  //   useState("");

  const [slug, setSlug] = useState("");

  const [status, setStatus] = useState<PageStatus>("draft");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="w-[420px] bg-transparent overflow-hidden relative mx-auto mt-8 mb-8"
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
        <Input placeHolder={"Mobile Developer"} onChange={() => {}} name={"forTitle"} />
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
