"use client";

/**
 * Global modal state. Any button with `action.type === "modal"` calls `openModal`.
 * The modal components themselves live in src/components/modals and read their copy
 * from `site.modals`.
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { Action, DealType } from "@/content/types";
import { withBase } from "@/lib/paths";
import { FindPropertiesModal } from "@/components/modals/FindPropertiesModal";
import { ContactModal } from "@/components/modals/ContactModal";
import { AgentJoinModal } from "@/components/modals/AgentJoinModal";

export type ModalKind = "find-properties" | "contact" | "agent-join";

type ModalState = { kind: ModalKind; dealType?: DealType } | null;

type ModalApi = {
  state: ModalState;
  openModal: (kind: ModalKind, opts?: { dealType?: DealType }) => void;
  closeModal: () => void;
  /** Return keyboard focus to whatever opened the current modal (called by ModalShell on close). */
  restoreFocus: () => void;
  /** Convenience: run a content `Action` (link actions are handled by <Button/> itself). */
  runAction: (action: Action) => void;
};

const ModalContext = createContext<ModalApi | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const openModal = useCallback((kind: ModalKind, opts?: { dealType?: DealType }) => {
    if (typeof document !== "undefined") {
      const active = document.activeElement;
      openerRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
    }
    setState({ kind, dealType: opts?.dealType });
  }, []);
  const closeModal = useCallback(() => setState(null), []);
  const restoreFocus = useCallback(() => {
    const el = openerRef.current;
    openerRef.current = null;
    if (el && el.isConnected) el.focus({ preventScroll: true });
  }, []);
  const runAction = useCallback(
    (action: Action) => {
      if (action.type === "modal") {
        if (action.modal === "find-properties") openModal("find-properties", { dealType: action.dealType });
        else openModal(action.modal);
      } else if (typeof window !== "undefined") {
        if (action.external) window.open(action.href, "_blank", "noopener,noreferrer");
        else window.location.assign(withBase(action.href));
      }
    },
    [openModal],
  );

  const api = useMemo(
    () => ({ state, openModal, closeModal, restoreFocus, runAction }),
    [state, openModal, closeModal, restoreFocus, runAction],
  );

  return (
    <ModalContext.Provider value={api}>
      {children}
      <FindPropertiesModal open={state?.kind === "find-properties"} dealType={state?.dealType} onOpenChange={(o) => !o && closeModal()} />
      <ContactModal open={state?.kind === "contact"} onOpenChange={(o) => !o && closeModal()} />
      <AgentJoinModal open={state?.kind === "agent-join"} onOpenChange={(o) => !o && closeModal()} />
    </ModalContext.Provider>
  );
}

export function useModal(): ModalApi {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within <ModalProvider>");
  return ctx;
}
