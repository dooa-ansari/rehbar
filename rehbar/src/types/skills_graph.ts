

export interface SkillsGraph {
  id: string;
  title: string;
  slug?: string;
  status: string;
  graph_structure: any;
  created_at: string;
  updated_at: string;
}

export interface NodeData {
  parentId: string;
  id: string;
  is_grandchild?: boolean;
  title?: string;
  slug?: string;
  status?: string;
}


export interface TreeNodeData {
  id: string;
  label: string;
  children?: TreeNodeData[];
  mainNode: boolean;
  collapsed?: boolean;
  payload?: any;
  nodeType?: string;
}

export interface RootTreeNodeData {
  id: string;
  label: string;
  children: TreeNodeData[];
  mainNode: boolean;
}