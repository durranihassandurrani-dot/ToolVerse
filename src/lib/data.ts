import type { Tool, Category, BlogPost, Testimonial, FAQ } from '@/types';

export const categories: Category[] = [
  { id: 'calculators', name: 'Calculators', slug: 'calculators', description: 'Powerful calculators for everyday math and finance', icon: 'Calculator', toolCount: 5, color: 'from-violet-500 to-purple-600' },
  { id: 'converters', name: 'Converters', slug: 'converters', description: 'Convert between units seamlessly', icon: 'ArrowLeftRight', toolCount: 5, color: 'from-cyan-500 to-blue-600' },
  { id: 'text-tools', name: 'Text Tools', slug: 'text-tools', description: 'Text analysis and manipulation', icon: 'Type', toolCount: 3, color: 'from-emerald-500 to-green-600' },
  { id: 'generators', name: 'Generators', slug: 'generators', description: 'Generate passwords, codes, and content', icon: 'Wand2', toolCount: 6, color: 'from-orange-500 to-red-600' },
  { id: 'developer', name: 'Developer Tools', slug: 'developer', description: 'Format, encode, and debug code', icon: 'Code2', toolCount: 8, color: 'from-pink-500 to-rose-600' },
  { id: 'image-tools', name: 'Image Tools', slug: 'image-tools', description: 'Compress, resize, and edit images', icon: 'Image', toolCount: 4, color: 'from-amber-500 to-yellow-600' },
  { id: 'pdf-tools', name: 'PDF Tools', slug: 'pdf-tools', description: 'Merge, split, and convert PDFs', icon: 'FileText', toolCount: 5, color: 'from-teal-500 to-cyan-600' },
  { id: 'color-tools', name: 'Color Tools', slug: 'color-tools', description: 'Pick, generate, and convert colors', icon: 'Palette', toolCount: 3, color: 'from-fuchsia-500 to-purple-600' },
];

export const tools: Tool[] = [
  // Calculators
  { id: 'age-calculator', name: 'Age Calculator', slug: 'age-calculator', description: 'Calculate your exact age in years, months, days, hours, and seconds.', category: 'Calculators', categorySlug: 'calculators', icon: 'Cake', keywords: ['age', 'birthday', 'date', 'how old'], popular: true },
  { id: 'bmi-calculator', name: 'BMI Calculator', slug: 'bmi-calculator', description: 'Calculate your Body Mass Index and find out your weight status.', category: 'Calculators', categorySlug: 'calculators', icon: 'Heart', keywords: ['bmi', 'body mass', 'health', 'weight status'], popular: true, trending: true },
  { id: 'percentage-calculator', name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Quickly calculate percentages, increases, decreases, and differences.', category: 'Calculators', categorySlug: 'calculators', icon: 'Percent', keywords: ['percent', 'percentage', 'increase', 'decrease', 'ratio'], popular: true },
  { id: 'loan-emi-calculator', name: 'Loan EMI Calculator', slug: 'loan-emi-calculator', description: 'Calculate your monthly loan EMI, total interest, and payment schedule.', category: 'Calculators', categorySlug: 'calculators', icon: 'Landmark', keywords: ['loan', 'emi', 'mortgage', 'interest', 'payment'], trending: true },
  { id: 'gst-calculator', name: 'GST Calculator', slug: 'gst-calculator', description: 'Calculate GST inclusive and exclusive prices with different tax rates.', category: 'Calculators', categorySlug: 'calculators', icon: 'Receipt', keywords: ['gst', 'tax', 'vat', 'sales tax'], latest: true },

  // Converters
  { id: 'currency-converter', name: 'Currency Converter', slug: 'currency-converter', description: 'Convert between 50+ world currencies with live exchange rates.', category: 'Converters', categorySlug: 'converters', icon: 'DollarSign', keywords: ['currency', 'money', 'exchange rate', 'forex', 'usd'], popular: true, trending: true },
  { id: 'length-converter', name: 'Length Converter', slug: 'length-converter', description: 'Convert between meters, feet, inches, kilometers, miles, and more.', category: 'Converters', categorySlug: 'converters', icon: 'Ruler', keywords: ['length', 'distance', 'meter', 'feet', 'inch', 'km', 'mile'] },
  { id: 'weight-converter', name: 'Weight Converter', slug: 'weight-converter', description: 'Convert between kilograms, pounds, ounces, grams, and more.', category: 'Converters', categorySlug: 'converters', icon: 'Weight', keywords: ['weight', 'mass', 'kg', 'pound', 'ounce', 'gram'] },
  { id: 'temperature-converter', name: 'Temperature Converter', slug: 'temperature-converter', description: 'Convert between Celsius, Fahrenheit, and Kelvin.', category: 'Converters', categorySlug: 'converters', icon: 'Thermometer', keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin', 'degrees'] },
  { id: 'time-converter', name: 'Time Converter', slug: 'time-converter', description: 'Convert between seconds, minutes, hours, days, weeks, months, and years.', category: 'Converters', categorySlug: 'converters', icon: 'Clock', keywords: ['time', 'seconds', 'minutes', 'hours', 'days', 'duration'], latest: true },

  // Text Tools
  { id: 'word-counter', name: 'Word Counter', slug: 'word-counter', description: 'Count words, characters, sentences, paragraphs, and estimate reading time.', category: 'Text Tools', categorySlug: 'text-tools', icon: 'Hash', keywords: ['word count', 'character count', 'reading time', 'text analysis'], popular: true },
  { id: 'character-counter', name: 'Character Counter', slug: 'character-counter', description: 'Count characters with and without spaces, letters, digits, and special characters.', category: 'Text Tools', categorySlug: 'text-tools', icon: 'TextCursorInput', keywords: ['character', 'letter count', 'string length', 'char limit'] },
  { id: 'case-converter', name: 'Case Converter', slug: 'case-converter', description: 'Convert text between uppercase, lowercase, title case, sentence case, and more.', category: 'Text Tools', categorySlug: 'text-tools', icon: 'CaseSensitive', keywords: ['uppercase', 'lowercase', 'title case', 'sentence case', 'capitalize'] },

  // Generators
  { id: 'password-generator', name: 'Password Generator', slug: 'password-generator', description: 'Generate strong, secure passwords with customizable length and character sets.', category: 'Generators', categorySlug: 'generators', icon: 'KeyRound', keywords: ['password', 'random', 'secure', 'strong password', 'generate'], popular: true, trending: true },
  { id: 'qr-code-generator', name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Create QR codes from text, URLs, emails, phone numbers, and WiFi credentials.', category: 'Generators', categorySlug: 'generators', icon: 'QrCode', keywords: ['qr code', 'qr', 'barcode', 'scan', 'generate qr'], popular: true },
  { id: 'barcode-generator', name: 'Barcode Generator', slug: 'barcode-generator', description: 'Generate CODE128, EAN-13, UPC-A, and other barcode formats.', category: 'Generators', categorySlug: 'generators', icon: 'Barcode', keywords: ['barcode', 'code128', 'ean', 'upc', 'product code'], latest: true },
  { id: 'color-picker', name: 'Color Picker', slug: 'color-picker', description: 'Pick colors from the spectrum and get HEX, RGB, HSL, and CMYK values.', category: 'Color Tools', categorySlug: 'color-tools', icon: 'Pipette', keywords: ['color', 'picker', 'hex', 'rgb', 'hsl', 'palette'], popular: true },
  { id: 'color-palette-generator', name: 'Color Palette Generator', slug: 'color-palette-generator', description: 'Generate beautiful, harmonious color palettes for your projects.', category: 'Color Tools', categorySlug: 'color-tools', icon: 'Palette', keywords: ['palette', 'color scheme', 'color combination', 'design', 'harmony'] },
  { id: 'uuid-generator', name: 'UUID Generator', slug: 'uuid-generator', description: 'Generate UUID v4 and v7 identifiers for your applications.', category: 'Generators', categorySlug: 'generators', icon: 'Fingerprint', keywords: ['uuid', 'guid', 'unique id', 'identifier', 'random id'] },
  { id: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum-generator', description: 'Generate placeholder text in paragraphs, sentences, or words.', category: 'Generators', categorySlug: 'generators', icon: 'FileText', keywords: ['lorem ipsum', 'placeholder', 'dummy text', 'filler text'] },

  // Developer Tools
  { id: 'json-formatter', name: 'JSON Formatter', slug: 'json-formatter', description: 'Format, validate, and beautify JSON data with syntax highlighting.', category: 'Developer Tools', categorySlug: 'developer', icon: 'Braces', keywords: ['json', 'format', 'beautify', 'validate', 'pretty print'], popular: true, trending: true },
  { id: 'html-formatter', name: 'HTML Formatter', slug: 'html-formatter', description: 'Format and beautify HTML code with proper indentation.', category: 'Developer Tools', categorySlug: 'developer', icon: 'FileCode', keywords: ['html', 'format', 'beautify', 'indent', 'tidy'] },
  { id: 'css-minifier', name: 'CSS Minifier', slug: 'css-minifier', description: 'Minify CSS code to reduce file size and improve loading speed.', category: 'Developer Tools', categorySlug: 'developer', icon: 'FileMinus', keywords: ['css', 'minify', 'compress', 'optimize', 'reduce size'] },
  { id: 'js-minifier', name: 'JavaScript Minifier', slug: 'js-minifier', description: 'Minify JavaScript code to reduce file size and improve performance.', category: 'Developer Tools', categorySlug: 'developer', icon: 'FileCode2', keywords: ['javascript', 'minify', 'compress', 'uglify', 'optimize'] },
  { id: 'base64-encoder', name: 'Base64 Encoder', slug: 'base64-encoder', description: 'Encode text to Base64 format for data transmission.', category: 'Developer Tools', categorySlug: 'developer', icon: 'Lock', keywords: ['base64', 'encode', 'convert', 'binary to text'] },
  { id: 'base64-decoder', name: 'Base64 Decoder', slug: 'base64-decoder', description: 'Decode Base64 encoded text back to readable format.', category: 'Developer Tools', categorySlug: 'developer', icon: 'Unlock', keywords: ['base64', 'decode', 'convert', 'text to binary'] },
  { id: 'url-encoder', name: 'URL Encoder', slug: 'url-encoder', description: 'Encode URLs and query parameters for safe transmission.', category: 'Developer Tools', categorySlug: 'developer', icon: 'Link', keywords: ['url', 'encode', 'percent encoding', 'query string'] },
  { id: 'url-decoder', name: 'URL Decoder', slug: 'url-decoder', description: 'Decode URL-encoded strings back to readable format.', category: 'Developer Tools', categorySlug: 'developer', icon: 'Unlink', keywords: ['url', 'decode', 'percent decoding', 'decode url'] },

  // Image Tools
  { id: 'image-compressor', name: 'Image Compressor', slug: 'image-compressor', description: 'Compress images to reduce file size while maintaining quality.', category: 'Image Tools', categorySlug: 'image-tools', icon: 'ImageDown', keywords: ['compress', 'optimize', 'reduce size', 'image'], popular: true, trending: true },
  { id: 'image-resizer', name: 'Image Resizer', slug: 'image-resizer', description: 'Resize images to exact dimensions or by percentage.', category: 'Image Tools', categorySlug: 'image-tools', icon: 'Maximize2', keywords: ['resize', 'dimensions', 'scale', 'image size'] },
  { id: 'image-cropper', name: 'Image Cropper', slug: 'image-cropper', description: 'Crop images to specific aspect ratios or custom dimensions.', category: 'Image Tools', categorySlug: 'image-tools', icon: 'Crop', keywords: ['crop', 'cut', 'trim', 'aspect ratio'] },
  { id: 'background-remover', name: 'Background Remover', slug: 'background-remover', description: 'Remove image backgrounds instantly to create transparent PNGs.', category: 'Image Tools', categorySlug: 'image-tools', icon: 'Eraser', keywords: ['background', 'remove', 'transparent', 'cutout', 'erase'], latest: true },

  // PDF Tools
  { id: 'pdf-merge', name: 'PDF Merge', slug: 'pdf-merge', description: 'Merge multiple PDF files into a single document.', category: 'PDF Tools', categorySlug: 'pdf-tools', icon: 'Merge', keywords: ['pdf', 'merge', 'combine', 'join', 'concatenate'], popular: true },
  { id: 'pdf-split', name: 'PDF Split', slug: 'pdf-split', description: 'Split PDF files into individual pages or custom ranges.', category: 'PDF Tools', categorySlug: 'pdf-tools', icon: 'Split', keywords: ['pdf', 'split', 'extract', 'separate', 'pages'] },
  { id: 'pdf-to-word', name: 'PDF to Word', slug: 'pdf-to-word', description: 'Convert PDF documents to editable Word files.', category: 'PDF Tools', categorySlug: 'pdf-tools', icon: 'FileOutput', keywords: ['pdf', 'word', 'convert', 'docx', 'editable'] },
  { id: 'word-to-pdf', name: 'Word to PDF', slug: 'word-to-pdf', description: 'Convert Word documents to PDF format for easy sharing.', category: 'PDF Tools', categorySlug: 'pdf-tools', icon: 'FileInput', keywords: ['word', 'pdf', 'convert', 'docx', 'document'] },
  { id: 'pdf-compressor', name: 'PDF Compressor', slug: 'pdf-compressor', description: 'Compress PDF files to reduce size while preserving quality.', category: 'PDF Tools', categorySlug: 'pdf-tools', icon: 'FileDown', keywords: ['pdf', 'compress', 'reduce size', 'optimize'], latest: true },

  // Color Tools
  { id: 'hex-to-rgb', name: 'HEX to RGB Converter', slug: 'hex-to-rgb', description: 'Convert HEX color codes to RGB values instantly.', category: 'Color Tools', categorySlug: 'color-tools', icon: 'Paintbrush', keywords: ['hex', 'rgb', 'color', 'convert', 'color code'] },
  { id: 'rgb-to-hex', name: 'RGB to HEX Converter', slug: 'rgb-to-hex', description: 'Convert RGB values to HEX color codes instantly.', category: 'Color Tools', categorySlug: 'color-tools', icon: 'PaintBucket', keywords: ['rgb', 'hex', 'color', 'convert', 'color code'] },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1', title: '10 Essential Online Tools Every Developer Needs in 2026', slug: 'essential-tools-developers-2026',
    excerpt: 'Discover the must-have online tools that can supercharge your development workflow and save you hours of work every week.',
    content: `In the fast-paced world of software development, having the right tools at your fingertips can make a tremendous difference in productivity. Whether you're formatting JSON, generating secure passwords, or compressing images for production, online tools have become indispensable companions for modern developers.

## Why Online Tools Matter

Online tools offer several advantages over desktop applications: they require no installation, work across all platforms, and are always up to date. With ToolVerse, you get access to over 100 free tools that work directly in your browser.

## Top Categories

**Calculators** — From BMI calculators to loan EMI calculators, having quick access to mathematical tools saves time and reduces errors in calculations.

**Code Formatters** — Clean, well-formatted code is easier to read, debug, and maintain. Our JSON and CSS formatters handle the heavy lifting so you can focus on writing great code.

**Image Tools** — Optimizing images for the web is crucial for performance. Our compression and resizing tools help you achieve the perfect balance between quality and file size.

## Conclusion

The right tools can transform your workflow. Bookmark ToolVerse and keep these essential tools just a click away whenever you need them.`,
    category: 'Developer Tips', author: 'ToolVerse Team', date: '2026-07-01', readTime: 5,
    tags: ['tools', 'developer', 'productivity', 'web development'], image: '/blog/tools.jpg'
  },
  {
    id: '2', title: 'How to Create Strong Passwords: A Complete Guide', slug: 'create-strong-passwords-guide',
    excerpt: 'Learn the science behind strong passwords and how our password generator creates unbreakable combinations.',
    content: `In an era where data breaches are increasingly common, having strong, unique passwords for each of your accounts is more important than ever. This comprehensive guide covers everything you need to know about password security.

## What Makes a Password Strong?

A strong password typically has the following characteristics:

- **Length**: At least 12 characters, ideally 16+
- **Complexity**: Mix of uppercase, lowercase, numbers, and symbols
- **Uniqueness**: Different for every account
- **Randomness**: Not based on dictionary words or personal information

## Common Password Mistakes

Many people still make critical password mistakes: using the same password across multiple sites, choosing easily guessable combinations like "password123", or using personal information that can be found on social media.

## How ToolVerse Password Generator Helps

Our password generator creates cryptographically secure random passwords that meet all the criteria above. You can customize the length and character sets to match specific website requirements.

## Best Practices

Use a password manager to store your passwords securely. Enable two-factor authentication wherever possible. And use our password generator to create unique, strong passwords for every account.`,
    category: 'Security', author: 'ToolVerse Team', date: '2026-06-25', readTime: 7,
    tags: ['password', 'security', 'guide', 'authentication'], image: '/blog/passwords.jpg'
  },
  {
    id: '3', title: 'Understanding Color Theory for Web Design', slug: 'color-theory-web-design',
    excerpt: 'Master the fundamentals of color theory and learn how to create stunning color palettes for your projects.',
    content: `Color is one of the most powerful tools in a designer's arsenal. Understanding color theory can help you create more effective, visually appealing designs that communicate your message clearly.

## The Color Wheel

The color wheel is the foundation of color theory. It consists of primary colors (red, blue, yellow), secondary colors (green, orange, purple), and tertiary colors created by mixing primary and secondary colors.

## Color Harmony

There are several types of color harmony: complementary (opposite colors), analogous (adjacent colors), triadic (three equally spaced colors), and monochromatic (variations of a single hue).

## Using Our Color Tools

ToolVerse offers several color tools to help you work with colors effectively:

- **Color Picker**: Pick any color and get its HEX, RGB, HSL, and CMYK values
- **Color Palette Generator**: Generate harmonious palettes automatically
- **HEX to RGB Converter**: Quickly convert between color formats

## Practical Tips

When designing for the web, consider accessibility. Ensure sufficient contrast between text and background colors. Test your designs in both light and dark modes. And always use a consistent color system across your project.`,
    category: 'Design', author: 'ToolVerse Team', date: '2026-06-18', readTime: 6,
    tags: ['color', 'design', 'palette', 'web design', 'ui'], image: '/blog/colors.jpg'
  },
  {
    id: '4', title: 'PDF Optimization: Reduce File Size Without Losing Quality', slug: 'pdf-optimization-guide',
    excerpt: 'Learn proven techniques to compress PDF files while maintaining document quality and readability.',
    content: `PDF files can quickly become unwieldy, especially when they contain images or complex formatting. Large PDFs are slow to upload, download, and share. This guide shows you how to optimize your PDFs effectively.

## Why Compress PDFs?

Large PDF files consume bandwidth, storage, and processing power. Compressing them improves email deliverability, reduces hosting costs, and provides a better experience for anyone accessing your documents.

## Compression Techniques

There are several approaches to PDF compression:

1. **Image compression**: Reduce the resolution and quality of embedded images
2. **Font subsetting**: Include only the characters actually used
3. **Metadata removal**: Strip unnecessary metadata
4. **Duplicate removal**: Eliminate redundant objects

## ToolVerse PDF Tools

Our PDF compressor handles all of these techniques automatically. Simply upload your PDF and download the optimized version. We also offer PDF merge and split tools for organizing your documents.

## Best Results

For the best balance of quality and file size, start with our default compression settings. If you need smaller files, you can increase the compression level while monitoring the quality of text and images.`,
    category: 'Productivity', author: 'ToolVerse Team', date: '2026-06-10', readTime: 5,
    tags: ['pdf', 'compression', 'optimization', 'productivity'], image: '/blog/pdf.jpg'
  },
];

export const testimonials: Testimonial[] = [
  { id: '1', name: 'Sarah Chen', role: 'Frontend Developer at TechCorp', content: 'ToolVerse has become my go-to resource. The JSON formatter and CSS minifier save me at least 30 minutes every day. Absolutely essential for any developer.', avatar: 'SC', rating: 5 },
  { id: '2', name: 'Marcus Johnson', role: 'Freelance Designer', content: 'The color tools are phenomenal. I use the palette generator and color picker for every new project. The interface is clean, fast, and a joy to use.', avatar: 'MJ', rating: 5 },
  { id: '3', name: 'Priya Patel', role: 'Content Manager', content: 'As a content manager, the word counter, case converter, and lorem ipsum generator are in my daily toolkit. ToolVerse is reliable and beautifully designed.', avatar: 'PP', rating: 5 },
  { id: '4', name: 'David Kim', role: 'Startup Founder', content: 'We use ToolVerse across our entire team. From the BMI calculator in our health app research to the PDF tools for document management. It is incredibly versatile.', avatar: 'DK', rating: 5 },
  { id: '5', name: 'Emily Rodriguez', role: 'Student', content: 'The loan EMI calculator and percentage calculator helped me so much with my finance coursework. Free, fast, and no sign-up required. Perfect!', avatar: 'ER', rating: 5 },
  { id: '6', name: 'Alex Thompson', role: 'Backend Engineer', content: 'The Base64 encoder/decoder and UUID generator are tools I reach for constantly. Having everything in one place with a consistent interface is a huge plus.', avatar: 'AT', rating: 5 },
];

export const faqs: FAQ[] = [
  { id: '1', question: 'Are all tools on ToolVerse completely free?', answer: 'Yes! Every tool on ToolVerse is 100% free to use with no hidden charges, no premium tiers, and no sign-up required. We believe in making useful tools accessible to everyone.' },
  { id: '2', question: 'Is my data safe when using these tools?', answer: 'Absolutely. All processing happens directly in your browser. We never upload your data to any server. Your files, text, and calculations remain completely private on your device.' },
  { id: '3', question: 'Do I need to create an account to use the tools?', answer: 'No account is needed. Simply visit the tool page and start using it immediately. We do offer optional features like saving favorites if you choose to create an account.' },
  { id: '4', question: 'Can I use ToolVerse on my mobile device?', answer: 'Yes! ToolVerse is fully responsive and works beautifully on smartphones, tablets, laptops, and desktops. The interface adapts to any screen size.' },
  { id: '5', question: 'How often are new tools added?', answer: 'We regularly add new tools based on user feedback and emerging needs. Subscribe to our newsletter to be notified when new tools are available.' },
  { id: '6', question: 'Are the conversion calculations accurate?', answer: 'Our calculators and converters use precise mathematical formulas and up-to-date conversion rates. You can trust the results for both personal and professional use.' },
  { id: '7', question: 'Can I suggest a new tool?', answer: 'Of course! We love hearing from our users. Visit our Contact page and submit your tool suggestion. We review all suggestions and prioritize the most requested tools.' },
  { id: '8', question: 'Do the image and PDF tools work offline?', answer: 'Once the page is loaded, most tools work entirely offline since all processing happens in your browser. However, you will need an internet connection to initially load the tools.' },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return tools.filter(t => t.categorySlug === categorySlug);
}

export function getPopularTools(): Tool[] {
  return tools.filter(t => t.popular);
}

export function getTrendingTools(): Tool[] {
  return tools.filter(t => t.trending);
}

export function getLatestTools(): Tool[] {
  return tools.filter(t => t.latest);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q) ||
    t.keywords.some(k => k.includes(q))
  );
}