'use client';

import { useState, useEffect, useRef, useCallback, useMemo, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Menu, X, Sun, Moon, Zap, ChevronDown,
  Star, Clock, Home, Grid3X3, FolderOpen, Info,
  Mail, BookOpen, Shield, FileText, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app-store';
import { searchTools, tools, categories } from '@/lib/data';
import type { Tool } from '@/types';

const navItems = [
  { label: 'Home', icon: Home, page: 'home' as const },
  { label: 'All Tools', icon: Grid3X3, page: 'all-tools' as const },
  { label: 'Categories', icon: FolderOpen, page: 'categories' as const },
  { label: 'Blog', icon: BookOpen, page: 'blog' as const },
  { label: 'About', icon: Info, page: 'about' as const },
  { label: 'Contact', icon: Mail, page: 'contact' as const },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { isMobileMenuOpen, isSearchOpen, setIsMobileMenuOpen, setIsSearchOpen, navigate, searchQuery, setSearchQuery, favorites, recentTools } = useAppStore();

  const searchResults = useMemo(() => {
    if (searchQuery.trim()) {
      return searchTools(searchQuery).slice(0, 8);
    }
    return recentTools.slice(0, 6).map(id => tools.find(t => t.id === id)).filter(Boolean) as Tool[];
  }, [searchQuery, recentTools]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setIsSearchOpen(false);
    }
  }, [setIsSearchOpen]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleToolClick = (tool: Tool) => {
    navigate('tool', tool);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/50' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => navigate('home')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Tool<span className="gradient-text">Verse</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                {item.label}
              </button>
            ))}
            <div className="relative group">
              <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 flex items-center gap-1">
                More <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 py-2 rounded-xl glass-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {[
                  { label: 'Privacy Policy', icon: Shield, page: 'privacy' as const },
                  { label: 'Terms of Service', icon: FileText, page: 'terms' as const },
                  { label: 'Disclaimer', icon: AlertTriangle, page: 'disclaimer' as const },
                ].map(item => (
                  <button key={item.page} onClick={() => navigate(item.page)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                    <item.icon className="w-4 h-4" /> {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="w-4.5 h-4.5" />
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="w-4.5 h-4.5" />
              </Button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] rounded-2xl glass-card p-4 shadow-2xl"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tools..."
                        className="pl-10 pr-4 h-10 rounded-xl bg-background border-border/50"
                        autoFocus
                      />
                    </div>

                    {searchQuery.trim() === '' && recentTools.length > 0 && (
                      <div className="mt-3 px-1">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> Recent Tools
                        </p>
                      </div>
                    )}

                    <div className="mt-2 max-h-72 overflow-y-auto space-y-1">
                      {searchResults.map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => handleToolClick(tool)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-sm">{getToolEmoji(tool.categorySlug)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{tool.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{tool.category}</p>
                          </div>
                          {favorites.includes(tool.id) && <Star className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-auto fill-amber-500" />}
                        </button>
                      ))}
                      {searchQuery.trim() && searchResults.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6">No tools found for &quot;{searchQuery}&quot;</p>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground px-1 mb-2">Popular Categories</p>
                      <div className="flex flex-wrap gap-1.5">
                        {categories.slice(0, 4).map(cat => (
                          <button key={cat.id} onClick={() => { navigate('category-detail', null, undefined, cat.slug); setIsSearchOpen(false); setSearchQuery(''); }}
                            className="px-2.5 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors">
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <Button variant="ghost" size="icon" onClick={() => navigate('all-tools')} className="hidden sm:flex relative">
                <Star className="w-4.5 h-4.5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              </Button>
            )}

            {/* Theme Toggle */}
            {mounted && (
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </Button>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navItems.map(item => (
                <button key={item.page} onClick={() => navigate(item.page)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors">
                  <item.icon className="w-4.5 h-4.5" /> {item.label}
                </button>
              ))}
              <div className="border-t border-border/50 pt-2 mt-2 space-y-1">
                <button onClick={() => navigate('privacy')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors">
                  <Shield className="w-4.5 h-4.5" /> Privacy Policy
                </button>
                <button onClick={() => navigate('terms')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors">
                  <FileText className="w-4.5 h-4.5" /> Terms of Service
                </button>
                <button onClick={() => navigate('disclaimer')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors">
                  <AlertTriangle className="w-4.5 h-4.5" /> Disclaimer
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function getToolEmoji(categorySlug: string): string {
  const map: Record<string, string> = {
    calculators: '🧮', converters: '🔄', 'text-tools': '📝',
    generators: '✨', developer: '💻', 'image-tools': '🖼️',
    'pdf-tools': '📄', 'color-tools': '🎨',
  };
  return map[categorySlug] || '🔧';
}