'use client';

import { Zap, Github, Twitter, Linkedin, Youtube, Heart } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { categories } from '@/lib/data';

const footerLinks = {
  tools: categories.map(c => ({ label: c.name, page: 'category-detail' as const, slug: c.slug })),
  company: [
    { label: 'About Us', page: 'about' as const },
    { label: 'Contact', page: 'contact' as const },
    { label: 'Blog', page: 'blog' as const },
  ],
  legal: [
    { label: 'Privacy Policy', page: 'privacy' as const },
    { label: 'Terms of Service', page: 'terms' as const },
    { label: 'Disclaimer', page: 'disclaimer' as const },
  ],
};

const socials = [
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
];

export function Footer() {
  const { navigate } = useAppStore();

  return (
    <footer className="border-t border-border/50 bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ad Space */}
        <div className="py-4 text-center">
          <div className="inline-block px-6 py-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            Advertisement Space
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <button onClick={() => navigate('home')} className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Zap className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold">
                Tool<span className="gradient-text">Verse</span>
              </span>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              100+ free online tools for everyone. Fast, private, and works right in your browser.
            </p>
            <div className="flex gap-2">
              {socials.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Tool Categories */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Tool Categories</h3>
            <ul className="space-y-2.5">
              {footerLinks.tools.map(link => (
                <li key={link.slug}>
                  <button onClick={() => navigate('category-detail', null, undefined, link.slug)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map(link => (
                <li key={link.page}>
                  <button onClick={() => navigate(link.page)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map(link => (
                <li key={link.page}>
                  <button onClick={() => navigate(link.page)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ToolVerse. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for the internet
          </p>
        </div>
      </div>
    </footer>
  );
}