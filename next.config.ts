import type { NextConfig } from "next";

const toolSlugs = [
  'age-calculator', 'bmi-calculator', 'percentage-calculator', 'loan-emi-calculator', 'gst-calculator',
  'currency-converter', 'length-converter', 'weight-converter', 'temperature-converter', 'time-converter',
  'word-counter', 'character-counter', 'case-converter',
  'password-generator', 'qr-code-generator', 'barcode-generator', 'color-picker', 'color-palette-generator',
  'uuid-generator', 'lorem-ipsum-generator',
  'json-formatter', 'html-formatter', 'css-minifier', 'js-minifier',
  'base64-encoder', 'base64-decoder', 'url-encoder', 'url-decoder',
  'image-compressor', 'image-resizer', 'image-cropper', 'background-remover',
  'pdf-merge', 'pdf-split', 'pdf-to-word', 'word-to-pdf', 'pdf-compressor',
  'hex-to-rgb', 'rgb-to-hex',
];

const categorySlugs = [
  'calculators', 'converters', 'text-tools', 'generators',
  'developer', 'image-tools', 'pdf-tools', 'color-tools',
];

const blogSlugs = [
  'essential-tools-developers-2026',
  'create-strong-passwords-guide',
  'color-theory-web-design',
  'pdf-optimization-guide',
];

const staticPages = ['about', 'contact', 'privacy', 'terms', 'disclaimer', 'tools', 'categories', 'blog', 'admin', 'search'];

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async rewrites() {
    const rules = [];
    // Static pages
    for (const page of staticPages) {
      rules.push({ source: `/${page}`, destination: '/' });
    }
    // Tool pages (top-level slugs)
    for (const slug of toolSlugs) {
      rules.push({ source: `/${slug}`, destination: '/' });
    }
    // Category pages
    for (const slug of categorySlugs) {
      rules.push({ source: `/category/${slug}`, destination: '/' });
    }
    // Blog post pages
    for (const slug of blogSlugs) {
      rules.push({ source: `/blog/${slug}`, destination: '/' });
    }
    return rules;
  },
};

export default nextConfig;