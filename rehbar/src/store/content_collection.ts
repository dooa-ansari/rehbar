import { NodeData } from "@/types/skills_graph";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ContentCollectionStore {
  nodeDataMap: Map<string, NodeData>;
  rootNodeId: string | null;
  inUsePages: Set<string>;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  getIsEditing: () => boolean;
  getInUsePages: () => Set<string>;
  setNodeMap: (nodeMap: Map<string, NodeData>) => void;
  setInUsePages: (inUsePages: Set<string>) => void;
  setRootNodeId: (rootNodeId: string) => void;
  getRootNodeId: () => string | null;
  setNodeDataMap: (nodeDataMap: Map<string, NodeData>) => void;
  addNodeData: (nodeData: NodeData) => void;
  setRootNodeData: (nodeData: NodeData) => void;
  getNodeData: (id: string) => NodeData | null;
  getRootNodeData: () => NodeData | null;
  removeNodeDataWithChildren: (id: string) => void;
  getNodeTitle: (id: string) => string;
  getNodeStatus: (id: string) => string;
  updateNodeProperty: <K extends keyof NodeData>(
    id: string,
    key: K,
    value: NodeData[K]
  ) => void;
  resetContentCollection: () => void;
  getNodeDataMap: () => Map<string, NodeData>;
}

const serializeMap = (map: Map<string, NodeData>): [string, NodeData][] => {
  return Array.from(map.entries()) as [string, NodeData][];
};

const deserializeMap = (
  entries: [string, NodeData][]
): Map<string, NodeData> => {
  return new Map(entries);
};

export const useContentCollectionStore = create<ContentCollectionStore>()(
  persist(
    (set, get) => ({
      contentCollection: null,
      nodeDataMap: new Map(),
      rootNodeId: null,
      inUsePages: new Set(),
      isEditing: false,
      setIsEditing: (isEditing: boolean) => set({ isEditing }),
      getIsEditing: () => get().isEditing,
      setInUsePages: (inUsePages: Set<string>) => set({ inUsePages }),
      setRootNodeId: (rootNodeId: string) => set({ rootNodeId }),
      getInUsePages: () => get().inUsePages,
      setNodeMap: (nodeMap: Map<string, NodeData>) =>
        set({ nodeDataMap: nodeMap }),
      getNodeDataMap: () => get().nodeDataMap,
      getNodeTitle: (id: string) => {
        const nodeData = get().getNodeData(id);
        return  nodeData?.title || "";
      },
      getNodeStatus: (id: string) => {
        const nodeData = get().getNodeData(id);
        return "published"
      },
      removeNodeDataWithChildren: (id: string) => {
        const nodeData = get().getNodeData(id);
        if (nodeData) {
          get().nodeDataMap.forEach((nodeData, nodeId) => {
            if (nodeData.parentId === id) {
              get().removeNodeDataWithChildren(nodeId);
            }
          });
          get().nodeDataMap.delete(id);
        }
      },
      setNodeDataMap: (nodeDataMap: Map<string, NodeData>) =>
        set({ nodeDataMap }),
      addNodeData: (nodeData: NodeData) =>
        set((state) => {
          return {
            nodeDataMap: state.nodeDataMap.set(nodeData.id, nodeData),
          };
        }),
      getRootNodeId: () => get().rootNodeId,
      setRootNodeData: (nodeData: NodeData) =>
        set((state) => {
          if (state.nodeDataMap.has(nodeData.id)) {
            return {
              nodeDataMap: state.nodeDataMap.set(nodeData.id, nodeData),
              rootNodeId: nodeData.id,
            };
          }
          return {
            nodeDataMap: state.nodeDataMap.set(nodeData.id, nodeData),
            rootNodeId: nodeData.id,
          };
        }),
      getNodeData: (id: string) => get().nodeDataMap.get(id) || null,
      getRootNodeData: () => {
        const rootNodeId = get().rootNodeId;
        return rootNodeId ? get().nodeDataMap.get(rootNodeId) || null : null;
      },
      updateNodeProperty: <K extends keyof NodeData>(
        id: string,
        key: K,
        value: NodeData[K]
      ) =>
        set((state) => {
          const nodeData = state.getNodeData(id);
          if (nodeData) {
            return {
              nodeDataMap: state.nodeDataMap.set(id, {
                ...nodeData,
                [key]: value,
              }),
            };
          }
          return state;
        }),
      resetContentCollection: () =>
        set(() => ({
          nodeDataMap: new Map(),
          rootNodeId: null,
          inUsePages: new Set(),
          isEditing: false,
        })),
    }),
    {
      name: "content-collection-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        nodeDataMap: serializeMap(state.nodeDataMap),
        rootNodeId: state.rootNodeId,
        isEditing: state.isEditing,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          (state as any).nodeDataMap = deserializeMap(
            state.nodeDataMap as unknown as [string, NodeData][]
          );
        }
      },
    }
  )
);
