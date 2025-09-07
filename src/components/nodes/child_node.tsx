"use client";

import React, { useState } from "react";

import { useContentCollectionStore } from "@/store/content_collection";
import { Handle, Position } from "@xyflow/react";
import { useTreeStore } from "@/store/tree_store";
import { v4 as uuidv4 } from "uuid";
import {
  FiFileText,
  FiArrowUp,
  FiArrowDown,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { t } from "i18next";
import { PAGE_STATUS, ROOT_NODE_ID, CHILD_NODE_ID } from "@/utils/constants";
import { FaPlus, FaTrash } from "react-icons/fa";
import Button from "@/components/button";
import Panel, { usePanel } from "@/components/panel";

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
  const {
    addNodeData,
    getRootNodeData,
    getNodeData,
    setAssociatedPage,
    setContentType,
    updateRootNodeContentType,
    updateNodeContentType,
    getFilteredAssociatedPages,
    removeNodeDataWithChildren,
    updateNodeProperty,
    getNodeTitle,
  } = useContentCollectionStore();
  const {
    insertSiblingAfter,
    addChild,
    removeNode,
    moveNodeUp,
    moveNodeDown,
    toggleCollapse,
  } = useTreeStore();
  const hasChildren = useTreeStore((state) => state.hasChildren(id));
  const [createContentType, setCreateContentType] = useState(0);
  const rootNodeData = getRootNodeData();
  const nodeData = getNodeData(id);
  const parentNodeData = getNodeData(nodeData?.parentId || "");
  const nodeTitle = getNodeTitle(id);
  const { isPanelOpen, openPanel, closePanel } = usePanel(
    `child-node-panel-${id}`
  );
  const [isChangeContentTypePopupOpen, setIsChangeContentTypePopupOpen] =
    useState(false);

  const [panelContentId, setPanelContentId] = useState("child-node-panel");

  const [status, setStatus] = useState();

  const onRemoveNode = () => {
    removeNode(id);
    removeNodeDataWithChildren(id);
  };

  return (
    <div className="w-[420px] bg-transparent overflow-hidden relative mx-auto mt-8 mb-8">
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
      <div className="flex justify-between">
        <div className="flex gap-2">
          {/* <IconButton
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
          /> */}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative mx-auto mt-5 mb-2 pb-2">
        <div className="flex items-center justify-between w-full bg-pink-500 text-white font-normal text-2xl text-center py-2 px-6">
          <div className="flex items-center flex-row">
            <FiFileText className="text-white mr-2" size={22} />
          </div>

          {/* <StatusChip
            status={status}
            onStatusChange={(val: string) => {
              setStatus(val); 
              updateNodeProperty(id, "status", val);
            }}
            readOnly={false}
          /> */}
        </div>

        <div className="flex items-center pt-6 justify-between">
          {/* <div className="flex gap-2 pr-6 items-center">
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
            
          </div> */}
        </div>
      </div>

      <Panel
        width="60vw"
        trigger={() => null}
        isOpen={isPanelOpen}
        onClose={closePanel}
        panelId={`child-node-panel-${id}`}
      >
        <div></div>
      </Panel>
    </div>
  );
};

export default ChildNode;
