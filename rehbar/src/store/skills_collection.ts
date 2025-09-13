import { NodeData, SkillsGraph } from "@/types/skills_graph";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface SkillsCollectionStore {
  nodeDataMap: Map<string, NodeData>;
  rootNodeId: string | null;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void; 
  getIsEditing: () => boolean;
  setNodeMap: (nodeMap: Map<string, NodeData>) => void;
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
  getNodeSlug: (id: string) => string;
  updateNodeProperty: <K extends keyof NodeData>(
    id: string,
    key: K,
    value: NodeData[K]
  ) => void;
  resetSkillsCollection: () => void;
  setSkillsGraph: (skillsGraph: SkillsGraph) => void;
  getSkillsGraph: () => SkillsGraph | null;
  getNodeDataMap: () => Map<string, NodeData>;
  skillsGraph: SkillsGraph | null;
}

const serializeMap = (map: Map<string, NodeData>): [string, NodeData][] => {
  return Array.from(map.entries()) as [string, NodeData][];
};

const deserializeMap = (
  entries: [string, NodeData][]
): Map<string, NodeData> => {
  return new Map(entries);
};

export const useSkillsCollectionStore = create<SkillsCollectionStore>()(
  persist(
    (set, get) => ({
      skillsGraph: null,
      nodeDataMap: new Map(),
      rootNodeId: null,
      isEditing: false,
      setIsEditing: (isEditing: boolean) => set({ isEditing }),
      setRootNodeId: (rootNodeId: string) => set({ rootNodeId }),
      getRootNodeId: () => get().rootNodeId,
      setSkillsGraph: (skillsGraph: SkillsGraph) => set({ skillsGraph }),
      getSkillsGraph: () => get().skillsGraph,
      setNodeMap: (nodeMap: Map<string, NodeData>) =>
        set({ nodeDataMap: nodeMap }),
      getNodeDataMap: () => get().nodeDataMap,
      getIsEditing: () => get().isEditing,
      getNodeSlug: (id: string) => {
        const nodeData = get().getNodeData(id);
        return nodeData?.slug || "";
      },
      getNodeTitle: (id: string) => {
        const nodeData = get().getNodeData(id);
        return  nodeData?.title || "";
      },
      getNodeStatus: (id: string) => {
        const nodeData = get().getNodeData(id);
        return nodeData?.status || "";
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
      resetSkillsCollection: () =>
        set(() => ({
          nodeDataMap: new Map(),
          rootNodeId: null,
          skillsGraph: null,
        })),
    }),
    {
      name: "skills-collection-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        nodeDataMap: serializeMap(state.nodeDataMap),
        rootNodeId: state.rootNodeId,
        isEditing: state.isEditing,
        skillsGraph: state.skillsGraph,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          (state as any).nodeDataMap = deserializeMap(
            state.nodeDataMap as unknown as [string, NodeData][]
          );
          (state as any).skillsGraph = state.skillsGraph;
        }
      },
    }
  )
);
