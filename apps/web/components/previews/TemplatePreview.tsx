"use client";

/**
 * TemplatePreview — code-generated resume template previews.
 *
 * Each template style renders a unique miniature resume layout using
 * pure SVG + HTML/CSS. No external images needed.
 */

interface TemplatePreviewProps {
  templateId: string;
  className?: string;
}

export function TemplatePreview({ templateId, className = "" }: TemplatePreviewProps): JSX.Element {
  switch (templateId) {
    case "executive":
      return <ExecutivePreview className={className} />;
    case "minimal":
      return <MinimalPreview className={className} />;
    case "developer":
      return <DeveloperPreview className={className} />;
    case "student":
      return <StudentPreview className={className} />;
    case "creative":
      return <CreativePreview className={className} />;
    case "ats-professional":
      return <AtsProfessionalPreview className={className} />;
    default:
      return <MinimalPreview className={className} />;
  }
}

function ExecutivePreview({ className }: { className: string }): JSX.Element {
  return (
    <div className={`w-full h-full bg-white rounded-lg overflow-hidden flex flex-col ${className}`}>
      {/* Header band */}
      <div className="bg-slate-900 px-4 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center">
          <span className="text-slate-900 font-serif text-sm font-bold">AJ</span>
        </div>
        <div className="flex-1">
          <div className="h-2.5 w-24 rounded-full bg-white/90" />
          <div className="h-1.5 w-16 rounded-full bg-white/40 mt-1.5" />
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 px-4 py-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <div className="h-1.5 w-12 rounded-full bg-slate-900/60" />
            <div className="h-1 w-full rounded-full bg-slate-200" />
            <div className="h-1 w-[90%] rounded-full bg-slate-200" />
            <div className="h-1 w-[75%] rounded-full bg-slate-200" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="h-1.5 w-12 rounded-full bg-slate-900/60" />
            <div className="h-1 w-full rounded-full bg-slate-200" />
            <div className="h-1 w-[85%] rounded-full bg-slate-200" />
            <div className="h-1 w-[70%] rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="border-t border-slate-100 pt-2 space-y-1.5">
          <div className="h-1.5 w-16 rounded-full bg-slate-900/60" />
          <div className="h-1 w-full rounded-full bg-slate-200" />
          <div className="h-1 w-[92%] rounded-full bg-slate-200" />
          <div className="h-1 w-[80%] rounded-full bg-slate-200" />
        </div>
        <div className="border-t border-slate-100 pt-2 space-y-1.5">
          <div className="h-1.5 w-10 rounded-full bg-slate-900/60" />
          <div className="flex flex-wrap gap-1">
            <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-[6px] text-amber-800">Leadership</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-[6px] text-amber-800">Strategy</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-[6px] text-amber-800">P&L</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalPreview({ className }: { className: string }): JSX.Element {
  return (
    <div className={`w-full h-full bg-white rounded-lg overflow-hidden flex flex-col px-5 py-5 ${className}`}>
      {/* Name */}
      <div className="h-3 w-28 rounded-full bg-slate-900 mb-1" />
      <div className="h-1.5 w-20 rounded-full bg-slate-400 mb-4" />
      {/* Thin separator */}
      <div className="h-px w-full bg-slate-200 mb-4" />
      {/* Content blocks */}
      <div className="space-y-3 flex-1">
        <div className="space-y-1">
          <div className="h-1.5 w-14 rounded-full bg-slate-600" />
          <div className="h-1 w-full rounded-full bg-slate-150" style={{ background: "#f1f5f9" }} />
          <div className="h-1 w-[88%] rounded-full" style={{ background: "#f1f5f9" }} />
          <div className="h-1 w-[72%] rounded-full" style={{ background: "#f1f5f9" }} />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-16 rounded-full bg-slate-600" />
          <div className="h-1 w-full rounded-full" style={{ background: "#f1f5f9" }} />
          <div className="h-1 w-[80%] rounded-full" style={{ background: "#f1f5f9" }} />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-12 rounded-full bg-slate-600" />
          <div className="h-1 w-full rounded-full" style={{ background: "#f1f5f9" }} />
          <div className="h-1 w-[65%] rounded-full" style={{ background: "#f1f5f9" }} />
        </div>
      </div>
    </div>
  );
}

function DeveloperPreview({ className }: { className: string }): JSX.Element {
  return (
    <div className={`w-full h-full bg-[#1e1e2e] rounded-lg overflow-hidden flex ${className}`}>
      {/* Sidebar */}
      <div className="w-[35%] bg-[#181825] px-3 py-4 space-y-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center">
          <span className="text-emerald-400 text-[8px] font-mono">&gt;_</span>
        </div>
        <div className="space-y-1.5">
          <div className="h-1 w-full rounded-full bg-white/20" />
          <div className="h-1 w-[80%] rounded-full bg-white/20" />
          <div className="h-1 w-[60%] rounded-full bg-white/20" />
        </div>
        <div className="space-y-1">
          <div className="h-1 w-10 rounded-full bg-emerald-400/50" />
          <div className="flex flex-wrap gap-0.5">
            <span className="px-1 py-0.5 rounded text-[5px] bg-emerald-500/20 text-emerald-300">TS</span>
            <span className="px-1 py-0.5 rounded text-[5px] bg-blue-500/20 text-blue-300">Go</span>
            <span className="px-1 py-0.5 rounded text-[5px] bg-yellow-500/20 text-yellow-300">Py</span>
          </div>
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 px-3 py-4 space-y-2.5">
        <div className="h-2 w-20 rounded-full bg-white/80" />
        <div className="h-1 w-14 rounded-full bg-white/30" />
        <div className="mt-3 space-y-1.5">
          <div className="h-1 w-full rounded-full bg-white/15" />
          <div className="h-1 w-[90%] rounded-full bg-white/15" />
          <div className="h-1 w-[75%] rounded-full bg-white/15" />
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="h-1 w-12 rounded-full bg-emerald-400/60" />
          <div className="h-1 w-full rounded-full bg-white/15" />
          <div className="h-1 w-[85%] rounded-full bg-white/15" />
        </div>
        <div className="mt-2 p-1.5 rounded bg-white/5 border border-white/10">
          <div className="h-1 w-full rounded-full bg-emerald-400/30" />
          <div className="h-1 w-[70%] rounded-full bg-emerald-400/30 mt-1" />
        </div>
      </div>
    </div>
  );
}

function StudentPreview({ className }: { className: string }): JSX.Element {
  return (
    <div className={`w-full h-full bg-white rounded-lg overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="bg-blue-50 px-4 py-4 border-b border-blue-100">
        <div className="h-2.5 w-24 rounded-full bg-blue-900/80" />
        <div className="h-1.5 w-32 rounded-full bg-blue-600/40 mt-1.5" />
      </div>
      {/* Body */}
      <div className="flex-1 px-4 py-3 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div className="h-1.5 w-14 rounded-full bg-slate-700" />
          </div>
          <div className="ml-3.5 space-y-1">
            <div className="h-1 w-full rounded-full bg-slate-200" />
            <div className="h-1 w-[85%] rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div className="h-1.5 w-12 rounded-full bg-slate-700" />
          </div>
          <div className="ml-3.5 space-y-1">
            <div className="h-1 w-full rounded-full bg-slate-200" />
            <div className="h-1 w-[70%] rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div className="h-1.5 w-16 rounded-full bg-slate-700" />
          </div>
          <div className="ml-3.5 space-y-1">
            <div className="h-1 w-[90%] rounded-full bg-slate-200" />
            <div className="h-1 w-[60%] rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="px-4 py-2 border-t border-blue-50 flex gap-1">
        <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-[5px] text-blue-700">GPA 3.9</span>
        <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-[5px] text-blue-700">Dean&apos;s List</span>
      </div>
    </div>
  );
}

function CreativePreview({ className }: { className: string }): JSX.Element {
  return (
    <div className={`w-full h-full rounded-lg overflow-hidden flex flex-col ${className}`} style={{ background: "linear-gradient(135deg, #fdf4ff 0%, #faf5ff 50%, #f5f3ff 100%)" }}>
      {/* Decorative header */}
      <div className="relative px-4 py-5">
        <div className="absolute top-2 right-3 w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 opacity-40" />
        <div className="absolute top-6 right-8 w-6 h-6 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 opacity-50" />
        <div className="h-3 w-20 rounded-full bg-purple-900/80" />
        <div className="h-1.5 w-28 rounded-full bg-purple-600/40 mt-1.5" />
      </div>
      {/* Body */}
      <div className="flex-1 px-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-white/60 border border-purple-200/50 space-y-1">
            <div className="h-1 w-8 rounded-full bg-purple-600/50" />
            <div className="h-0.5 w-full rounded-full bg-purple-200" />
            <div className="h-0.5 w-[70%] rounded-full bg-purple-200" />
          </div>
          <div className="p-2 rounded-lg bg-white/60 border border-purple-200/50 space-y-1">
            <div className="h-1 w-8 rounded-full bg-pink-600/50" />
            <div className="h-0.5 w-full rounded-full bg-pink-200" />
            <div className="h-0.5 w-[80%] rounded-full bg-pink-200" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-1 w-full rounded-full bg-purple-200/60" />
          <div className="h-1 w-[88%] rounded-full bg-purple-200/60" />
          <div className="h-1 w-[72%] rounded-full bg-purple-200/60" />
        </div>
      </div>
      {/* Footer accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400" />
    </div>
  );
}

function AtsProfessionalPreview({ className }: { className: string }): JSX.Element {
  return (
    <div className={`w-full h-full bg-white rounded-lg overflow-hidden flex flex-col px-4 py-4 ${className}`}>
      {/* Clean header */}
      <div className="border-b-2 border-slate-900 pb-2 mb-3">
        <div className="h-3 w-28 rounded-sm bg-slate-900" />
        <div className="flex gap-3 mt-1.5">
          <div className="h-1 w-16 rounded-full bg-slate-400" />
          <div className="h-1 w-12 rounded-full bg-slate-400" />
          <div className="h-1 w-14 rounded-full bg-slate-400" />
        </div>
      </div>
      {/* Sections */}
      <div className="space-y-2.5 flex-1">
        <div className="space-y-1">
          <div className="h-1.5 w-16 rounded-sm bg-slate-900 uppercase" />
          <div className="h-1 w-full rounded-full bg-slate-200" />
          <div className="h-1 w-[95%] rounded-full bg-slate-200" />
          <div className="h-1 w-[82%] rounded-full bg-slate-200" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-14 rounded-sm bg-slate-900" />
          <div className="h-1 w-full rounded-full bg-slate-200" />
          <div className="h-1 w-[88%] rounded-full bg-slate-200" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-10 rounded-sm bg-slate-900" />
          <div className="flex flex-wrap gap-1">
            <span className="px-1 py-0.5 rounded text-[5px] bg-slate-100 text-slate-700 border border-slate-200">React</span>
            <span className="px-1 py-0.5 rounded text-[5px] bg-slate-100 text-slate-700 border border-slate-200">Node</span>
            <span className="px-1 py-0.5 rounded text-[5px] bg-slate-100 text-slate-700 border border-slate-200">AWS</span>
            <span className="px-1 py-0.5 rounded text-[5px] bg-slate-100 text-slate-700 border border-slate-200">SQL</span>
          </div>
        </div>
      </div>
      {/* ATS score indicator */}
      <div className="mt-2 flex items-center gap-2 pt-2 border-t border-slate-100">
        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
          <span className="text-[5px] font-bold text-emerald-600">98</span>
        </div>
        <span className="text-[6px] text-slate-500">ATS Score</span>
      </div>
    </div>
  );
}
