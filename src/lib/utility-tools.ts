import {
  Type, Hash, CaseSensitive, Copy, EraserIcon, SpaceIcon, ArrowLeftRight,
  ArrowDownAZ, FileDiff, Feather,
  Cake, Calculator, Percent, TrendingUp, Landmark, Divide, HeartPulse, Activity,
  Tag, DollarSign, PieChart, CalendarClock, Clock, Ruler, IndianRupee, Fuel,
  Coins, LineChart,
  Tags, Map, Bot, Facebook, Twitter, Link2, Link as LinkIcon, KeyRound,
  BracesIcon, FileCode2,
  Braces, CheckCircle2, Eye, Code2, Scissors, FileJson, Database, FileCode,
  Fingerprint, Lock, Shield,
  QrCode, Barcode, KeySquare, ShieldCheck, Dice5, Palette, Paintbrush,
  Timer, Clock4, StopCircle, Calendar as CalIcon, NotebookPen, Clipboard,
  ImageIcon, Maximize2, Crop, FileImage, ArrowUpFromLine, RotateCw, FlipHorizontal2,
  type LucideIcon,
} from "lucide-react";

export type ToolCategory = "text" | "calculator" | "seo" | "developer" | "utility" | "image";

export type UtilityTool = {
  slug: string;
  title: string;
  category: ToolCategory;
  description: string;
  keywords: string;
  icon: LucideIcon;
  faqs: { q: string; a: string }[];
};

const commonFaqs = (name: string) => [
  { q: `Is the ${name} free?`, a: `Yes, the ${name} on Bharat AI Sathi is 100% free and unlimited.` },
  { q: `Do you store my data?`, a: `No. All processing happens in your browser — nothing is uploaded to our servers.` },
  { q: `Does it work on mobile?`, a: `Yes, every tool is fully mobile responsive and works on any modern browser.` },
];

export const CATEGORIES: { id: ToolCategory; label: string; hindi: string; description: string }[] = [
  { id: "text", label: "Text Tools", hindi: "टेक्स्ट टूल्स", description: "Count, clean, format and transform text." },
  { id: "calculator", label: "Calculators", hindi: "कैलकुलेटर", description: "Finance, health, dates and unit converters." },
  { id: "seo", label: "SEO Tools", hindi: "एसईओ टूल्स", description: "Generate meta tags, sitemaps, schema and more." },
  { id: "developer", label: "Developer Tools", hindi: "डेवलपर टूल्स", description: "Formatters, minifiers, encoders and hashing." },
  { id: "utility", label: "Utility Tools", hindi: "यूटिलिटी", description: "QR codes, passwords, timers, notepads and pickers." },
  { id: "image", label: "Image Tools", hindi: "इमेज टूल्स", description: "Convert, resize, crop and compress images in your browser." },
];

export const UTILITY_TOOLS: UtilityTool[] = [
  // TEXT
  { slug: "word-counter", title: "Word Counter", category: "text", description: "Count words, characters, sentences and paragraphs instantly.", keywords: "word counter, count words online", icon: Type, faqs: commonFaqs("Word Counter") },
  { slug: "character-counter", title: "Character Counter", category: "text", description: "Count characters with and without spaces in real time.", keywords: "character counter, letter count", icon: Hash, faqs: commonFaqs("Character Counter") },
  { slug: "case-converter", title: "Text Case Converter", category: "text", description: "Convert to UPPER, lower, Title, Sentence, camelCase and snake_case.", keywords: "case converter, uppercase lowercase", icon: CaseSensitive, faqs: commonFaqs("Case Converter") },
  { slug: "remove-duplicate-lines", title: "Remove Duplicate Lines", category: "text", description: "Instantly remove duplicate lines from any list or text.", keywords: "remove duplicate lines", icon: Copy, faqs: commonFaqs("Duplicate Line Remover") },
  { slug: "remove-empty-lines", title: "Remove Empty Lines", category: "text", description: "Delete all blank lines from your text with one click.", keywords: "remove empty lines, blank line remover", icon: EraserIcon, faqs: commonFaqs("Empty Line Remover") },
  { slug: "remove-extra-spaces", title: "Remove Extra Spaces", category: "text", description: "Trim and collapse extra spaces, tabs and line breaks.", keywords: "remove extra spaces, whitespace cleaner", icon: SpaceIcon, faqs: commonFaqs("Space Remover") },
  { slug: "reverse-text", title: "Reverse Text", category: "text", description: "Reverse characters, words or lines of any text.", keywords: "reverse text, mirror text", icon: ArrowLeftRight, faqs: commonFaqs("Reverse Text tool") },
  { slug: "sort-text", title: "Sort Text Lines", category: "text", description: "Sort lines alphabetically (A→Z, Z→A) or by length.", keywords: "sort text, sort lines alphabetically", icon: ArrowDownAZ, faqs: commonFaqs("Text Sorter") },
  { slug: "text-compare", title: "Text Compare (Diff)", category: "text", description: "Compare two texts line by line and highlight the differences.", keywords: "text diff, compare text online", icon: FileDiff, faqs: commonFaqs("Text Diff tool") },
  { slug: "lorem-ipsum", title: "Lorem Ipsum Generator", category: "text", description: "Generate placeholder Lorem Ipsum paragraphs, sentences or words.", keywords: "lorem ipsum generator, placeholder text", icon: Feather, faqs: commonFaqs("Lorem Ipsum Generator") },

  // CALCULATOR
  { slug: "age-calculator", title: "Age Calculator", category: "calculator", description: "Calculate exact age in years, months and days from a date of birth.", keywords: "age calculator, date of birth calculator", icon: Cake, faqs: commonFaqs("Age Calculator") },
  { slug: "emi-calculator", title: "EMI Calculator", category: "calculator", description: "Calculate monthly EMI, total interest and total payment for any loan.", keywords: "emi calculator, loan emi", icon: Calculator, faqs: commonFaqs("EMI Calculator") },
  { slug: "gst-calculator", title: "GST Calculator", category: "calculator", description: "Add or remove GST at 5%, 12%, 18% or 28% instantly.", keywords: "gst calculator india", icon: Percent, faqs: commonFaqs("GST Calculator") },
  { slug: "gst-inclusive", title: "GST Inclusive Calculator", category: "calculator", description: "Reverse-calculate the base price from a GST-inclusive amount.", keywords: "gst inclusive calculator", icon: Percent, faqs: commonFaqs("GST Inclusive Calculator") },
  { slug: "gst-exclusive", title: "GST Exclusive Calculator", category: "calculator", description: "Add GST on top of a base amount to get the final price.", keywords: "gst exclusive calculator", icon: Percent, faqs: commonFaqs("GST Exclusive Calculator") },
  { slug: "sip-calculator", title: "SIP Calculator", category: "calculator", description: "Estimate mutual-fund SIP returns with monthly contribution and rate.", keywords: "sip calculator mutual fund", icon: TrendingUp, faqs: commonFaqs("SIP Calculator") },
  { slug: "loan-calculator", title: "Loan Calculator", category: "calculator", description: "Compute EMI, total interest and payoff schedule for personal or home loans.", keywords: "loan calculator", icon: Landmark, faqs: commonFaqs("Loan Calculator") },
  { slug: "percentage-calculator", title: "Percentage Calculator", category: "calculator", description: "Percent of a number, percent change and reverse percent calculations.", keywords: "percentage calculator online", icon: Divide, faqs: commonFaqs("Percentage Calculator") },
  { slug: "bmi-calculator", title: "BMI Calculator", category: "calculator", description: "Calculate Body Mass Index from height and weight (metric or imperial).", keywords: "bmi calculator", icon: HeartPulse, faqs: commonFaqs("BMI Calculator") },
  { slug: "bmr-calculator", title: "BMR Calculator", category: "calculator", description: "Estimate daily calorie needs using the Mifflin-St Jeor equation.", keywords: "bmr calculator calories", icon: Activity, faqs: commonFaqs("BMR Calculator") },
  { slug: "discount-calculator", title: "Discount Calculator", category: "calculator", description: "Find the final price after a percentage discount is applied.", keywords: "discount calculator", icon: Tag, faqs: commonFaqs("Discount Calculator") },
  { slug: "profit-calculator", title: "Profit Calculator", category: "calculator", description: "Calculate profit or loss from cost price and selling price.", keywords: "profit loss calculator", icon: DollarSign, faqs: commonFaqs("Profit Calculator") },
  { slug: "profit-margin", title: "Profit Margin Calculator", category: "calculator", description: "Calculate gross profit margin percentage from cost and revenue.", keywords: "profit margin calculator", icon: PieChart, faqs: commonFaqs("Profit Margin Calculator") },
  { slug: "date-difference", title: "Date Difference Calculator", category: "calculator", description: "Days, weeks, months and years between two dates.", keywords: "date difference calculator", icon: CalendarClock, faqs: commonFaqs("Date Difference Calculator") },
  { slug: "time-calculator", title: "Time Calculator", category: "calculator", description: "Add or subtract hours, minutes and seconds between times.", keywords: "time calculator, add subtract time", icon: Clock, faqs: commonFaqs("Time Calculator") },
  { slug: "unit-converter", title: "Unit Converter", category: "calculator", description: "Convert length, weight, temperature and volume across units.", keywords: "unit converter online", icon: Ruler, faqs: commonFaqs("Unit Converter") },
  { slug: "currency-converter", title: "Currency Converter", category: "calculator", description: "Live currency conversion between INR, USD, EUR, GBP and 150+ currencies.", keywords: "currency converter live", icon: IndianRupee, faqs: commonFaqs("Currency Converter") },
  { slug: "fuel-cost", title: "Fuel Cost Calculator", category: "calculator", description: "Estimate trip fuel cost from distance, mileage and fuel price.", keywords: "fuel cost calculator", icon: Fuel, faqs: commonFaqs("Fuel Cost Calculator") },
  { slug: "simple-interest", title: "Simple Interest Calculator", category: "calculator", description: "Compute simple interest (P × R × T ÷ 100) with total amount.", keywords: "simple interest calculator", icon: Coins, faqs: commonFaqs("Simple Interest Calculator") },
  { slug: "compound-interest", title: "Compound Interest Calculator", category: "calculator", description: "Compute compound interest with configurable compounding frequency.", keywords: "compound interest calculator", icon: LineChart, faqs: commonFaqs("Compound Interest Calculator") },

  // SEO
  { slug: "meta-tag-generator", title: "Meta Tag Generator", category: "seo", description: "Generate title, description and keyword meta tags for any page.", keywords: "meta tag generator", icon: Tags, faqs: commonFaqs("Meta Tag Generator") },
  { slug: "sitemap-generator", title: "Sitemap Generator", category: "seo", description: "Generate an XML sitemap from a list of URLs.", keywords: "sitemap generator xml", icon: Map, faqs: commonFaqs("Sitemap Generator") },
  { slug: "robots-txt-generator", title: "Robots.txt Generator", category: "seo", description: "Build a valid robots.txt with allow, disallow and sitemap rules.", keywords: "robots txt generator", icon: Bot, faqs: commonFaqs("Robots.txt Generator") },
  { slug: "og-generator", title: "Open Graph Generator", category: "seo", description: "Generate Open Graph meta tags for beautiful link previews on Facebook and LinkedIn.", keywords: "open graph generator og tags", icon: Facebook, faqs: commonFaqs("Open Graph Generator") },
  { slug: "twitter-card-generator", title: "Twitter Card Generator", category: "seo", description: "Generate Twitter/X card meta tags for rich link previews.", keywords: "twitter card generator", icon: Twitter, faqs: commonFaqs("Twitter Card Generator") },
  { slug: "slug-generator", title: "Slug Generator", category: "seo", description: "Convert any title into a clean, URL-safe slug.", keywords: "slug generator url", icon: Link2, faqs: commonFaqs("Slug Generator") },
  { slug: "canonical-generator", title: "Canonical Tag Generator", category: "seo", description: "Generate a rel=canonical link tag for any page URL.", keywords: "canonical tag generator", icon: LinkIcon, faqs: commonFaqs("Canonical Generator") },
  { slug: "keyword-density", title: "Keyword Density Checker", category: "seo", description: "Analyze keyword frequency and density in any text or article.", keywords: "keyword density checker", icon: KeyRound, faqs: commonFaqs("Keyword Density Checker") },
  { slug: "schema-generator", title: "Schema Markup Generator", category: "seo", description: "Generate JSON-LD schema for Article, Product, FAQ, Organization and more.", keywords: "schema markup generator json-ld", icon: BracesIcon, faqs: commonFaqs("Schema Generator") },
  { slug: "sitemap-validator", title: "XML Sitemap Validator", category: "seo", description: "Validate that your XML sitemap is well-formed and lists valid URLs.", keywords: "xml sitemap validator", icon: FileCode2, faqs: commonFaqs("Sitemap Validator") },

  // DEVELOPER
  { slug: "json-formatter", title: "JSON Formatter", category: "developer", description: "Beautify, indent and pretty-print any JSON string.", keywords: "json formatter beautifier", icon: Braces, faqs: commonFaqs("JSON Formatter") },
  { slug: "json-validator", title: "JSON Validator", category: "developer", description: "Validate JSON syntax and get clear error messages with line numbers.", keywords: "json validator lint", icon: CheckCircle2, faqs: commonFaqs("JSON Validator") },
  { slug: "json-viewer", title: "JSON Viewer", category: "developer", description: "Explore JSON as a collapsible tree with syntax highlighting.", keywords: "json viewer tree", icon: Eye, faqs: commonFaqs("JSON Viewer") },
  { slug: "html-formatter", title: "HTML Formatter", category: "developer", description: "Beautify and indent HTML markup for readability.", keywords: "html formatter beautifier", icon: Code2, faqs: commonFaqs("HTML Formatter") },
  { slug: "css-minifier", title: "CSS Minifier", category: "developer", description: "Strip comments and whitespace from CSS to shrink file size.", keywords: "css minifier", icon: Scissors, faqs: commonFaqs("CSS Minifier") },
  { slug: "js-minifier", title: "JavaScript Minifier", category: "developer", description: "Minify JavaScript by removing whitespace and comments.", keywords: "javascript minifier js minify", icon: Scissors, faqs: commonFaqs("JS Minifier") },
  { slug: "sql-formatter", title: "SQL Formatter", category: "developer", description: "Format SQL queries with proper indentation and keyword casing.", keywords: "sql formatter beautifier", icon: Database, faqs: commonFaqs("SQL Formatter") },
  { slug: "xml-formatter", title: "XML Formatter", category: "developer", description: "Beautify and indent XML documents with syntax awareness.", keywords: "xml formatter", icon: FileCode, faqs: commonFaqs("XML Formatter") },
  { slug: "url-encoder", title: "URL Encoder", category: "developer", description: "Percent-encode special characters in URLs and query strings.", keywords: "url encoder", icon: LinkIcon, faqs: commonFaqs("URL Encoder") },
  { slug: "url-decoder", title: "URL Decoder", category: "developer", description: "Decode percent-encoded URL strings back to plain text.", keywords: "url decoder", icon: LinkIcon, faqs: commonFaqs("URL Decoder") },
  { slug: "base64-encoder", title: "Base64 Encoder", category: "developer", description: "Encode any text or file to Base64.", keywords: "base64 encoder", icon: FileJson, faqs: commonFaqs("Base64 Encoder") },
  { slug: "base64-decoder", title: "Base64 Decoder", category: "developer", description: "Decode Base64 strings back to plain text.", keywords: "base64 decoder", icon: FileJson, faqs: commonFaqs("Base64 Decoder") },
  { slug: "uuid-generator", title: "UUID Generator", category: "developer", description: "Generate one or many v4 UUIDs (RFC 4122).", keywords: "uuid generator v4", icon: Fingerprint, faqs: commonFaqs("UUID Generator") },
  { slug: "md5-generator", title: "MD5 Hash Generator", category: "developer", description: "Compute the MD5 hash of any text.", keywords: "md5 generator hash", icon: Lock, faqs: commonFaqs("MD5 Generator") },
  { slug: "sha256-generator", title: "SHA-256 Hash Generator", category: "developer", description: "Compute SHA-256 hash of any text using the Web Crypto API.", keywords: "sha256 generator hash", icon: Shield, faqs: commonFaqs("SHA-256 Generator") },

  // UTILITY
  { slug: "qr-code-generator", title: "QR Code Generator", category: "utility", description: "Generate QR codes for URLs, text, WhatsApp, UPI and download as PNG.", keywords: "qr code generator", icon: QrCode, faqs: commonFaqs("QR Code Generator") },
  { slug: "barcode-generator", title: "Barcode Generator", category: "utility", description: "Generate CODE128, EAN, UPC and other barcodes and download as PNG or SVG.", keywords: "barcode generator", icon: Barcode, faqs: commonFaqs("Barcode Generator") },
  { slug: "password-generator", title: "Password Generator", category: "utility", description: "Generate strong random passwords with configurable length and symbols.", keywords: "password generator strong", icon: KeySquare, faqs: commonFaqs("Password Generator") },
  { slug: "password-strength", title: "Password Strength Checker", category: "utility", description: "Check password strength against length, entropy and common attacks.", keywords: "password strength checker", icon: ShieldCheck, faqs: commonFaqs("Password Strength Checker") },
  { slug: "random-number", title: "Random Number Generator", category: "utility", description: "Generate cryptographically random numbers in any range.", keywords: "random number generator", icon: Dice5, faqs: commonFaqs("Random Number Generator") },
  { slug: "color-picker", title: "Color Picker", category: "utility", description: "Pick colors and get HEX, RGB, HSL and OKLCH values instantly.", keywords: "color picker hex rgb", icon: Palette, faqs: commonFaqs("Color Picker") },
  { slug: "hex-to-rgb", title: "HEX to RGB Converter", category: "utility", description: "Convert HEX color codes to RGB / RGBA values.", keywords: "hex to rgb converter", icon: Paintbrush, faqs: commonFaqs("HEX to RGB Converter") },
  { slug: "rgb-to-hex", title: "RGB to HEX Converter", category: "utility", description: "Convert RGB values to HEX color codes.", keywords: "rgb to hex converter", icon: Paintbrush, faqs: commonFaqs("RGB to HEX Converter") },
  { slug: "digital-clock", title: "Digital Clock", category: "utility", description: "A full-screen live digital clock with 12/24-hour format.", keywords: "digital clock online", icon: Clock4, faqs: commonFaqs("Digital Clock") },
  { slug: "countdown-timer", title: "Countdown Timer", category: "utility", description: "Set a countdown timer for hours, minutes and seconds with alert.", keywords: "countdown timer online", icon: Timer, faqs: commonFaqs("Countdown Timer") },
  { slug: "stopwatch", title: "Stopwatch", category: "utility", description: "Millisecond-accurate stopwatch with lap timing.", keywords: "stopwatch online", icon: StopCircle, faqs: commonFaqs("Stopwatch") },
  { slug: "calendar", title: "Calendar", category: "utility", description: "Interactive calendar with month navigation.", keywords: "online calendar", icon: CalIcon, faqs: commonFaqs("Calendar") },
  { slug: "notepad", title: "Online Notepad", category: "utility", description: "Auto-saving browser notepad — write and access notes from any device.", keywords: "online notepad browser", icon: NotebookPen, faqs: commonFaqs("Online Notepad") },
  { slug: "clipboard", title: "Clipboard Tool", category: "utility", description: "Copy text to clipboard and paste from clipboard with one click.", keywords: "clipboard tool copy paste", icon: Clipboard, faqs: commonFaqs("Clipboard Tool") },

  // IMAGE (client-side canvas)
  { slug: "image-compressor", title: "Image Compressor", category: "image", description: "Compress JPG, PNG and WebP images with adjustable quality — no upload.", keywords: "image compressor online", icon: ImageIcon, faqs: commonFaqs("Image Compressor") },
  { slug: "resize-image", title: "Resize Image", category: "image", description: "Resize images to any width and height, keeping quality.", keywords: "resize image online", icon: Maximize2, faqs: commonFaqs("Image Resizer") },
  { slug: "crop-image", title: "Crop Image", category: "image", description: "Crop images to a custom rectangle right in your browser.", keywords: "crop image online", icon: Crop, faqs: commonFaqs("Image Cropper") },
  { slug: "jpg-to-png", title: "JPG to PNG Converter", category: "image", description: "Convert JPG images to lossless PNG format.", keywords: "jpg to png converter", icon: FileImage, faqs: commonFaqs("JPG to PNG Converter") },
  { slug: "png-to-jpg", title: "PNG to JPG Converter", category: "image", description: "Convert PNG images to smaller JPG files.", keywords: "png to jpg converter", icon: FileImage, faqs: commonFaqs("PNG to JPG Converter") },
  { slug: "webp-converter", title: "WEBP Converter", category: "image", description: "Convert JPG / PNG to WEBP or WEBP back to JPG / PNG.", keywords: "webp converter", icon: FileImage, faqs: commonFaqs("WEBP Converter") },
  { slug: "image-to-base64", title: "Image to Base64", category: "image", description: "Convert any image to a Base64 data URL.", keywords: "image to base64", icon: ArrowUpFromLine, faqs: commonFaqs("Image to Base64") },
  { slug: "base64-to-image", title: "Base64 to Image", category: "image", description: "Convert a Base64 data URL back to a downloadable image.", keywords: "base64 to image", icon: ArrowUpFromLine, faqs: commonFaqs("Base64 to Image") },
  { slug: "rotate-image", title: "Rotate Image", category: "image", description: "Rotate images 90°, 180° or 270° and download the result.", keywords: "rotate image online", icon: RotateCw, faqs: commonFaqs("Image Rotator") },
  { slug: "flip-image", title: "Flip Image", category: "image", description: "Flip images horizontally or vertically in your browser.", keywords: "flip image online", icon: FlipHorizontal2, faqs: commonFaqs("Image Flipper") },
];

export const TOOL_BY_SLUG: Record<string, UtilityTool> = Object.fromEntries(
  UTILITY_TOOLS.map((t) => [t.slug, t]),
);

export function relatedTools(slug: string, category: ToolCategory, count = 6): UtilityTool[] {
  return UTILITY_TOOLS.filter((t) => t.category === category && t.slug !== slug).slice(0, count);
}
