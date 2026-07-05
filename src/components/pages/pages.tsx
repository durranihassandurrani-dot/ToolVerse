'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Grid3X3, FolderOpen, Star, Clock, ArrowRight,
  Mail, MapPin, Phone, Send, CheckCircle2, BookOpen,
  Calendar, User, Tag, ChevronRight, Shield, FileText,
  AlertTriangle, Info, Zap, TrendingUp, BarChart3,
  Settings, Users, FileCode, PenSquare, Trash2, Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store/app-store';
import { tools, categories, blogPosts, searchTools, getToolsByCategory } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import type { Tool, PageSlug } from '@/types';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

function getCategoryEmoji(slug: string): string {
  const map: Record<string, string> = { calculators: '🧮', converters: '🔄', 'text-tools': '📝', generators: '✨', developer: '💻', 'image-tools': '🖼️', 'pdf-tools': '📄', 'color-tools': '🎨' };
  return map[slug] || '🔧';
}

/* ============ ALL TOOLS PAGE ============ */
export function AllToolsPage() {
  const { navigate, favorites, toggleFavorite, recentTools } = useAppStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const filtered = tools.filter(t => {
    if (showFavorites && !favorites.includes(t.id)) return false;
    if (filter !== 'all' && t.categorySlug !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.keywords.some(k => k.includes(q));
    }
    return true;
  });

  const recent = recentTools.slice(0, 8).map(id => tools.find(t => t.id === id)).filter(Boolean) as Tool[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">All Tools</h1>
          <p className="text-muted-foreground text-lg">Browse our complete collection of {tools.length}+ free online tools</p>
        </motion.div>

        {/* Search & Filter Bar */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter tools..." className="pl-10 rounded-xl h-11" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant={showFavorites ? 'default' : 'outline'} size="sm" onClick={() => setShowFavorites(!showFavorites)} className="rounded-xl">
              <Star className="w-4 h-4 mr-1.5" /> Favorites {favorites.length > 0 && `(${favorites.length})`}
            </Button>
            <Button variant={showFavorites ? 'outline' : 'default'} size="sm" onClick={() => setShowFavorites(false)} className="rounded-xl">
              <Grid3X3 className="w-4 h-4 mr-1.5" /> All
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>All Categories</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setFilter(c.slug)} className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${filter === c.slug ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {getCategoryEmoji(c.slug)} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Tools */}
      {recent.length > 0 && !showFavorites && !search && filter === 'all' && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-emerald-500" /> Recently Used</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recent.map(tool => (
              <Card key={tool.id} className="shrink-0 w-56 cursor-pointer hover-lift border-border/50" onClick={() => navigate('tool', tool)}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center text-lg shrink-0">{getCategoryEmoji(tool.categorySlug)}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">{tool.category}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tools Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((tool, i) => {
          const isFav = favorites.includes(tool.id);
          return (
            <motion.div key={tool.id} variants={item}>
              <Card className="group cursor-pointer hover-lift tool-card-gradient border-border/50 overflow-hidden" onClick={() => navigate('tool', tool)}>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center text-lg">{getCategoryEmoji(tool.categorySlug)}</div>
                    <div className="flex items-center gap-1">
                      {tool.trending && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"><TrendingUp className="w-2.5 h-2.5 mr-0.5" />Trending</Badge>}
                      {tool.latest && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">New</Badge>}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5 group-hover:text-primary transition-colors">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <span className="text-[11px] text-muted-foreground">{tool.category}</span>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(tool.id); }} className="text-muted-foreground hover:text-amber-500 transition-colors" aria-label="Toggle favorite">
                      <Star className={`w-4 h-4 ${isFav ? 'text-amber-500 fill-amber-500' : ''}`} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tools found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}

/* ============ CATEGORIES PAGE ============ */
export function CategoriesPage() {
  const { navigate } = useAppStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Tool Categories</h1>
        <p className="text-muted-foreground text-lg">Browse tools organized by category for easy discovery</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat, i) => {
          const catTools = getToolsByCategory(cat.slug);
          return (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="group cursor-pointer hover-lift overflow-hidden border-border/50 h-full" onClick={() => navigate('category-detail', null, undefined, cat.slug)}>
                <CardContent className={`p-6 bg-gradient-to-br ${cat.color} relative overflow-hidden h-full`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-5">{getCategoryEmoji(cat.slug)}</div>
                    <h2 className="text-xl font-bold text-white mb-2">{cat.name}</h2>
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">{cat.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 text-sm font-medium">{cat.toolCount} tools</span>
                      <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ============ CATEGORY DETAIL PAGE ============ */
export function CategoryDetailPage({ categorySlug }: { categorySlug: string }) {
  const { navigate, favorites, toggleFavorite } = useAppStore();
  const category = categories.find(c => c.slug === categorySlug);
  const categoryTools = category ? getToolsByCategory(categorySlug) : [];

  if (!category) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold mb-2">Category not found</h1><Button onClick={() => navigate('categories')}>Browse Categories</Button></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <button onClick={() => navigate('categories')} className="text-sm text-muted-foreground hover:text-primary mb-6 flex items-center gap-1 transition-colors">&larr; Back to Categories</button>

      <div className={`rounded-2xl bg-gradient-to-br ${category.color} p-8 sm:p-12 mb-10 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl mb-5">{getCategoryEmoji(category.slug)}</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{category.name}</h1>
          <p className="text-white/80 text-lg mb-2">{category.description}</p>
          <p className="text-white/60 text-sm">{categoryTools.length} tools available</p>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoryTools.map((tool) => {
          const isFav = favorites.includes(tool.id);
          return (
            <motion.div key={tool.id} variants={item}>
              <Card className="group cursor-pointer hover-lift tool-card-gradient border-border/50 overflow-hidden" onClick={() => navigate('tool', tool)}>
                <CardContent className="p-4 sm:p-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center text-lg mb-3">{getCategoryEmoji(tool.categorySlug)}</div>
                  <h3 className="font-semibold text-sm mb-1.5 group-hover:text-primary transition-colors">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <span className="text-[11px] text-muted-foreground">{tool.category}</span>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(tool.id); }} className="text-muted-foreground hover:text-amber-500 transition-colors">
                      <Star className={`w-4 h-4 ${isFav ? 'text-amber-500 fill-amber-500' : ''}`} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ============ ABOUT PAGE ============ */
export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">About ToolVerse</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">ToolVerse is a comprehensive collection of 100+ free online tools designed to make your digital life easier. Whether you are a developer, designer, student, or professional, we have the tools you need.</p>

          <h2 className="text-2xl font-bold pt-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">We believe powerful tools should be accessible to everyone. No paywalls, no sign-ups, no data collection. Just fast, reliable tools that work right in your browser. Our mission is to be the go-to destination for anyone who needs to calculate, convert, generate, format, or edit anything online.</p>

          <h2 className="text-2xl font-bold pt-4">Privacy First</h2>
          <p className="text-muted-foreground leading-relaxed">Every tool on ToolVerse processes data entirely in your browser. Your files, text, and calculations never leave your device. We do not store, track, or share any of your data. This is not just a feature — it is a fundamental principle of how we build software.</p>

          <h2 className="text-2xl font-bold pt-4">Built with Modern Technology</h2>
          <p className="text-muted-foreground leading-relaxed">ToolVerse is built with Next.js, React, TypeScript, and Tailwind CSS for the best possible performance and user experience. Our tools leverage modern browser APIs including the Canvas API, Web Workers, and File System Access API to deliver desktop-class functionality in your browser.</p>

          <div className="grid sm:grid-cols-3 gap-6 py-8">
            {[
              { value: '100+', label: 'Free Tools' },
              { value: '50K+', label: 'Monthly Users' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-muted/30">
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold pt-4">Open to Feedback</h2>
          <p className="text-muted-foreground leading-relaxed">We are constantly improving and adding new tools based on user feedback. If you have a tool suggestion, find a bug, or just want to say hello, we would love to hear from you. Visit our Contact page to get in touch with our team.</p>
        </div>
      </motion.div>
    </div>
  );
}

/* ============ CONTACT PAGE ============ */
export function ContactPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      toast({ title: 'Message sent!', description: 'Thank you for contacting us. We will get back to you soon.' });
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Thank You!</h1>
          <p className="text-muted-foreground mb-8">Your message has been sent successfully. We typically respond within 24 hours.</p>
          <Button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>Send Another Message</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-muted-foreground text-lg mb-10">Have a question, suggestion, or feedback? We would love to hear from you.</p>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="rounded-xl" />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="rounded-xl" />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What is this about?" className="rounded-xl" />
                    {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." rows={6} className="rounded-xl resize-none" />
                    {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25">
                    <Send className="w-4 h-4 mr-2" /> Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" /><div><p className="font-medium text-sm">Email</p><p className="text-sm text-muted-foreground">hello@toolverse.app</p></div></div>
                <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" /><div><p className="font-medium text-sm">Location</p><p className="text-sm text-muted-foreground">San Francisco, CA</p></div></div>
                <div className="flex items-start gap-3"><Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" /><div><p className="font-medium text-sm">Response Time</p><p className="text-sm text-muted-foreground">Within 24 hours</p></div></div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Quick Help</h3>
                <p className="text-sm text-muted-foreground">Check our FAQ section for instant answers to common questions about ToolVerse.</p>
                <Button variant="link" className="px-0 mt-2 text-primary">Visit FAQ &rarr;</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ============ BLOG PAGE ============ */
export function BlogPage() {
  const { navigate } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPosts = selectedCategory === 'all' ? blogPosts : blogPosts.filter(p => p.category === selectedCategory);
  const blogCategories = ['all', ...new Set(blogPosts.map(p => p.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Blog</h1>
        <p className="text-muted-foreground text-lg">Tips, guides, and insights about tools and productivity</p>
      </motion.div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {blogCategories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {cat === 'all' ? 'All Posts' : cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="group cursor-pointer hover-lift border-border/50 h-full overflow-hidden" onClick={() => navigate('blog-post', null, post.slug)}>
              <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-primary/30" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-[11px]">{post.category}</Badge>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} min read</span>
                </div>
                <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">{post.author.split(' ').map(n => n[0]).join('')}</div>
                  <span className="text-sm text-muted-foreground">{post.author}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============ BLOG POST PAGE ============ */
export function BlogPostPage({ slug }: { slug: string }) {
  const { navigate } = useAppStore();
  const post = blogPosts.find(p => p.slug === slug);
  const relatedPosts = blogPosts.filter(p => p.slug !== slug).slice(0, 2);

  if (!post) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold mb-2">Post not found</h1><Button onClick={() => navigate('blog')}>Back to Blog</Button></div>;
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <button onClick={() => navigate('blog')} className="text-sm text-muted-foreground hover:text-primary mb-8 flex items-center gap-1 transition-colors">&larr; Back to Blog</button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
          <Badge variant="secondary">{post.category}</Badge>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{post.author}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime} min read</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">{post.title}</h1>

        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">{post.author.split(' ').map(n => n[0]).join('')}</div>
          <div><p className="font-medium text-sm">{post.author}</p><p className="text-xs text-muted-foreground">ToolVerse Team</p></div>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {post.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold pt-6 pb-3">{paragraph.replace('## ', '')}</h2>;
            if (paragraph.startsWith('### ')) return <h3 key={i} className="text-xl font-bold pt-4 pb-2">{paragraph.replace('### ', '')}</h3>;
            if (paragraph.startsWith('- ')) return <ul key={i} className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">{paragraph.split('\n').map((li, j) => <li key={j}>{li.replace('- ', '')}</li>)}</ul>;
            if (paragraph.match(/^\d+\./)) return <ol key={i} className="list-decimal pl-6 space-y-2 text-muted-foreground leading-relaxed">{paragraph.split('\n').map((li, j) => <li key={j}>{li.replace(/^\d+\.\s*/, '')}</li>)}</ol>;
            return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p>;
          })}
        </div>

        <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-border/50">
          {post.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs"><Tag className="w-3 h-3 mr-1" />{tag}</Badge>
          ))}
        </div>
      </motion.div>

      {relatedPosts.length > 0 && (
        <div className="mt-16 pt-8 border-t border-border/50">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedPosts.map(rp => (
              <Card key={rp.id} className="group cursor-pointer hover-lift border-border/50" onClick={() => navigate('blog-post', null, rp.slug)}>
                <CardContent className="p-5">
                  <Badge variant="secondary" className="text-[11px] mb-3">{rp.category}</Badge>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors mb-1">{rp.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{rp.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

/* ============ SEARCH RESULTS PAGE ============ */
export function SearchResultsPage() {
  const { navigate, searchQuery } = useAppStore();
  const results = searchTools(searchQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">Search Results</h1>
      <p className="text-muted-foreground mb-8">
        {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
      </p>

      {results.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((tool, i) => (
            <motion.div key={tool.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="group cursor-pointer hover-lift tool-card-gradient border-border/50 overflow-hidden" onClick={() => navigate('tool', tool)}>
                <CardContent className="p-4 sm:p-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center text-lg mb-3">{getCategoryEmoji(tool.categorySlug)}</div>
                  <h3 className="font-semibold text-sm mb-1.5 group-hover:text-primary transition-colors">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-6">Try searching with different keywords</p>
          <Button onClick={() => navigate('home')}>Back to Home</Button>
        </div>
      )}
    </div>
  );
}

/* ============ STATIC PAGES ============ */
export function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: July 2026</p>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section><h2 className="text-xl font-bold text-foreground mb-3">1. Information We Collect</h2><p>ToolVerse does not collect, store, or process any personal data from users. All tool processing happens entirely within your browser. We do not use cookies for tracking purposes. The only data stored locally is your tool preferences (favorites and recently used tools), which are saved in your browser&apos;s local storage and never transmitted to our servers.</p></section>
          <section><h2 className="text-xl font-bold text-foreground mb-3">2. Data Processing</h2><p>Every tool on ToolVerse processes data client-side. When you use our calculators, converters, formatters, or any other tool, the data you input remains on your device. No files, text, images, or calculations are uploaded to any server. This is a fundamental design principle of our platform.</p></section>
          <section><h2 className="text-xl font-bold text-foreground mb-3">3. Third-Party Services</h2><p>We may use Google Analytics and Google AdSense to analyze website usage and display relevant advertisements. These services may collect anonymized usage data through cookies. You can opt out of personalized advertising through Google&apos;s Ad Settings. We do not sell, trade, or otherwise transfer your personal information to third parties.</p></section>
          <section><h2 className="text-xl font-bold text-foreground mb-3">4. Contact</h2><p>If you have questions about this Privacy Policy, please contact us through our Contact page. We are committed to transparency and are happy to address any concerns you may have about how ToolVerse handles data.</p></section>
        </div>
      </motion.div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: July 2026</p>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section><h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2><p>By accessing and using ToolVerse, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all visitors, users, and others who access or use ToolVerse.</p></section>
          <section><h2 className="text-xl font-bold text-foreground mb-3">2. Use of Services</h2><p>ToolVerse provides free online tools for personal and commercial use. You may use our tools for any lawful purpose. You agree not to misuse our services, attempt to gain unauthorized access to our systems, or use automated tools to scrape or collect data from our platform.</p></section>
          <section><h2 className="text-xl font-bold text-foreground mb-3">3. Intellectual Property</h2><p>All content, design, and code on ToolVerse is the property of ToolVerse and is protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works from our content without prior written permission.</p></section>
          <section><h2 className="text-xl font-bold text-foreground mb-3">4. Disclaimer of Warranties</h2><p>ToolVerse is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of any tool results. Use our tools at your own discretion and verify important calculations independently.</p></section>
          <section><h2 className="text-xl font-bold text-foreground mb-3">5. Changes to Terms</h2><p>We reserve the right to modify these terms at any time. Continued use of ToolVerse after changes constitutes acceptance of the new terms. We encourage you to review this page periodically for updates.</p></section>
        </div>
      </motion.div>
    </div>
  );
}

export function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Disclaimer</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: July 2026</p>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section><h2 className="text-xl font-bold text-foreground mb-3">General Disclaimer</h2><p>The tools and information provided on ToolVerse are for general informational and utility purposes only. While we strive for accuracy in all our tools, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the tools or the information, products, services, or related graphics contained on the website.</p></section>
          <section><h2 className="text-xl font-bold text-foreground mb-3">Not Professional Advice</h2><p>The results provided by our calculators (including but not limited to BMI, loan EMI, and other financial calculators) should not be considered as professional financial, medical, legal, or any other form of professional advice. Always consult qualified professionals for important decisions related to health, finance, and legal matters.</p></section>
          <section><h2 className="text-xl font-bold text-foreground mb-3">External Links</h2><p>ToolVerse may contain links to external websites. We do not have control over the content and nature of these sites and are not responsible for their content or privacy practices. The inclusion of any links does not necessarily imply a recommendation or endorsement of the views expressed within them.</p></section>
          <section><h2 className="text-xl font-bold text-foreground mb-3">Limitation of Liability</h2><p>In no event shall ToolVerse be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website and its tools.</p></section>
        </div>
      </motion.div>
    </div>
  );
}

/* ============ 404 PAGE ============ */
export function NotFoundPage() {
  const { navigate } = useAppStore();
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">The page you are looking for does not exist or has been moved. Let us help you find what you need.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate('home')} className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">Go Home</Button>
          <Button variant="outline" onClick={() => navigate('all-tools')} className="rounded-xl">Browse Tools</Button>
        </div>
      </motion.div>
    </div>
  );
}

/* ============ ADMIN PAGE ============ */
export function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const stats = [
    { label: 'Total Tools', value: tools.length, icon: FileCode, color: 'text-emerald-500' },
    { label: 'Categories', value: categories.length, icon: FolderOpen, color: 'text-cyan-500' },
    { label: 'Blog Posts', value: blogPosts.length, icon: PenSquare, color: 'text-orange-500' },
    { label: 'Total Users (est.)', value: '50,234', icon: Users, color: 'text-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your ToolVerse website</p>
        </div>
        <Badge variant="outline" className="text-xs"><Settings className="w-3 h-3 mr-1" /> Admin</Badge>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center ${s.color}`}><s.icon className="w-6 h-6" /></div>
              <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-lg">Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['New tool: PDF Compressor added', 'Blog post: "PDF Optimization Guide" published', 'SEO meta tags updated for all tools', 'Category "Color Tools" description updated', 'Server performance optimized'].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <p className="text-sm flex-1">{activity}</p>
                    <span className="text-xs text-muted-foreground">{i + 1}d ago</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-lg">Manage Tools ({tools.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {tools.slice(0, 15).map(tool => (
                  <div key={tool.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-lg">{getCategoryEmoji(tool.categorySlug)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.category}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-lg">Manage Blog Posts ({blogPosts.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {blogPosts.map(post => (
                  <div key={post.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <BookOpen className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{post.category} &middot; {post.date}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-lg">SEO Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Site Title</Label>
                <Input defaultValue="ToolVerse — 100+ Free Online Tools for Everyone" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea defaultValue="Free online tools: calculators, converters, generators, formatters, image tools, PDF tools, and more. No sign-up required." rows={3} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input defaultValue="https://toolverse.app" className="rounded-xl" />
              </div>
              <Button className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white" onClick={() => toast({ title: 'SEO settings saved!' })}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}