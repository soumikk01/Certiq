"use client";

/**
 * ExpandableNav — animated expandable tab navigation for the sidebar bottom.
 *
 * Adapted from atomixui/expandable-tab for Certiq's dark glassmorphism theme.
 * Replaces the "New Resume" button with a compact animated navigation.
 *
 * Features:
 * - Animated tab switching with slide transitions
 * - Expandable content panels
 * - Spring physics on resize
 * - Dark glass styling matching Certiq dashboard
 */

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import useMeasure from "react-use-measure";

const icons = {
  resume: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  ai: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  templates: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  certs: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  chevron: (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-3" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
};

const MenuItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex h-9 cursor-pointer items-center justify-between gap-2 rounded-xl px-2.5 text-[11px] font-medium text-text-body hover:bg-white/[0.06] hover:text-text-headline transition-colors">
    <span className="flex items-center gap-2">
      {icon}
      {label}
    </span>
    <span className="text-text-muted/40">{icons.chevron}</span>
  </div>
);

const tabs = [
  {
    id: "create",
    label: "Create",
    icon: icons.resume,
    content: (
      <div className="flex flex-col gap-0.5">
        <MenuItem icon={icons.resume} label="New Resume" />
        <MenuItem icon={icons.ai} label="AI Generate" />
        <MenuItem icon={icons.templates} label="From Template" />
      </div>
    ),
  },
  {
    id: "ai",
    label: "AI",
    icon: icons.ai,
    content: (
      <div className="flex flex-col gap-0.5">
        <MenuItem icon={icons.ai} label="Optimize for ATS" />
        <MenuItem icon={icons.ai} label="Rewrite Section" />
        <MenuItem icon={icons.ai} label="Generate Summary" />
      </div>
    ),
  },
  {
    id: "templates",
    label: "Templates",
    icon: icons.templates,
    content: (
      <div className="flex flex-col gap-0.5">
        <MenuItem icon={icons.templates} label="Executive" />
        <MenuItem icon={icons.templates} label="Minimal" />
        <MenuItem icon={icons.templates} label="Developer" />
        <MenuItem icon={icons.templates} label="Creative" />
      </div>
    ),
  },
  {
    id: "certs",
    label: "Certs",
    icon: icons.certs,
    content: (
      <div className="flex flex-col gap-0.5">
        <MenuItem icon={icons.certs} label="Upload Certificate" />
        <MenuItem icon={icons.certs} label="Verify Credential" />
        <MenuItem icon={icons.certs} label="View Vault" />
      </div>
    ),
  },
];

const NAV_H = 44;
const CARD_W = 236;
const COLLAPSED_W = 200;

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 24, opacity: 0, filter: "blur(3px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir * -24, opacity: 0, filter: "blur(3px)" }),
};

const SPRING = { type: "spring" as const, stiffness: 340, damping: 28 };
const EASE = { duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };
const SLIDE_T = { duration: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

export function ExpandableNav() {
  const [activeId, setActiveId] = useState<string | null>("create");
  const [direction, setDirection] = useState(0);
  const prevIdxRef = useRef(0);
  const [ghostRef, { height: contentHeight }] = useMeasure({ debounce: 0 });

  const activeTab = tabs.find((t) => t.id === activeId);
  const isExpanded = activeId !== null;
  const cardHeight = isExpanded ? contentHeight + NAV_H + 8 : NAV_H;

  const handleNavClick = (id: string) => {
    const newIdx = tabs.findIndex((t) => t.id === id);
    if (id === activeId) {
      setActiveId(null);
      return;
    }
    setDirection(newIdx > prevIdxRef.current ? 1 : -1);
    prevIdxRef.current = newIdx;
    setActiveId(id);
  };

  return (
    <>
      {/* Hidden measure element */}
      {isExpanded && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: -9999,
            top: 0,
            width: CARD_W,
            pointerEvents: "none",
            visibility: "hidden",
          }}
        >
          <div ref={ghostRef} className="p-2">
            {activeTab?.content}
          </div>
        </div>
      )}

      <motion.div
        className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden"
        animate={{
          height: cardHeight,
          width: isExpanded ? CARD_W : COLLAPSED_W,
        }}
        transition={SPRING}
      >
        {/* Content area */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: NAV_H,
            overflow: "hidden",
          }}
        >
          <AnimatePresence custom={direction} initial={false}>
            {isExpanded && (
              <motion.div
                key={activeId}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={SLIDE_T}
                style={{ position: "absolute", top: 0, left: 0, right: 0 }}
                className="p-2"
              >
                {activeTab?.content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom nav tabs */}
        <div
          className="absolute bottom-0 left-0 right-0 p-1.5 border-t border-white/[0.06]"
          style={{ height: NAV_H }}
        >
          <div className="flex h-full w-full items-center justify-center gap-0.5">
            {tabs.map((tab) => {
              const isActive = activeId === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className="relative flex h-full items-center justify-center rounded-xl text-[11px] font-semibold"
                  animate={{
                    paddingLeft: isActive ? "0.75rem" : "0.5rem",
                    paddingRight: isActive ? "0.75rem" : "0.5rem",
                    gap: isActive ? "0.375rem" : "0rem",
                    backgroundColor: isActive ? "rgba(217,255,63,0.1)" : "rgba(0,0,0,0)",
                    color: isActive ? "rgb(217,255,63)" : "rgb(148,163,184)",
                  }}
                  transition={EASE}
                  whileHover={{ color: isActive ? "rgb(217,255,63)" : "rgb(203,213,225)" }}
                >
                  {tab.icon}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        key={tab.id + "-lbl"}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{
                          opacity: { duration: 0.12, ease: "easeInOut" },
                          width: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
                        }}
                        className="overflow-hidden leading-4 whitespace-nowrap font-semibold tracking-tight"
                      >
                        {tab.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
