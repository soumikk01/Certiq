export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface SocialChannel {
  name: string;
  href: string;
  icon: string;
}

export interface FooterData {
  logoMark: string;
  linkGroups: FooterLinkGroup[];
  socialChannels: SocialChannel[];
}

export const FOOTER_DATA: FooterData = {
  logoMark: "Certiq",
  linkGroups: [
    {
      title: "Product",
      links: [
        { label: "Templates", href: "#templates" },
        { label: "Resume Builder", href: "#builder" },
        { label: "ATS Checker", href: "#ats" },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ],
  socialChannels: [
    { name: "Twitter", href: "https://twitter.com/certiq", icon: "twitter" },
    { name: "LinkedIn", href: "https://linkedin.com/company/certiq", icon: "linkedin" },
    { name: "GitHub", href: "https://github.com/certiq", icon: "github" },
    { name: "Discord", href: "https://discord.gg/certiq", icon: "discord" },
  ],
};
