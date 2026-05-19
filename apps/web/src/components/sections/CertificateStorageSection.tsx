"use client";

/**
 * Section 7 — CertificateStorageSection
 *
 * Floating glass certificate cards with code-generated previews,
 * tilt, stagger animation, and verified badge.
 *
 * Requirements: 10.1–10.5
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { CERTIFICATES } from "@/data/certificates";
import { useReducedMotionSafe, useInViewReveal, staggerContainer, staggerChild } from "@/lib/motion";
import { SectionWrapper, Badge, GlassCard } from "@certiq/ui";
import { CertificatePreview } from "@/components/previews";

export function CertificateStorageSection(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewReveal(ref, 0.2);
  const { reduced } = useReducedMotionSafe();

  return (
    <SectionWrapper
      id="certificates"
      eyebrow="Certificate Vault"
      heading="Credentials that speak for themselves."
      description="Upload once, attach anywhere. Certiq renders every credential with a verifiable badge so recruiters never have to take your word for it."
    >
      <motion.div
        ref={ref}
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {CERTIFICATES.map((cert) => (
          <motion.div
            key={cert.id}
            variants={staggerChild}
            style={{ transform: `rotate(${cert.tiltDeg}deg)` }}
          >
            <GlassCard interactive className="p-3 flex flex-col gap-3">
              {/* Code-generated certificate preview */}
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <CertificatePreview certId={cert.id} />
              </div>
              <div className="px-1">
                <h3 className="text-text-headline font-sans text-sm font-medium">{cert.title}</h3>
                <p className="text-text-muted font-sans text-xs mt-0.5">{cert.issuer}</p>
              </div>
              {cert.verified && <Badge variant="accent">Verified</Badge>}
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      <p className="text-text-body font-sans text-base mt-8 max-w-2xl text-center">
        Securely store your professional certifications and credentials. Verified badges give recruiters confidence in your qualifications.
      </p>
    </SectionWrapper>
  );
}
