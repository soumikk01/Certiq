"use client";

/**
 * DocumentStage — cinematic interactive hero artifact.
 *
 * Replaces the video hero with a living, glass-and-paper document tableau:
 *  - floating resume sheet (top layer, draggable to peel)
 *  - certificate stack behind it (splays on drag progress)
 *  - cursor-follow parallax tilt (springs)
 *  - specular highlight that tracks the pointer across the sheet
 *  - AI-highlight chips that fade in as the sheet peels
 *  - spring physics on release; respects prefers-reduced-motion
 *  - touch-friendly drag on mobile
 *
 * The component is purely presentational; it emits no network calls and
 * gracefully degrades to a static composition when motion is reduced.
 */

import { useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  animate,
  type PanInfo,
} from "framer-motion";

import { useReducedMotionSafe, EASE_PREMIUM } from "@/lib/motion";

/** Maximum horizontal peel distance (px) mapped to a full 0→1 drag progress. */
const PEEL_RANGE = 180;

/** Tilt amplitude in degrees for cursor-follow parallax. */
const TILT_X = 8;
const TILT_Y = 10;

const SKILL_CHIPS = [
  "TypeScript",
  "Systems design",
  "Product sense",
  "Leadership",
] as const;

const CERTIFICATES = [
  { issuer: "AWS", title: "Solutions Architect", hue: "#38BDF8" },
  { issuer: "Google", title: "Professional Cloud", hue: "#F472B6" },
  { issuer: "Stanford", title: "Machine Learning", hue: "#C7FF00" },
] as const;

export function DocumentStage(): JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const { reduced, disableParallax, disableHoverScale } = useReducedMotionSafe();

  // Cursor-normalized [-0.5, 0.5] position inside the stage.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springPointerX = useSpring(pointerX, { stiffness: 120, damping: 18, mass: 0.6 });
  const springPointerY = useSpring(pointerY, { stiffness: 120, damping: 18, mass: 0.6 });

  // Cursor in sheet-local coords (0%–100%) — drives the specular reflection.
  const sheetLightX = useSpring(useMotionValue(50), { stiffness: 80, damping: 20 });
  const sheetLightY = useSpring(useMotionValue(30), { stiffness: 80, damping: 20 });

  // Peel: horizontal drag offset on the top sheet.
  const peelX = useMotionValue(0);
  const peelProgress = useTransform(peelX, [0, PEEL_RANGE], [0, 1], { clamp: true });

  // Tilt derived from pointer; disabled under reduced motion.
  const tiltY = useTransform(springPointerX, (v) => (disableParallax ? 0 : v * TILT_Y));
  const tiltX = useTransform(springPointerY, (v) => (disableParallax ? 0 : -v * TILT_X));

  // Sheet transforms combining pointer tilt + peel rotation.
  const sheetRotateY = useTransform([tiltY, peelX], ([ty, px]) => {
    const peelRot = (px as number) / PEEL_RANGE * -14; // open rightward
    return (ty as number) + peelRot;
  });
  const sheetRotateX = tiltX;
  const sheetSkewY = useTransform(peelX, [0, PEEL_RANGE], [0, -1.5]);

  // Certificate splay — each card offsets based on peelProgress.
  const certSplay = useTransform(peelProgress, [0, 1], [0, 1]);

  // AI highlight reveal opacity.
  const aiOpacity = useTransform(peelProgress, [0.05, 0.55], [0, 1]);
  const aiLift = useTransform(peelProgress, [0.05, 0.55], [8, 0]);

  // Hint label fades out once the user starts peeling.
  const hintOpacity = useTransform(peelProgress, [0, 0.08], [1, 0]);

  // Edge tear line intensity.
  const tearOpacity = useTransform(peelProgress, [0.02, 0.35], [0, 1]);

  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disableParallax) return;
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      pointerX.set(nx);
      pointerY.set(ny);
      sheetLightX.set(((e.clientX - rect.left) / rect.width) * 100);
      sheetLightY.set(((e.clientY - rect.top) / rect.height) * 100);
    },
    [disableParallax, pointerX, pointerY, sheetLightX, sheetLightY],
  );

  const handlePointerLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
    setIsHovering(false);
  }, [pointerX, pointerY]);

  const handleDragEnd = useCallback(
    (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      setIsDragging(false);
      const target =
        info.offset.x > PEEL_RANGE * 0.6 || info.velocity.x > 600
          ? PEEL_RANGE
          : 0;
      animate(peelX, target, {
        type: "spring",
        stiffness: 180,
        damping: 22,
        mass: 0.9,
      });
      // Always relax back to 0 shortly after a full peel so the demo is repeatable.
      if (target === PEEL_RANGE) {
        const t = setTimeout(() => {
          animate(peelX, 0, { type: "spring", stiffness: 140, damping: 24 });
        }, 1800);
        return () => clearTimeout(t);
      }
    },
    [peelX],
  );

  // Pre-composed CSS strings derived from motion values.
  const specularBackground = useMotionTemplate`radial-gradient(circle at ${sheetLightX}% ${sheetLightY}%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%)`;

  return (
    <div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto w-full max-w-[560px] h-[440px] sm:h-[520px] lg:h-[580px] select-none"
      style={{ perspective: "1400px", touchAction: "pan-y" }}
      aria-label="Interactive resume and certificate stack. Drag the resume to peel it open."
      role="img"
    >
      {/* Ambient accent glow behind the stack */}
      <div
        aria-hidden="true"
        className="absolute inset-x-10 top-10 bottom-10 rounded-[60%] blur-[80px] opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(217,255,63,0.35) 0%, rgba(217,255,63,0) 60%), radial-gradient(ellipse at 70% 70%, rgba(125,211,252,0.25) 0%, rgba(125,211,252,0) 65%)",
        }}
      />

      {/* ── Certificate stack (layered behind the resume) ── */}
      {CERTIFICATES.map((cert, i) => {
        const depth = i + 1;
        const baseRotate = -8 + i * 6;
        const baseX = -36 + i * 10;
        const baseY = 34 + i * 18;

        const splayX = useTransform(
          certSplay,
          [0, 1],
          [0, -80 + i * 80],
        );
        const splayY = useTransform(certSplay, [0, 1], [0, 12 - i * 6]);
        const splayRotate = useTransform(
          certSplay,
          [0, 1],
          [0, -14 + i * 14],
        );

        return (
          <motion.div
            key={cert.issuer}
            className="absolute left-1/2 top-1/2 w-[240px] h-[310px] sm:w-[260px] sm:h-[330px] rounded-2xl border border-white/20 shadow-[0_30px_80px_rgba(15,23,42,0.35)] overflow-hidden"
            style={{
              x: useTransform([splayX], ([v]) => `calc(-50% + ${baseX + (v as number)}px)`),
              y: useTransform([splayY], ([v]) => `calc(-50% + ${baseY + (v as number)}px)`),
              rotate: useTransform([splayRotate], ([v]) => `${baseRotate + (v as number)}deg`),
              zIndex: 10 - depth,
              background:
                "linear-gradient(140deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 55%, rgba(255,255,255,0.78) 100%)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <div className="absolute inset-0 opacity-70 pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%)",
                }}
              />
            </div>

            <div className="relative h-full flex flex-col p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-sans tracking-[0.18em] uppercase text-slate-500">
                    Certificate
                  </p>
                  <p className="mt-1 font-serif text-slate-900 text-lg leading-tight">
                    {cert.title}
                  </p>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-semibold text-white"
                  style={{ background: cert.hue }}
                  aria-hidden="true"
                >
                  {cert.issuer.slice(0, 2)}
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <div className="h-2 rounded-full bg-slate-900/10 w-5/6" />
                <div className="h-2 rounded-full bg-slate-900/10 w-3/5" />
                <div className="h-2 rounded-full bg-slate-900/10 w-2/3" />
              </div>

              <div className="mt-auto flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-slate-400">
                    Issued by
                  </p>
                  <p className="mt-0.5 font-sans text-xs font-medium text-slate-800">
                    {cert.issuer}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-full border border-slate-900/15 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 0deg, #D9FF3F, #C7FF00, #D9FF3F)",
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* ── AI highlight chips (fade in during peel) ── */}
      <motion.div
        aria-hidden={!isDragging}
        className="absolute right-[-8px] top-[8%] flex flex-col gap-2 pointer-events-none z-30"
        style={{ opacity: aiOpacity, y: aiLift }}
      >
        {SKILL_CHIPS.slice(0, 2).map((s) => (
          <span
            key={s}
            className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-sans font-medium text-slate-800 border border-slate-900/10 shadow-[0_4px_14px_rgba(15,23,42,0.12)]"
          >
            ✨ {s}
          </span>
        ))}
      </motion.div>

      <motion.div
        aria-hidden={!isDragging}
        className="absolute left-[-12px] bottom-[14%] flex flex-col gap-2 pointer-events-none z-30"
        style={{ opacity: aiOpacity, y: aiLift }}
      >
        {SKILL_CHIPS.slice(2).map((s) => (
          <span
            key={s}
            className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-sans font-medium text-slate-800 border border-slate-900/10 shadow-[0_4px_14px_rgba(15,23,42,0.12)]"
          >
            ✨ {s}
          </span>
        ))}
      </motion.div>

      {/* ── Top resume sheet ── */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-[300px] h-[400px] sm:w-[340px] sm:h-[450px] rounded-[22px] overflow-hidden z-20 cursor-grab active:cursor-grabbing"
        drag={reduced ? false : "x"}
        dragConstraints={{ left: 0, right: PEEL_RANGE + 10 }}
        dragElastic={0.18}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        {...(disableHoverScale ? {} : { whileHover: { scale: 1.012 } })}
        style={{
          x: peelX,
          translateX: "-50%",
          translateY: "-50%",
          rotateY: sheetRotateY,
          rotateX: sheetRotateX,
          skewY: sheetSkewY,
          transformPerspective: 1400,
          transformStyle: "preserve-3d",
          background:
            "linear-gradient(152deg, rgba(255,255,255,0.96) 0%, rgba(250,252,255,0.9) 45%, rgba(255,255,255,0.95) 100%)",
          boxShadow:
            "0 40px 120px rgba(15,23,42,0.25), 0 12px 32px rgba(15,23,42,0.14), inset 0 0 0 1px rgba(255,255,255,0.6)",
        }}
      >
        {/* Specular highlight that follows the cursor across the sheet */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{ background: specularBackground, opacity: isHovering ? 0.9 : 0.4 }}
        />

        {/* Inner document layout */}
        <div className="relative h-full p-6 sm:p-7 flex flex-col text-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-slate-400">
                Resume · 2026
              </p>
              <h3 className="mt-2 font-serif text-2xl sm:text-[26px] leading-none text-slate-900">
                Alex Morgan
              </h3>
              <p className="mt-1 font-sans text-[11px] text-slate-500">
                Staff Product Engineer · San Francisco
              </p>
            </div>
            <div
              aria-hidden="true"
              className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center"
            >
              <span className="font-serif text-white text-sm">AM</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-[9px] font-sans text-slate-500">
            <div>
              <p className="uppercase tracking-[0.15em] text-slate-400">Email</p>
              <p className="mt-0.5 text-slate-700">alex@morgan.dev</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.15em] text-slate-400">Phone</p>
              <p className="mt-0.5 text-slate-700">+1 415 ···</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.15em] text-slate-400">Web</p>
              <p className="mt-0.5 text-slate-700">morgan.dev</p>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-slate-400">
              Summary
            </p>
            <div className="mt-2 space-y-1.5">
              <div className="h-[6px] rounded-full bg-slate-900/10 w-full" />
              <div className="h-[6px] rounded-full bg-slate-900/10 w-[92%]" />
              <div className="h-[6px] rounded-full bg-slate-900/10 w-[76%]" />
            </div>
          </div>

          <div className="mt-5">
            <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-slate-400">
              Experience
            </p>
            <div className="mt-2 space-y-2.5">
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-sans text-[11px] font-medium text-slate-800">
                    Stripe · Staff Engineer
                  </p>
                  <p className="font-sans text-[10px] text-slate-400">2022 — Now</p>
                </div>
                <div className="mt-1.5 space-y-1">
                  <div className="h-[5px] rounded-full bg-slate-900/10 w-[88%]" />
                  <div className="h-[5px] rounded-full bg-slate-900/10 w-[72%]" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-sans text-[11px] font-medium text-slate-800">
                    Linear · Senior Engineer
                  </p>
                  <p className="font-sans text-[10px] text-slate-400">2019 — 2022</p>
                </div>
                <div className="mt-1.5 space-y-1">
                  <div className="h-[5px] rounded-full bg-slate-900/10 w-[80%]" />
                  <div className="h-[5px] rounded-full bg-slate-900/10 w-[64%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-slate-400">
              Skills
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SKILL_CHIPS.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-full bg-slate-900/5 text-[9px] font-sans text-slate-700 border border-slate-900/10"
                >
                  {s}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-full text-[9px] font-sans text-slate-900 border border-[#C7FF00] bg-[rgba(199,255,0,0.25)]">
                + AI suggestions
              </span>
            </div>
          </div>
        </div>

        {/* Right-edge tear line that intensifies with peel */}
        <motion.svg
          aria-hidden="true"
          className="absolute -right-[2px] top-0 h-full w-[12px] pointer-events-none"
          style={{ opacity: tearOpacity }}
          viewBox="0 0 12 400"
          preserveAspectRatio="none"
        >
          <path
            d="M2,0 L7,12 L3,28 L8,46 L4,64 L9,84 L4,104 L8,126 L3,148 L8,170 L4,192 L9,214 L4,236 L8,258 L3,280 L8,302 L4,324 L9,346 L4,368 L8,388 L6,400"
            stroke="rgba(15,23,42,0.3)"
            strokeWidth="1"
            fill="none"
          />
        </motion.svg>

        {/* Edge highlight — glassy border reflection */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[22px]"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(15,23,42,0.05)",
          }}
        />
      </motion.div>

      {/* ── Drag hint chip — disappears as the user begins peeling ── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-3 z-40 pointer-events-none"
        style={{ opacity: hintOpacity }}
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/75 backdrop-blur-md text-white/90 text-[11px] font-sans">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
          {reduced ? "Interactive preview" : "Drag to peel"}
        </span>
      </motion.div>

      {/* Soft reflective floor */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-[70%] h-[40px] rounded-[50%] blur-2xl opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0) 70%)",
        }}
      />
    </div>
  );
}
