"use client";

import { IconType } from "react-icons";
import clsx from "clsx";

interface IconButtonProps {
  onClick?: () => void;
  onClickWithEvent?: (event: React.MouseEvent) => void;
  id: string;
  icon: IconType;
  iconColor: string;
  label?: string;
  ref?: any;
  iconSize?: number;
  hoverClassName?: string;
  dataTestId?: string;
}

function IconButton(props: IconButtonProps) {
  return (
    <button
      ref={props.ref}
      onClick={props.onClickWithEvent ? props.onClickWithEvent : props.onClick}
      id={props.id}
      className={clsx(
        "bg-white/80 text-gray-700 rounded-full p-2 shadow cursor-pointer",
        props.hoverClassName || "hover:bg-red-500"
      )}
      data-testid={props.dataTestId}
    >
      <props.icon
        size={props.iconSize ? props.iconSize : 20}
        color={props.iconColor}
      />
      {props.label && <span className="text-gray-700">{props.label}</span>}
    </button>
  );
}

export default IconButton;
