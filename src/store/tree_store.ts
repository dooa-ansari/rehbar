import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";
import { TreeNodeData } from "models/content_collection_types";
import { RootTreeNodeData } from "models/content_collection_types";

interface TreeStore {
  treeData: RootTreeNodeData;
  setTreeData: (data: RootTreeNodeData) => void;
  updateNode: (nodeId: string, newData: Partial<TreeNodeData>) => void;
  addChild: (
    contextNodeId: string,
    nodeId: string,
    label: string,
    nodeType: string,
    payload?: any
  ) => void;
  removeNode: (nodeId: string) => void;
  insertSiblingAfter: (
    contextNodeId: string,
    id: string,
    nodeType: string,
    label: string
  ) => void;
  toggleCollapse: (nodeId: string) => void;
  moveMainNodeUp: (nodeId: string) => void;
  moveMainNodeDown: (nodeId: string) => void;
  moveNodeUp: (nodeId: string) => void;
  moveNodeDown: (nodeId: string) => void;
  hasChildren: (nodeId: string) => boolean;
  resetTree: () => void;
}

export const useTreeStore = create<TreeStore>()(
  immer(
    persist(
      (set, get) => ({
        treeData: {
          id: "root",
          label: "Root",
          children: [] as TreeNodeData[],
          mainNode: false,
        } as RootTreeNodeData,

        hasChildren: (nodeId: string) => {
          const findNode = (node: TreeNodeData): boolean => {
            if (node.id === nodeId) {
              return Boolean(node.children && node.children.length > 0);
            }
            if (node.children) {
              return node.children.some(findNode);
            }
            return false;
          };
          return findNode(get().treeData);
        },

        setTreeData: (data) =>
          set((state) => {
            state.treeData = data;
          }),

        updateNode: (nodeId, newData) =>
          set((state) => {
            const updateNodeInTree = (node: TreeNodeData) => {
              if (node.id === nodeId) {
                Object.assign(node, newData);
              }
              node.children?.forEach(updateNodeInTree);
            };
            updateNodeInTree(state.treeData);
          }),

        addChild: (contextNodeId, nodeId, label, nodeType, payload) =>
          set((state) => {
            const addChildToNode = (node: TreeNodeData) => {
              if (node.id === contextNodeId) {
                const newChild = {
                  id: nodeId,
                  label: label,
                  mainNode: node.id === "root",
                  payload: payload,
                  nodeType: nodeType,
                };
                if (!node.children) node.children = [];
                node.children.push(newChild);
              } else {
                node.children?.forEach(addChildToNode);
              }
            };
            addChildToNode(state.treeData);
          }),

        removeNode: (nodeId) =>
          set((state) => {
            const removeNodeFromTree = (node: TreeNodeData) => {
              if (node.children) {
                node.children = node.children.filter(
                  (child) => child.id !== nodeId
                );
                node.children.forEach(removeNodeFromTree);
              }
            };
            removeNodeFromTree(state.treeData);
          }),

        insertSiblingAfter: (contextNodeId, id, nodeType, label) =>
          set((state) => {
            const isMainNode = (parent: TreeNodeData) => parent.id === "root";
            const findParentAndIndex = (
              node: TreeNodeData,
              parent: TreeNodeData | null = null
            ): {
              parent: TreeNodeData | null;
              index: number;
              siblings: TreeNodeData[];
            } | null => {
              if (!node.children) return null;
              for (let i = 0; i < node.children.length; i++) {
                if (node.children[i].id === contextNodeId) {
                  return { parent: node, index: i, siblings: node.children };
                }
                const found = findParentAndIndex(node.children[i], node);
                if (found) return found;
              }
              return null;
            };
            const result = findParentAndIndex(state.treeData);
            if (result && result.parent) {
              const { parent, index, siblings } = result;
              if (isMainNode(parent)) {
                const newNode = {
                  id: id,
                  label: label,
                  mainNode: true,
                  nodeType: nodeType,
                };
                siblings.splice(index + 1, 0, newNode);
              } else {
                const newNode = {
                  id: id,
                  label: label,
                  mainNode: false,
                  nodeType: nodeType,
                };
                siblings.splice(index + 1, 0, newNode);
                siblings.forEach((sibling, idx) => {
                  sibling.label = `${parent.label}${idx + 1}`;
                });
              }
            }
          }),

        toggleCollapse: (nodeId) =>
          set((state) => {
            const toggle = (node: TreeNodeData) => {
              if (node.id === nodeId) {
                node.collapsed = !node.collapsed;
              } else {
                node.children?.forEach(toggle);
              }
            };
            toggle(state.treeData);
          }),

        moveMainNodeUp: (nodeId) =>
          set((state) => {
            const root = state.treeData;
            if (!root.children) return;
            const idx = root.children.findIndex((child) => child.id === nodeId);
            if (idx > 0) {
              const temp = root.children[idx - 1];
              root.children[idx - 1] = root.children[idx];
              root.children[idx] = temp;
            }
          }),

        moveMainNodeDown: (nodeId) =>
          set((state) => {
            const root = state.treeData;
            if (!root.children) return;
            const idx = root.children.findIndex((child) => child.id === nodeId);
            if (idx !== -1 && idx < root.children.length - 1) {
              const temp = root.children[idx + 1];
              root.children[idx + 1] = root.children[idx];
              root.children[idx] = temp;
            }
          }),

        moveNodeUp: (nodeId) =>
          set((state) => {
            const findParentAndIndex = (
              node: TreeNodeData,
              parent: TreeNodeData | null = null
            ): {
              parent: TreeNodeData | null;
              index: number;
              siblings: TreeNodeData[];
            } | null => {
              if (!node.children) return null;
              for (let i = 0; i < node.children.length; i++) {
                if (node.children[i].id === nodeId) {
                  return { parent: node, index: i, siblings: node.children };
                }
                const found = findParentAndIndex(node.children[i], node);
                if (found) return found;
              }
              return null;
            };
            const result = findParentAndIndex(state.treeData);
            if (result && result.parent) {
              const { index, siblings } = result;
              if (index > 0) {
                const temp = siblings[index - 1];
                siblings[index - 1] = siblings[index];
                siblings[index] = temp;
              }
            }
          }),

        moveNodeDown: (nodeId) =>
          set((state) => {
            const findParentAndIndex = (
              node: TreeNodeData,
              parent: TreeNodeData | null = null
            ): {
              parent: TreeNodeData | null;
              index: number;
              siblings: TreeNodeData[];
            } | null => {
              if (!node.children) return null;
              for (let i = 0; i < node.children.length; i++) {
                if (node.children[i].id === nodeId) {
                  return { parent: node, index: i, siblings: node.children };
                }
                const found = findParentAndIndex(node.children[i], node);
                if (found) return found;
              }
              return null;
            };
            const result = findParentAndIndex(state.treeData);
            if (result && result.parent) {
              const { index, siblings } = result;
              if (index !== -1 && index < siblings.length - 1) {
                const temp = siblings[index + 1];
                siblings[index + 1] = siblings[index];
                siblings[index] = temp;
              }
            }
          }),

        resetTree: () =>
          set((state) => {
            state.treeData = {
              id: "root",
              label: "Root",
              children: [] as TreeNodeData[],
              mainNode: false,
            } as RootTreeNodeData;
          }),
      }),
      {
        name: "tree-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
