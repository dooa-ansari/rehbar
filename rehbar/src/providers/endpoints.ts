export interface EndPointType {
  [key: string]: { key: string; url: string };
}

export const EndPoint: EndPointType = {
  skills: {
    key: "skills",
    url: "/skills",
  },
  graph: {
    key: "graph",
    url: "/graph",
  },
};
