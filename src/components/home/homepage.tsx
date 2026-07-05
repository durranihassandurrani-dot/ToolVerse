'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles, Shield, Zap, Globe, Smartphone, Star, TrendingUp, Clock, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app-store';
import { tools, categories, getPopularTools, getTrendingTools, getLatestTools, searchTools, testimonials, faqs } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const benefits = [
  { icon: Zap, title: 'Lightning Fast', desc: 'All tools process instantly in your browser. No waiting, no server processing.' },
  { icon: Shield, title: '100% Private', desc: 'Your data never leaves your device. Everything runs locally in the browser.' },
  { icon: Globe, title: 'No Sign-up', desc: 'Use any tool instantly. No account, no email, no barriers.' },
  { icon: Smartphone, title: 'Works Everywhere', desc: 'Fully responsive design works perfectly on phone, tablet, and desktop.' },
];

function ToolCard({ tool, index }: { tool: typeof tools[0]; index: number }) {
  const { navigate, favorites, toggleFavorite } = useAppStore();
  const isFav = favorites.includes(tool.id);

  return (
    <motion.div variants={item}>
      <Card className="group cursor-pointer hover-lift tool-card-gradient border-border/50 overflow-hidden" onClick={() => navigate('tool', tool)}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center text-lg">
              {getCategoryEmoji(tool.categorySlug)}
            </div>
            <div className="flex items-center gap-1">
              {tool.trending && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"><TrendingUp className="w-2.5 h-2.5 mr-0.5" />Trending</Badge>}
              {tool.latest && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">New</Badge>}
            </div>
          </div>
          <h3 className="font-semibold text-sm mb-1.5 group-hover:text-primary transition-colors">{tool.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
            <span className="text-[11px] text-muted-foreground">{tool.category}</span>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(tool.id); }}
              className="text-muted-foreground hover:text-amber-500 transition-colors"
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 transition-all ${isFav ? 'text-amber-500 fill-amber-500' : ''}`} />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getCategoryEmoji(slug: string): string {
  const map: Record<string, string> = {
    calculators: '🧮', converters: '🔄', 'text-tools': '📝',
    generators: '✨', developer: '💻', 'image-tools': '🖼️',
    'pdf-tools': '📄', 'color-tools': '🎨',
  };
  return map[slug] || '🔧';
}

export function HomePage() {
  const { navigate, searchQuery, setSearchQuery, setIsSearchOpen } = useAppStore();
  const [heroSearch, setHeroSearch] = useState('');

  const popular = useMemo(() => getPopularTools(), []);
  const trending = useMemo(() => getTrendingTools(), []);
  const latest = useMemo(() => getLatestTools(), []);

  const handleToolNav = (tool: typeof tools[0]) => navigate('tool', tool);
  const handleCategoryNav = (slug: string) => navigate('category-detail', null, undefined, slug);

  const handleSearch = (query: string) => {
    setHeroSearch(query);
    if (query.trim()) {
      setSearchQuery(query);
      setIsSearchOpen(true);
      navigate('search');
    }
  };

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> 100+ Free Online Tools
            </Badge>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            All the tools you need,{' '}
            <span className="gradient-text">in one place</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Free online tools for calculations, conversions, code formatting, image editing, and more. No sign-up required. Works instantly in your browser.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(heroSearch)}
              placeholder="Search for a tool... (e.g. PDF, password, color)"
              className="pl-12 pr-28 h-13 text-base rounded-2xl bg-card border-border/50 shadow-lg shadow-black/5"
            />
            <Button onClick={() => handleSearch(heroSearch)} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl h-10 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25">
              Search
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mt-6">
            {['Password Generator', 'QR Code', 'JSON Formatter', 'BMI Calculator', 'Image Compressor'].map(term => (
              <button key={term} onClick={() => handleSearch(term)}
                className="px-3 py-1.5 text-xs rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                {term}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Tools */}
      {popular.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Popular Tools</h2>
                <p className="text-muted-foreground mt-1">Most used tools by our community</p>
              </div>
              <Button variant="ghost" onClick={() => navigate('all-tools')} className="hidden sm:flex">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {popular.slice(0, 8).map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
            </motion.div>
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" onClick={() => navigate('all-tools')}>View All Tools</Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Browse by Category</h2>
            <p className="text-muted-foreground">Find the perfect tool for your needs</p>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} variants={item}>
                <Card className="group cursor-pointer hover-lift overflow-hidden border-border/50" onClick={() => navigate('category-detail', null, undefined, cat.slug)}>
                  <CardContent className={`p-5 bg-gradient-to-br ${cat.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl mb-4">
                        {getCategoryEmoji(cat.slug)}
                      </div>
                      <h3 className="font-bold text-white text-lg mb-1">{cat.name}</h3>
                      <p className="text-white/80 text-sm">{cat.toolCount} tools</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending & Latest */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h2 className="text-2xl font-bold">Trending Now</h2>
              </div>
              <div className="space-y-3">
                {trending.length > 0 ? trending.map((tool, i) => (
                    <Card key={tool.id} className="group cursor-pointer hover-lift border-border/50" onClick={() => handleToolNav(tool)}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <span className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-sm flex items-center justify-center shrink-0">#{i + 1}</span>
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center text-lg shrink-0">{getCategoryEmoji(tool.categorySlug)}</div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">{tool.name}</p>
                          <p className="text-xs text-muted-foreground">{tool.category}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardContent>
                    </Card>
                )) : <p className="text-muted-foreground text-sm">Check back soon for trending tools!</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-emerald-500" />
                <h2 className="text-2xl font-bold">Recently Added</h2>
              </div>
              <div className="space-y-3">
                {latest.length > 0 ? latest.map((tool) => (
                    <Card key={tool.id} className="group cursor-pointer hover-lift border-border/50" onClick={() => handleToolNav(tool)}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] px-1.5 h-5 shrink-0">New</Badge>
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center text-lg shrink-0">{getCategoryEmoji(tool.categorySlug)}</div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">{tool.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardContent>
                    </Card>
                )) : <p className="text-muted-foreground text-sm">New tools are added regularly!</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Why Choose ToolVerse?</h2>
            <p className="text-muted-foreground">Built with performance, privacy, and simplicity in mind</p>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={i} variants={item}>
                <Card className="h-full text-center border-border/50 hover-lift">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                      <b.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, value: '100+', label: 'Free Tools' },
              { icon: Users, value: '50K+', label: 'Monthly Users' },
              { icon: Globe, value: '190+', label: 'Countries' },
              { icon: Star, value: '4.9/5', label: 'User Rating' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-muted/30">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1 gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about ToolVerse</p>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map(faq => (
              <AccordionItem key={faq.id} value={faq.id} className="bg-card rounded-xl border border-border/50 px-5 data-[state=open]:shadow-md transition-shadow">
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Loved by Thousands</h2>
            <p className="text-muted-foreground">See what our users are saying</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t, i) => (
              <Card key={t.id} className="border-border/50 hover-lift">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Stay in the Loop</h2>
          <p className="text-muted-foreground mb-8">Get notified when we add new tools. No spam, unsubscribe anytime.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" className="rounded-xl h-11" id="newsletter-email" />
            <Button className="rounded-xl h-11 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 whitespace-nowrap">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">By subscribing, you agree to our Privacy Policy.</p>
        </div>
      </section>
    </div>
  );
}