'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '@/store/app-store';
import type { PageSlug, Tool } from '@/types';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HomePage } from '@/components/home/homepage';
import {
  AllToolsPage, CategoriesPage, CategoryDetailPage,
  AboutPage, ContactPage, BlogPage, BlogPostPage,
  SearchResultsPage, PrivacyPage, TermsPage,
  DisclaimerPage, NotFoundPage, AdminPage
} from '@/components/pages/pages';
import { getToolBySlug, getToolsByCategory } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Star, Share2, Printer, ArrowLeft, Home, ChevronRight, TrendingUp, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { AgeCalculator, BMICalculator, PercentageCalculator, LoanEMICalculator, GSTCalculator } from '@/components/tools/calculator-tools';
import { CurrencyConverter, LengthConverter, WeightConverter, TemperatureConverter, TimeConverter } from '@/components/tools/converter-tools';
import { WordCounter, CharacterCounter, CaseConverter } from '@/components/tools/text-tools';
import { PasswordGenerator, QRCodeGenerator, BarcodeGenerator, ColorPicker, ColorPaletteGenerator, UUIDGenerator, LoremIpsumGenerator } from '@/components/tools/generator-tools';
import { JsonFormatter, HtmlFormatter, CssMinifier, JsMinifier, Base64Encoder, Base64Decoder, UrlEncoder, UrlDecoder } from '@/components/tools/developer-tools';
import { ImageCompressor, ImageResizer, ImageCropper, BackgroundRemover } from '@/components/tools/image-tools';
import { PdfMerge, PdfSplit, PdfToText, WordToPdf, PdfCompressor } from '@/components/tools/pdf-tools';
import { HexToRgb, RgbToHex } from '@/components/tools/color-tools';

const toolComponentMap: Record<string, React.ComponentType> = {
  'age-calculator': AgeCalculator,
  'bmi-calculator': BMICalculator,
  'percentage-calculator': PercentageCalculator,
  'loan-emi-calculator': LoanEMICalculator,
  'gst-calculator': GSTCalculator,
  'currency-converter': CurrencyConverter,
  'length-converter': LengthConverter,
  'weight-converter': WeightConverter,
  'temperature-converter': TemperatureConverter,
  'time-converter': TimeConverter,
  'word-counter': WordCounter,
  'character-counter': CharacterCounter,
  'case-converter': CaseConverter,
  'password-generator': PasswordGenerator,
  'qr-code-generator': QRCodeGenerator,
  'barcode-generator': BarcodeGenerator,
  'color-picker': ColorPicker,
  'color-palette-generator': ColorPaletteGenerator,
  'uuid-generator': UUIDGenerator,
  'lorem-ipsum-generator': LoremIpsumGenerator,
  'json-formatter': JsonFormatter,
  'html-formatter': HtmlFormatter,
  'css-minifier': CssMinifier,
  'js-minifier': JsMinifier,
  'base64-encoder': Base64Encoder,
  'base64-decoder': Base64Decoder,
  'url-encoder': UrlEncoder,
  'url-decoder': UrlDecoder,
  'image-compressor': ImageCompressor,
  'image-resizer': ImageResizer,
  'image-cropper': ImageCropper,
  'background-remover': BackgroundRemover,
  'pdf-merge': PdfMerge,
  'pdf-split': PdfSplit,
  'pdf-to-word': PdfToText,
  'word-to-pdf': WordToPdf,
  'pdf-compressor': PdfCompressor,
  'hex-to-rgb': HexToRgb,
  'rgb-to-hex': RgbToHex,
};

function getCategoryEmoji(slug: string): string {
  const map: Record<string, string> = { calculators: '🧮', converters: '🔄', 'text-tools': '📝', generators: '✨', developer: '💻', 'image-tools': '🖼️', 'pdf-tools': '📄', 'color-tools': '🎨' };
  return map[slug] || '🔧';
}

function ToolPage() {
  const { currentTool, currentCategorySlug, navigate, favorites, toggleFavorite, searchQuery, setIsSearchOpen, setSearchQuery } = useAppStore();
  const { toast } = useToast();

  useEffect(() => {
    if (currentTool) {
      document.title = `${currentTool.name} — Free Online ${currentTool.category} | ToolVerse`;
    }
    return () => { document.title = 'ToolVerse — 100+ Free Online Tools for Everyone'; };
  }, [currentTool]);

  if (!currentTool) return <NotFoundPage />;

  const ToolComponent = toolComponentMap[currentTool.id];
  const isFav = favorites.includes(currentTool.id);

  const handleShare = async () => {
    const url = `${window.location.origin}/${currentTool.slug}`;
    if (navigator.share) {
      await navigator.share({ title: currentTool.name, text: currentTool.description, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied!', description: 'Tool URL has been copied to clipboard.' });
    }
  };

  const handlePrint = () => window.print();

  const handleToggleFavorite = () => {
    toggleFavorite(currentTool.id);
    toast({
      title: isFav ? 'Removed from favorites' : 'Added to favorites',
      description: isFav ? `${currentTool.name} removed from your favorites.` : `${currentTool.name} added to your favorites.`,
    });
  };

  if (!ToolComponent) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Tool coming soon</h1>
        <p className="text-muted-foreground mb-6">{currentTool.name} is currently being developed.</p>
        <Button onClick={() => navigate('home')}>Back to Home</Button>
      </div>
    );
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": currentTool.name,
    "url": `https://toolverse.app/${currentTool.slug}`,
    "description": currentTool.description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "isPartOf": {
      "@type": "WebApplication",
      "name": "ToolVerse",
      "url": "https://toolverse.app"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://toolverse.app" },
      { "@type": "ListItem", "position": 2, "name": currentTool.category, "item": `https://toolverse.app/category/${currentTool.categorySlug}` },
      { "@type": "ListItem", "position": 3, "name": currentTool.name, "item": `https://toolverse.app/${currentTool.slug}` }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer hover:text-primary transition-colors">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('category-detail', null, undefined, currentTool.categorySlug)} className="cursor-pointer hover:text-primary transition-colors">{currentTool.category}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{currentTool.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Ad Space - Top */}
      <div className="mb-6 py-3 text-center rounded-xl bg-muted/30">
        <span className="text-xs text-muted-foreground">Advertisement</span>
      </div>

      {/* Tool Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center text-3xl shrink-0">
            {getCategoryEmoji(currentTool.categorySlug)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold">{currentTool.name}</h1>
              {currentTool.trending && <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"><TrendingUp className="w-3 h-3 mr-1" />Trending</Badge>}
              {currentTool.latest && <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"><Clock className="w-3 h-3 mr-1" />New</Badge>}
            </div>
            <p className="text-muted-foreground">{currentTool.description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleToggleFavorite} className="rounded-xl">
            <Star className={`w-4 h-4 mr-1.5 ${isFav ? 'text-amber-500 fill-amber-500' : ''}`} />
            {isFav ? 'Favorited' : 'Favorite'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="rounded-xl">
            <Share2 className="w-4 h-4 mr-1.5" /> Share
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-xl">
            <Printer className="w-4 h-4 mr-1.5" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('category-detail', null, undefined, currentTool.categorySlug)} className="rounded-xl">
            <ChevronRight className="w-4 h-4 mr-1.5" /> More {currentTool.category}
          </Button>
        </div>
      </div>

      {/* Tool Content */}
      <Card className="border-border/50 mb-8">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <ToolComponent />
        </CardContent>
      </Card>

      {/* Ad Space - Bottom */}
      <div className="py-3 text-center rounded-xl bg-muted/30">
        <span className="text-xs text-muted-foreground">Advertisement</span>
      </div>

      {/* Related Tools */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Related Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(() => {
            const related = getToolsByCategory(currentTool.categorySlug).filter(t => t.id !== currentTool.id).slice(0, 3);
            return related.map(tool => (
              <Card key={tool.id} className="group cursor-pointer hover-lift tool-card-gradient border-border/50" onClick={() => navigate('tool', tool)}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center text-lg shrink-0">{getCategoryEmoji(tool.categorySlug)}</div>
                  <div className="min-w-0"><p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{tool.name}</p><p className="text-xs text-muted-foreground truncate">{tool.description}</p></div>
                </CardContent>
              </Card>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}

function Router() {
  const { currentPage, currentTool, currentBlogSlug, currentCategorySlug, searchQuery, navigate, setSearchQuery } = useAppStore();

  // Secret admin access via search
  useEffect(() => {
    if (searchQuery.toLowerCase().trim() === 'admin') {
      navigate('admin');
      setSearchQuery('');
    }
    }, [searchQuery]);

  switch (currentPage) {
    case 'home': return <HomePage />;
    case 'all-tools': return <AllToolsPage />;
    case 'categories': return <CategoriesPage />;
    case 'category-detail': return <CategoryDetailPage categorySlug={currentCategorySlug || ''} />;
    case 'about': return <AboutPage />;
    case 'contact': return <ContactPage />;
    case 'blog': return <BlogPage />;
    case 'blog-post': return <BlogPostPage slug={currentBlogSlug || ''} />;
    case 'search': return <SearchResultsPage />;
    case 'privacy': return <PrivacyPage />;
    case 'terms': return <TermsPage />;
    case 'disclaimer': return <DisclaimerPage />;
    case 'admin': return <AdminPage />;
    case 'tool': return <ToolPage />;
    default: return <NotFoundPage />;
  }
}

// --- URL <-> Zustand state synchronization ---

function getTargetUrl(page: PageSlug, tool?: Tool | null, blogSlug?: string | null, categorySlug?: string | null): string {
  switch (page) {
    case 'home': return '/';
    case 'all-tools': return '/tools';
    case 'categories': return '/categories';
    case 'category-detail': return `/category/${categorySlug || ''}`;
    case 'about': return '/about';
    case 'contact': return '/contact';
    case 'privacy': return '/privacy';
    case 'terms': return '/terms';
    case 'disclaimer': return '/disclaimer';
    case 'blog': return '/blog';
    case 'blog-post': return `/blog/${blogSlug || ''}`;
    case 'search': return '/search';
    case 'tool': return `/${tool?.slug || ''}`;
    default: return '/';
  }
}

function resolvePathToState(pathname: string) {
  const p = pathname.replace(/\/+$/, ''); // remove trailing slash
  if (p === '' || p === '/') return { page: 'home' as PageSlug, tool: null, blogSlug: null, categorySlug: null };

  // Static pages
  const staticMap: Record<string, PageSlug> = {
    'tools': 'all-tools', 'categories': 'categories', 'about': 'about',
    'contact': 'contact', 'privacy': 'privacy', 'terms': 'terms',
    'disclaimer': 'disclaimer', 'blog': 'blog', 'admin': 'admin', 'search': 'search',
  };
  if (staticMap[p]) return { page: staticMap[p], tool: null, blogSlug: null, categorySlug: null };

  // Category pages: /category/:slug
  const catMatch = p.match(/^\/category\/([\w-]+)$/);
  if (catMatch) return { page: 'category-detail' as PageSlug, tool: null, blogSlug: null, categorySlug: catMatch[1] };

  // Blog post pages: /blog/:slug
  const blogMatch = p.match(/^\/blog\/([\w-]+)$/);
  if (blogMatch) return { page: 'blog-post' as PageSlug, tool: null, blogSlug: blogMatch[1], categorySlug: null };

  // Tool pages: /:slug (top-level)
  const tool = getToolBySlug(p.replace(/^\//, ''));
  if (tool) return { page: 'tool' as PageSlug, tool, blogSlug: null, categorySlug: null };

  return { page: 'home' as PageSlug, tool: null, blogSlug: null, categorySlug: null };
}

export default function Page() {
  const { navigate, currentPage, currentTool, currentBlogSlug, currentCategorySlug } = useAppStore();
  const isInitialMount = useRef(true);
  const isNavigating = useRef(false);

  // On mount: read the URL and sync Zustand state
  useEffect(() => {
    const { page, tool, blogSlug, categorySlug } = resolvePathToState(window.location.pathname);
    if (page !== 'home') {
      // Set state without triggering a URL push
      useAppStore.setState({
        currentPage: page,
        currentTool: tool,
        currentBlogSlug: blogSlug,
        currentCategorySlug: categorySlug,
        isMobileMenuOpen: false,
        isSearchOpen: false,
      });
    }
    isInitialMount.current = false;
  }, []);

  // Push URL on state change (skip the initial mount to avoid double push)
  const syncUrl = useCallback(() => {
    if (isInitialMount.current || isNavigating.current) return;
    const url = getTargetUrl(currentPage, currentTool, currentBlogSlug, currentCategorySlug);
    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
    }
  }, [currentPage, currentTool, currentBlogSlug, currentCategorySlug]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      isNavigating.current = true;
      const { page, tool, blogSlug, categorySlug } = resolvePathToState(window.location.pathname);
      useAppStore.setState({
        currentPage: page,
        currentTool: tool,
        currentBlogSlug: blogSlug,
        currentCategorySlug: categorySlug,
        isMobileMenuOpen: false,
        isSearchOpen: false,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset flag after state propagates
      requestAnimationFrame(() => { isNavigating.current = false; });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Router />
      </main>
      <Footer />
    </div>
  );
}