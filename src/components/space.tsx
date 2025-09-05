import React, { ReactNode } from "react";

type SpaceProps = {
  size?: "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10";
  direction?: "vertical" | "horizontal";
};

const Space: React.FC<SpaceProps> = ({
  size = "4",
  direction = "vertical",
}) => {
  const spaceClass =
    direction === "vertical" ? `space-y-${size}` : `space-x-${size}`;

  return <></>
};

export default Space;
