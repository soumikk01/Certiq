"use client";

import { useState, useId, type ReactNode } from "react";

export interface AccordionItemData {
  id: string;
  question: string;
  answer: ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
}

/**
 * Controlled multi-open accordion with keyboard accessibility.
 *
 * Each trigger is a <button> with aria-expanded and aria-controls.
 * Operable via Enter and Space.
 *
 * Requirements: 15.3, 15.4, 15.5, 15.6, 20.8
 */
export function Accordion({ items, className = "" }: AccordionProps): JSX.Element {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const baseId = useId();

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className={`w-full space-y-3 ${className}`.trim()}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className="rounded-xl border border-border-card bg-surface-card-1 backdrop-blur-[16px] overflow-hidden"
          >
            <button
              id={triggerId}
              type="button"
              onClick={() => toggle(item.id)}
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              aria-expanded={isOpen ? "true" : "false"}
              aria-controls={panelId}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-text-headline font-sans font-medium text-base focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 min-h-[44px]"
            >
              <span>{item.question}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`shrink-0 ml-2 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={`overflow-hidden transition-[max-height,opacity] duration-400 ease-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="px-5 pb-4 text-text-body font-sans text-sm leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
