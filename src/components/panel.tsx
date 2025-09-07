"use client";

import React, {
  useState,
  ReactNode,
  useCallback,
  useEffect,
  memo,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { createPortal } from "react-dom";
import { usePanelStore } from "../store/panel";

export function usePanel(panelId: string) {
  const { activePanelId, setActivePanel } = usePanelStore();
  const isPanelOpen = activePanelId === panelId;

  const openPanel = useCallback(
    () => setActivePanel(panelId),
    [panelId, setActivePanel]
  );
  const closePanel = useCallback(() => setActivePanel(null), [setActivePanel]);

  return { isPanelOpen, openPanel, closePanel };
}

interface PanelProps {
  width?: string;
  trigger: (open: () => void, isOpen: boolean) => ReactNode;
  children: ReactNode;
  closeOnBackdropClick?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  panelId: string;
}

const Panel: React.FC<PanelProps> = memo(
  ({
    width = "50vw",
    trigger,
    children,
    closeOnBackdropClick = true,
    isOpen: controlledIsOpen,
    onClose,
    panelId,
  }) => {
    const { activePanelId, setActivePanel } = usePanelStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    const isOpen =
      controlledIsOpen !== undefined
        ? controlledIsOpen
        : activePanelId === panelId;

    const open = useCallback(
      () => setActivePanel(panelId),
      [panelId, setActivePanel]
    );
    const close = useCallback(() => {
      setActivePanel(null);
      onClose?.();
    }, [onClose, setActivePanel]);

    const handleBackdropClick = useCallback(() => {
      if (closeOnBackdropClick) {
        close();
      }
    }, [closeOnBackdropClick, close]);

    const panelContent = useMemo(
      () => (
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black z-[1000]"
                onClick={handleBackdropClick}
              />
              <motion.div
                key="panel"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full bg-white shadow-2xl z-[1001] flex flex-col"
                style={{ width, maxWidth: "100vw" }}
              >
                <div className="flex justify-end p-4">
                  {/* <IconButton
                icon={FaTimes}
                onClick={close}
                id="close"
                iconColor="text-gray-500"
                iconSize={24}
                dataTestId="close-btn"
              /> */}
                </div>
                <div className="h-full overflow-y-auto p-6 pt-12">
                  {children}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      ),
      [isOpen, width, close, handleBackdropClick, children]
    );

    return (
      <>
        {trigger && trigger(open, isOpen)}
        {mounted && createPortal(panelContent, document.body)}
      </>
    );
  }
);

Panel.displayName = "Panel";

export default Panel;
