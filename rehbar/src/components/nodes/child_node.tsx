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
import { FaPlus, FaTrash } from "react-icons/fa";
import Panel, { usePanel } from "@/components/panel";
import Input from "../input";
import { MemoizedSearchPopup, SearchPopupData } from "../search_popup";
import { useSkills } from "@/providers/apis/skills";
import Popup from "../popup";
import IconButton from "../icon_button";
import {
  FiArrowDown,
  FiArrowUp,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

interface ChildNodeProps {
  id: string;
  data: {
    label: string;
    payload: Record<string, unknown>;
    mainNode: boolean;
    collapsed: boolean;
  };
}

const ChildNode: React.FC<ChildNodeProps> = ({ id, data }) => {
  const { t } = useTranslation("child_node");
  const insertSiblingAfter = useTreeStore((state) => state.insertSiblingAfter);
  const toggleCollapse = useTreeStore((state) => state.toggleCollapse)
  const removeNode = useTreeStore((state) => state.removeNode);
  const hasChildren = useTreeStore((state) => state.hasChildren(id));
  const addChild = useTreeStore((state) => state.addChild);
  const moveNodeUp = useTreeStore((state) => state.moveNodeUp);
  const moveNodeDown = useTreeStore((state) => state.moveNodeDown);
  const [panelContentId, setPanelContentId] = useState("root-node-panel");
  const { isPanelOpen, openPanel, closePanel } = usePanel("root-node-panel");
  const [isEditingContent, setIsEditingContent] = useState(false);

  const {
    getRootNodeData,
    addNodeData,
    getNodeTitle,
    updateNodeProperty,
    removeNodeDataWithChildren,
  } = useContentCollectionStore();
  const rootNodeData = getRootNodeData();
  const nodeTitle = getNodeTitle(id);

  const [keywordSkills, setSkillsKeyword] = useState("");
  const {
    data: skillsData,
    isLoading,
    isError,
    error,
  } = useSkills(keywordSkills);

  const [slug, setSlug] = useState("");

  const [status, setStatus] = useState<PageStatus>("draft");

  const createChildNode = (item: SearchPopupData) => {
    const newChildId = uuidv4();
    addNodeData({
      parentId: id,
      id: newChildId,
      is_grandchild: true,
      title: item.name,
    });
    addChild(id, newChildId, item.name, CHILD_NODE_ID);
  };

  const createSibling = (item: SearchPopupData) => {
    const newChildId = uuidv4();
    addNodeData({
      parentId: id,
      id: newChildId,
      title: item.name,
    });
    insertSiblingAfter(id, newChildId, CHILD_NODE_ID, item.name);
  };

  console.log(nodeTitle);
  const onRemoveNode = () => {
    removeNode(id);
    removeNodeDataWithChildren(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="child_node"
    >
      {data.mainNode && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            style={{ background: "var(--color-green-600)" }}
          />
          <Handle
            type="target"
            position={Position.Top}
            id="top"
            style={{ background: "var(--color-green-600)" }}
          />
        </>
      )}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: "var(--color-green-600)" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: "var(--color-green-600)" }}
      />

      <div className="flex flex-1 justify-between">
        <h3>{nodeTitle}</h3>
        <div className="flex gap-2">
          <IconButton
            id="move-node-up"
            icon={FiArrowUp}
            iconColor="var(--color-gray-600)"
            onClick={() => moveNodeUp(id)}
          />
          <IconButton
            id="move-node-down"
            icon={FiArrowDown}
            iconColor="var(--color-gray-600)"
            onClick={() => moveNodeDown(id)}
          />
        </div>
      </div>

      <div className="flex items-end justify-end flex-1 mt-8">
        {hasChildren && (
          <div>
            {data.collapsed ? (
              <IconButton
                id="collapse-button"
                icon={FiChevronDown}
                iconColor="var(--color-gray-600)"
                hoverClassName="bg-pink-500"
                onClick={() => toggleCollapse(id)}
              />
            ) : (
              <IconButton
                id="collapse-button"
                icon={FiChevronRight}
                iconColor="var(--color-gray-600)"
                hoverClassName="bg-pink-500"
                onClick={() => toggleCollapse(id)}
              />
            )}
          </div>
        )}
        <Popup
          title={t("remove_node")}
          text={t("remove_node_confirmation")}
          onYes={onRemoveNode}
          yesText={t("yes")}
          noText={t("no")}
          trigger={
            <div
              role="button"
              tabIndex={0}
              className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-accent transition-colors shadow-md mr-2"
              style={{ color: "var(--color-gray-600)" }}
            >
              <FaTrash color="var(--color-secondary)" />
            </div>
          }
        />
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
          onClickItem={createChildNode}
          trigger={
            <FaPlus className="text-secondary text-3xl rounded-full p-2 shadow-md cursor-pointer" />
          }
        />
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
          onClickItem={createSibling}
          trigger={
            <FaPlus className="text-primary text-3xl rounded-full p-2 shadow-md cursor-pointer" />
          }
        />
      </div>
      <div className="flex gap-2 pr-6 items-center"></div>

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

export default ChildNode;
