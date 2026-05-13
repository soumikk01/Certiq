"use client";

/**
 * Section 6 — BuilderDemo
 *
 * Two-column form + live preview with 7 sections, AI suggestions, theme switcher.
 *
 * Requirements: 9.1–9.8
 */

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { BUILDER_MOCK } from "@/data/builder";
import { useReducedMotionSafe, useInViewReveal, fadeUp } from "@/lib/motion";
import { SectionWrapper, Badge } from "@certiq/ui";

export function BuilderDemo(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewReveal(ref, 0.2);
  const { reduced } = useReducedMotionSafe();

  const [activeSection, setActiveSection] = useState(BUILDER_MOCK.sections[0]?.id ?? "profile");
  const [previewTheme, setPreviewTheme] = useState(BUILDER_MOCK.previewThemes[0] ?? "Executive");
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleFieldChange = useCallback((fieldName: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  const currentSection = BUILDER_MOCK.sections.find((s) => s.id === activeSection);
  const suggestions = BUILDER_MOCK.aiSuggestions[activeSection] ?? [];

  return (
    <SectionWrapper
      id="builder"
      eyebrow="Resume Builder"
      heading="Build in real time."
      description="Edit your resume with a live preview that updates instantly. No page refreshes, no waiting."
    >
      <motion.div
        ref={ref}
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {/* Form column */}
        <div className="rounded-xl border border-border-card bg-surface-card-1 backdrop-blur-[16px] p-6">
          {/* Section tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {BUILDER_MOCK.sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-colors min-h-[36px] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                  activeSection === section.id
                    ? "bg-accent text-[#0F172A]"
                    : "bg-surface-card-2 text-text-muted hover:text-text-headline"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Form fields */}
          {currentSection && (
            <div className="space-y-4">
              {currentSection.sampleFields.map((field) => {
                const fieldId = `builder-${currentSection.id}-${field.name.toLowerCase().replace(/\s+/g, "-")}`;
                return (
                  <div key={field.name}>
                    <label htmlFor={fieldId} className="block text-text-muted font-sans text-xs mb-1">
                      {field.name}
                    </label>
                    <input
                      id={fieldId}
                      type="text"
                      defaultValue={field.value}
                      placeholder={field.name}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full rounded-lg border border-border-card bg-bg-2 px-3 py-2 text-text-headline font-sans text-sm focus:outline-2 focus:outline-accent focus:outline-offset-1 min-h-[44px]"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* AI suggestions popup */}
          {suggestions.length > 0 && (
            <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 p-3">
              <p className="text-accent font-sans text-xs font-medium mb-1">✨ AI Suggestion</p>
              <p className="text-text-body font-sans text-xs">{suggestions[0]}</p>
            </div>
          )}

          {/* Autosaved badge */}
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="accent">Autosaved</Badge>
          </div>
        </div>

        {/* Preview column */}
        <div className="rounded-xl border border-border-card bg-surface-card-1 backdrop-blur-[16px] p-6 flex flex-col">
          {/* Theme switcher */}
          <div className="flex gap-2 mb-4">
            {BUILDER_MOCK.previewThemes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPreviewTheme(t)}
                className={`px-3 py-1 rounded-full font-sans text-xs transition-colors min-h-[32px] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                  previewTheme === t
                    ? "bg-accent text-[#0F172A]"
                    : "bg-surface-card-2 text-text-muted hover:text-text-headline"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Mock preview */}
          <div className="flex-1 rounded-lg bg-bg-2 border border-border-card p-6 min-h-[300px]">
            <div className="space-y-3">
              <div className="h-4 w-1/2 rounded bg-bg-3" />
              <div className="h-3 w-3/4 rounded bg-bg-3" />
              <div className="h-3 w-2/3 rounded bg-bg-3" />
              <div className="h-8 w-full rounded bg-bg-3 mt-4" />
              <div className="h-3 w-full rounded bg-bg-3" />
              <div className="h-3 w-5/6 rounded bg-bg-3" />
            </div>
            <p className="text-text-muted font-sans text-xs mt-4 text-center">
              Live preview — {previewTheme} theme
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
