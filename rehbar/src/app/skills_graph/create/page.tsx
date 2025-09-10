"use client";
import React, { useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Edge,
  Node,
  Position,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import * as d3 from "d3";
import "@xyflow/react/dist/style.css";
import { FiCheck, FiSave } from "react-icons/fi";

import { useTreeStore } from "@/store/tree_store";

import RootNode from "@/components/nodes/root_node";
import ChildNode from "@/components/nodes/child_node";
import { TreeNodeData } from "@/types/skills_graph";
import { ROOT_NODE_ID } from "@/utils/constants";
import { useContentCollectionStore } from "@/store/content_collection";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

const nodeTypes = {
  rootNode: RootNode,
  childNode: ChildNode,
};

const CreateSkillsGraph = () => {
  const { t } = useTranslation();
  const { getRootNodeData, getNodeStatus, getNodeTitle } =
    useContentCollectionStore();
  const treeData = useTreeStore((state) => state.treeData);
  const { addChild } = useTreeStore((state) => state);

  const { getNodeDataMap, getInUsePages, getIsEditing, setIsEditing } =
    useContentCollectionStore();
  const isEditing = getIsEditing();
  const treeLayout = useMemo(() => {
    return d3
      .tree<TreeNodeData>()
      .nodeSize([450, 600])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.5));
  }, []);

  const { nodes, edges } = useMemo(() => {
    function ensureMainNodeFlag(node: any): any {
      return {
        ...node,
        mainNode: typeof node.mainNode === "boolean" ? node.mainNode : false,
        collapsed: typeof node.collapsed === "boolean" ? node.collapsed : false,
        children: node.children
          ? node.children.map(ensureMainNodeFlag)
          : undefined,
      };
    }
    function filterCollapsed(node: any): any {
      return {
        ...node,
        children: node.collapsed
          ? undefined
          : node.children?.map(filterCollapsed),
      };
    }
    const safeTreeData = ensureMainNodeFlag(filterCollapsed(treeData));
    const hierarchy = d3.hierarchy(safeTreeData);
    const treeDataWithLayout = treeLayout(hierarchy);

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    treeDataWithLayout
      .descendants()
      .forEach((node: d3.HierarchyNode<TreeNodeData>) => {
        if (node.data.id === ROOT_NODE_ID) return;

        nodes.push({
          id: node.data.id,
          type: node.data.nodeType ?? "rootNode",
          position: {
            x: node.y ?? 0,
            y: node.x ?? 0,
          },
          data: {
            label: node.data.label,
            mainNode: node.data.mainNode ?? false,
            collapsed: node.data.collapsed ?? false,
            payload: node.data.payload ?? {},
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          style: {
            width: 120,
            height: 40,
          },
        });
      });

    const root = treeDataWithLayout;
    if (root.children) {
      const mainNodes = root.children.filter((child) => child.data.mainNode);
      for (let i = 0; i < mainNodes.length - 1; i++) {
        edges.push({
          id: `e${mainNodes[i].data.id}-${mainNodes[i + 1].data.id}`,
          source: mainNodes[i].data.id,
          target: mainNodes[i + 1].data.id,
          sourceHandle: "bottom",
          targetHandle: "top",
          type: "smoothstep",
          style: {
            stroke: "var(--color-secondary)",
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "var(--color-secondary)",
          },
        });
      }
    }

    treeDataWithLayout
      .descendants()
      .forEach((node: d3.HierarchyNode<TreeNodeData>) => {
        if (node.data.id === "root" || !node.parent) return;
        const parent = node.parent;
        if (!(parent.data.id === "root" && node.data.mainNode)) {
          edges.push({
            id: `${parent.data.id}-${node.data.id}`,
            source: parent.data.id,
            target: node.data.id,
            sourceHandle: "right",
            targetHandle: "left",
            type: "smoothstep",
            animated: false,
            style: {
              stroke: "var(--color-secondary)",
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "var(--color-secondary)",
            },
          });
        }
      });

    return { nodes, edges };
  }, [treeLayout, treeData]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  useEffect(() => {
    //addChild(ROOT_NODE_ID, uuidv4(), "Skills", "rootNode");
  }, []);

  useEffect(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        defaultEdgeOptions={{
          type: "smoothstep",
          style: {
            stroke: "var(--color-secondary)",
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "var(--color-secondary)",
          },
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default CreateSkillsGraph;
