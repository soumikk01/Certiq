/**
 * Section 14 — Footer
 *
 * contentinfo landmark with logo, link columns, social icons, copyright.
 *
 * Requirements: 17.1–17.6, 20.9
 */

import { FOOTER_DATA } from "@/data/footer";
import { Logo } from "@certiq/ui";

const SOCIAL_ICONS: Record<string, string> = {
  twitter: "𝕏",
  linkedin: "in",
  github: "⌨",
  discord: "💬",
};

export function Footer(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-bg-2 border-t border-border-card"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo + tagline */}
          <div className="lg:col-span-2">
            <a href="#" aria-label="Certiq home" className="inline-block focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded">
              <Logo size={32} />
            </a>
            <p className="text-text-muted font-sans text-sm mt-3 max-w-xs">
              Resumes worth opening. Cinematic templates, AI-assisted writing, and verifiable credentials in one quiet workspace.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_DATA.linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-text-headline font-sans text-sm font-semibold mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-text-muted font-sans text-sm hover:text-text-headline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted font-sans text-xs">
            © {year} Certiq. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {FOOTER_DATA.socialChannels.map((channel) => (
              <a
                key={channel.name}
                href={channel.href}
                aria-label={channel.name}
                className="w-9 h-9 rounded-full border border-border-card bg-surface-card-1 flex items-center justify-center text-text-muted hover:text-text-headline hover:border-accent/30 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                <span className="text-xs font-sans font-bold" aria-hidden="true">
                  {SOCIAL_ICONS[channel.icon] ?? "•"}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
