import Button from "@/components/button";
import { t } from "i18next";
import React, { useState, ReactNode, ReactElement } from "react";
import { createPortal } from "react-dom";

interface PopupProps {
  trigger?: ReactElement | ((open: () => void) => ReactNode);
  title: string;
  text: string;
  onYes: () => void;
  onNo?: () => void;
  yesText?: string;
  noText?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const Popup: React.FC<PopupProps> = ({
  trigger,
  title,
  text,
  onYes,
  onNo,
  yesText = t("general.yes"),
  noText = t("general.no"),
  isOpen,
  setIsOpen,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled =
    typeof isOpen === "boolean" && typeof setIsOpen === "function";
  const open = () => (isControlled ? setIsOpen!(true) : setInternalOpen(true));
  const close = () =>
    isControlled ? setIsOpen!(false) : setInternalOpen(false);

  const actuallyOpen = isControlled ? isOpen : internalOpen;

  const triggerElement = trigger
    ? typeof trigger === "function"
      ? trigger(open)
      : React.isValidElement(trigger)
      ? React.cloneElement(trigger, { onClick: open })
      : null
    : null;

  return (
    <>
      {triggerElement}
      {actuallyOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-8 w-[90vw] max-w-[400px] shadow-2xl flex flex-col items-center animate-fadeIn">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                <svg
                  className="w-8 h-8 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                {title}
              </h2>
              <p className="text-gray-500 mb-6 text-center text-base">{text}</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2 justify-center">
                <Button
                  onClick={() => {
                    onYes();
                    close();
                  }}
                  className={`w-full sm:w-auto px-6 py-2 text-white font-semibold rounded transition-colors cursor-pointer bg-green-500 hover:bg-green-600`}
                  text={yesText}
                  variant={"primary"}
                />
                <Button
                  onClick={() => {
                    onNo?.();
                    close();
                  }}
                  className={`w-full sm:w-auto px-6 py-2 text-white font-semibold rounded transition-colors cursor-pointer bg-red-500 hover:bg-red-600`}
                  text={noText}
                  variant={"primary"}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Popup;
