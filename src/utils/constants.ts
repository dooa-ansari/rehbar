export const ROOT_NODE_ID = "root";
export const CHILD_NODE_ID = "childNode";

export const PAGE_STATUS = {
  Published: "published",
  Paused: "paused",
  Draft: "draft",
} as const;

export type PageStatus = typeof PAGE_STATUS[keyof typeof PAGE_STATUS];