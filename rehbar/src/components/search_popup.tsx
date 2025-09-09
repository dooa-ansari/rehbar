"use client";

import { useCallback, useEffect, useRef, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import React from "react";
import Button from "./button";
import { useTranslation } from "react-i18next";

export interface SearchPopupData {
  id: string;
  name: string;
}

function SearchPopup({
  data,
  isLoading,
  error,
  refetch,
  searchKeyword,
  setSearchKeyword,
  onClickItem,
  label,
  trigger,
}: {
  data: SearchPopupData[];
  isLoading: boolean;
  error: any;
  refetch: () => void;
  searchKeyword: string;
  setSearchKeyword: (searchKeyword: string) => void;
  onClickItem: (item: SearchPopupData) => void;
  label?: string;
  trigger?: ReactNode;
}) {
  const { t } = useTranslation("root_node");
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpen = useCallback(() => {
    const currentRef = trigger ? divRef.current : buttonRef.current;
    if (currentRef) {
      const rect = currentRef.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
      });
    }
    setShow(true);
  }, [trigger]);
  const handleClose = useCallback(() => setShow(false), []);

  useEffect(() => {
    if (!show) return;

    function handleEvent(e: MouseEvent | KeyboardEvent) {
      if (
        e instanceof MouseEvent &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        !divRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        handleClose();
      }
      if (e instanceof KeyboardEvent && e.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleEvent);
    document.addEventListener("keydown", handleEvent);

    return () => {
      document.removeEventListener("mousedown", handleEvent);
      document.removeEventListener("keydown", handleEvent);
    };
  }, [show, handleClose]);

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchKeyword(e.target.value);
    },
    [setSearchKeyword]
  );

  const popup = show
    ? createPortal(
        <div
          ref={popupRef}
          className="fixed bg-white border border-gray-300 rounded shadow-lg p-4 z-10 min-w-[220px] text-black"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
            onClick={handleClose}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
          <div className="mt-5 mb-5">
            <input
              type="text"
              value={searchKeyword}
              onChange={handleChange}
              placeholder="Search..."
              className="w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>

          <ul>
            {isLoading && <li>Loading...</li>}
            {error && (
              <li className="text-red-500">{(error as Error).message}</li>
            )}
            {!isLoading &&
              !error &&
              data.map((item: SearchPopupData) => (
                <li
                  className="text-black ml-1 mt-1 cursor-pointer hover:text-blue-600"
                  key={item.id}
                  onClick={() => {
                    onClickItem(item);
                    handleClose();
                  }}
                >
                  {item.name}
                </li>
              ))}
          </ul>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {trigger ? (
        <div ref={divRef} onClick={handleOpen}>
          {trigger}
        </div>
      ) : (
        <Button onClick={handleOpen} text={label} variant={"primary"} />
      )}
      {popup}
    </>
  );
}

export const MemoizedSearchPopup = React.memo(SearchPopup);
