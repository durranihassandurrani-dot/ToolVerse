"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Braces,
  Code2,
  FileCode2,
  FileJson,
  Lock,
  Unlock,
  Link,
  Unlink,
  Copy,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  Sparkles,
  Minimize2,
  AlertTriangle,
} from "lucide-react";

// ─── Shared Helpers ────────────────────────────────────────────────────

function copyToClipboard(
  text: string,
  label: string,
  toastFn: ReturnType<typeof useToast>["toast"]
) {
  navigator.clipboard.writeText(text).then(() => {
    toastFn({ title: "Copied!", description: `${label} copied to clipboard.` });
  });
}

function downloadAsFile(
  content: string,
  filename: string,
  mimeType: string,
  toastFn: ReturnType<typeof useToast>["toast"]
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toastFn({ title: "Downloaded!", description: `${filename} saved.` });
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── 1. JSON Formatter ────────────────────────────────────────────────

export function JsonFormatter() {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isValid, setIsValid] = React.useState<boolean | null>(null);

  const handleFormat = () => {
    setError(null);
    setIsValid(null);
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
      toast({ title: "Formatted!", description: "JSON beautified successfully." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      const lineMatch = msg.match(/position (\d+)/);
      let lineInfo = "";
      if (lineMatch) {
        const pos = parseInt(lineMatch[1], 10);
        const lines = input.substring(0, pos).split("\n");
        lineInfo = ` (line ${lines.length})`;
      }
      setError(msg + lineInfo);
      setIsValid(false);
      setOutput("");
    }
  };

  const handleMinify = () => {
    setError(null);
    setIsValid(null);
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      toast({ title: "Minified!", description: "JSON minified successfully." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      const lineMatch = msg.match(/position (\d+)/);
      let lineInfo = "";
      if (lineMatch) {
        const pos = parseInt(lineMatch[1], 10);
        const lines = input.substring(0, pos).split("\n");
        lineInfo = ` (line ${lines.length})`;
      }
      setError(msg + lineInfo);
      setIsValid(false);
      setOutput("");
    }
  };

  const handleValidate = () => {
    setError(null);
    setIsValid(null);
    try {
      JSON.parse(input);
      setIsValid(true);
      toast({ title: "Valid JSON!", description: "Your JSON is valid." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      const lineMatch = msg.match(/position (\d+)/);
      let lineInfo = "";
      if (lineMatch) {
        const pos = parseInt(lineMatch[1], 10);
        const lines = input.substring(0, pos).split("\n");
        lineInfo = ` (line ${lines.length})`;
      }
      setError(msg + lineInfo);
      setIsValid(false);
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError(null);
    setIsValid(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Braces className="size-5" />
          JSON Formatter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Input JSON</Label>
            <Textarea
              className="min-h-64 font-mono text-sm"
              placeholder='{"key": "value"}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Output</Label>
            <Textarea
              className="min-h-64 font-mono text-sm"
              placeholder="Formatted result..."
              value={output}
              readOnly
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleFormat}>
            <Sparkles className="size-4" />
            Format / Beautify
          </Button>
          <Button variant="secondary" onClick={handleMinify}>
            <Minimize2 className="size-4" />
            Minify
          </Button>
          <Button variant="outline" onClick={handleValidate}>
            Validate
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
          {output && (
            <Button
              variant="outline"
              onClick={() => copyToClipboard(output, "JSON", toast)}
            >
              <Copy className="size-4" />
              Copy
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() =>
              downloadAsFile(output, "formatted.json", "application/json", toast)
            }
            disabled={!output}
          >
            <Download className="size-4" />
            Download
          </Button>
        </div>

        {isValid === true && (
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="size-3" />
            Valid JSON
          </Badge>
        )}
        {isValid === false && (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="size-3" />
            Invalid JSON
          </Badge>
        )}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 2. HTML Formatter ────────────────────────────────────────────────

function formatHtml(html: string): string {
  let formatted = "";
  let indent = 0;
  const tab = "  ";

  // Normalize: remove existing whitespace between tags
  const normalized = html.replace(/>\s+</g, "><").trim();

  // Tokenize
  const tokens = normalized.match(/(<[^>]+>|[^<]+)/g) || [];

  const selfClosing = new Set([
    "area", "base", "br", "col", "embed", "hr", "img",
    "input", "link", "meta", "param", "source", "track", "wbr",
  ]);

  const closingTags = new Set([
    "p", "div", "span", "a", "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "table", "tr", "td", "th", "thead", "tbody",
    "tfoot", "form", "section", "article", "aside", "header", "footer",
    "nav", "main", "details", "summary", "dialog", "figure", "figcaption",
    "script", "style", "html", "head", "body", "title", "select", "option",
    "textarea", "button", "label", "fieldset", "legend", "pre", "code",
    "blockquote", "dl", "dt", "dd", "video", "audio", "canvas", "map",
    "template", "slot", "noscript", "iframe", "object",
  ]);

  tokens.forEach((token) => {
    if (token.startsWith("</")) {
      // Closing tag
      const tagName = token.match(/<\/(\w+)/)?.[1]?.toLowerCase() || "";
      if (closingTags.has(tagName) && indent > 0) indent--;
      formatted += tab.repeat(indent) + token.trim() + "\n";
    } else if (token.startsWith("<")) {
      // Opening or self-closing tag
      const tagName = token.match(/<(\w+)/)?.[1]?.toLowerCase() || "";
      formatted += tab.repeat(indent) + token.trim() + "\n";
      if (
        !token.endsWith("/>") &&
        !selfClosing.has(tagName) &&
        closingTags.has(tagName)
      ) {
        indent++;
      }
    } else {
      // Text content
      const trimmed = token.trim();
      if (trimmed) {
        formatted += tab.repeat(indent) + trimmed + "\n";
      }
    }
  });

  return formatted.trimEnd();
}

export function HtmlFormatter() {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  const handleFormat = () => {
    if (!input.trim()) {
      toast({ title: "Input is empty", description: "Please enter HTML to format." });
      return;
    }
    try {
      const formatted = formatHtml(input);
      setOutput(formatted);
      toast({ title: "Formatted!", description: "HTML formatted successfully." });
    } catch {
      toast({
        title: "Error",
        description: "Failed to format HTML.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="size-5" />
          HTML Formatter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Input HTML</Label>
            <Textarea
              className="min-h-64 font-mono text-sm"
              placeholder="<div><p>Hello</p></div>"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Formatted Output</Label>
            <Textarea
              className="min-h-64 font-mono text-sm"
              placeholder="Formatted HTML..."
              value={output}
              readOnly
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleFormat}>
            <Sparkles className="size-4" />
            Format
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
          {output && (
            <Button
              variant="outline"
              onClick={() => copyToClipboard(output, "HTML", toast)}
            >
              <Copy className="size-4" />
              Copy
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() =>
              downloadAsFile(output, "formatted.html", "text/html", toast)
            }
            disabled={!output}
          >
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 3. CSS Minifier ──────────────────────────────────────────────────

function minifyCss(css: string): string {
  let result = css;

  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove single-line comments (// style comments, non-standard in CSS but some preprocessors)
  result = result.replace(/\/\/.*$/gm, "");

  // Remove newlines and extra whitespace
  result = result.replace(/\s+/g, " ");

  // Remove space before {
  result = result.replace(/\s*\{\s*/g, "{");

  // Remove space after }
  result = result.replace(/\s*\}\s*/g, "}");

  // Remove space around :
  result = result.replace(/\s*:\s*/g, ":");

  // Remove space around ;
  result = result.replace(/\s*;\s*/g, ";");

  // Remove space around ,
  result = result.replace(/\s*,\s*/g, ",");

  // Remove last semicolon before closing brace
  result = result.replace(/;}/g, "}");

  // Trim
  result = result.trim();

  return result;
}

export function CssMinifier() {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  const handleMinify = () => {
    if (!input.trim()) {
      toast({ title: "Input is empty", description: "Please enter CSS to minify." });
      return;
    }
    const minified = minifyCss(input);
    setOutput(minified);
    toast({ title: "Minified!", description: "CSS minified successfully." });
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
  };

  const originalSize = new Blob([input]).size;
  const minifiedSize = new Blob([output]).size;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode2 className="size-5" />
          CSS Minifier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Input CSS</Label>
            <Textarea
              className="min-h-64 font-mono text-sm"
              placeholder="body { color: red; }"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Minified Output</Label>
            <Textarea
              className="min-h-64 font-mono text-sm"
              placeholder="Minified CSS..."
              value={output}
              readOnly
            />
          </div>
        </div>

        {output && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Original: <Badge variant="secondary">{formatBytes(originalSize)}</Badge></span>
            <span>Minified: <Badge variant="secondary">{formatBytes(minifiedSize)}</Badge></span>
            {originalSize > 0 && (
              <span>
                Saved:{" "}
                <Badge variant="default">
                  {((1 - minifiedSize / originalSize) * 100).toFixed(1)}%
                </Badge>
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleMinify}>
            <Minimize2 className="size-4" />
            Minify
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
          {output && (
            <Button
              variant="outline"
              onClick={() => copyToClipboard(output, "CSS", toast)}
            >
              <Copy className="size-4" />
              Copy
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() =>
              downloadAsFile(output, "minified.css", "text/css", toast)
            }
            disabled={!output}
          >
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 4. JS Minifier ───────────────────────────────────────────────────

function minifyJs(js: string): string {
  let result = js;

  // Remove multi-line comments (but not inside strings)
  // Simple approach: remove /* ... */ comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove single-line comments (// ...) — be careful not to match inside strings
  // Simple approach: remove // that are not inside strings by handling line by line
  const lines = result.split("\n");
  const processedLines: string[] = [];

  for (const line of lines) {
    let inString: string | null = null;
    let cleaned = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const prev = i > 0 ? line[i - 1] : "";

      if (inString) {
        cleaned += ch;
        if (ch === inString && prev !== "\\") {
          inString = null;
        }
      } else if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch;
        cleaned += ch;
      } else if (ch === "/" && i + 1 < line.length && line[i + 1] === "/") {
        break; // Rest of line is comment
      } else {
        cleaned += ch;
      }
    }
    processedLines.push(cleaned);
  }

  result = processedLines.join("\n");

  // Collapse multiple whitespace into single space
  result = result.replace(/[ \t]+/g, " ");

  // Remove whitespace around certain characters
  result = result.replace(/\s*([{}();\[\],:=><+\-*/%!&|?])\s*/g, "$1");

  // Restore space after keywords that need it
  const keywords = [
    "var ", "let ", "const ", "return ", "typeof ", "instanceof ",
    "new ", "delete ", "throw ", "case ", "in ", "of ", "void ",
    "else ", "export ", "import ", "from ", "class ", "extends ",
    "function ", "yield ", "await ",
  ];
  for (const kw of keywords) {
    const stripped = kw.trim();
    const regex = new RegExp(`\\b${stripped}\\b(?=[^\\s;{}()\\[\\]])`, "g");
    result = result.replace(regex, kw);
  }

  // Remove empty lines
  result = result.replace(/\n\s*\n/g, "\n");

  // Trim
  result = result.trim();

  return result;
}

export function JsMinifier() {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  const handleMinify = () => {
    if (!input.trim()) {
      toast({ title: "Input is empty", description: "Please enter JavaScript to minify." });
      return;
    }
    const minified = minifyJs(input);
    setOutput(minified);
    toast({ title: "Minified!", description: "JavaScript minified successfully." });
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
  };

  const originalSize = new Blob([input]).size;
  const minifiedSize = new Blob([output]).size;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson className="size-5" />
          JavaScript Minifier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Input JavaScript</Label>
            <Textarea
              className="min-h-64 font-mono text-sm"
              placeholder="function hello() { console.log('Hello'); }"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Minified Output</Label>
            <Textarea
              className="min-h-64 font-mono text-sm"
              placeholder="Minified JavaScript..."
              value={output}
              readOnly
            />
          </div>
        </div>

        {output && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Original: <Badge variant="secondary">{formatBytes(originalSize)}</Badge></span>
            <span>Minified: <Badge variant="secondary">{formatBytes(minifiedSize)}</Badge></span>
            {originalSize > 0 && (
              <span>
                Saved:{" "}
                <Badge variant="default">
                  {((1 - minifiedSize / originalSize) * 100).toFixed(1)}%
                </Badge>
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleMinify}>
            <Minimize2 className="size-4" />
            Minify
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
          {output && (
            <Button
              variant="outline"
              onClick={() => copyToClipboard(output, "JavaScript", toast)}
            >
              <Copy className="size-4" />
              Copy
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() =>
              downloadAsFile(output, "minified.js", "application/javascript", toast)
            }
            disabled={!output}
          >
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 5. Base64 Encoder ────────────────────────────────────────────────

function textToBase64(text: string): string {
  // Handle Unicode properly
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export function Base64Encoder() {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleEncode = () => {
    if (!input.trim()) {
      toast({ title: "Input is empty", description: "Please enter text or upload a file." });
      return;
    }
    const encoded = textToBase64(input);
    setOutput(encoded);
    toast({ title: "Encoded!", description: "Text encoded to Base64." });
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setFileName(null);
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInput(text);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="size-5" />
          Base64 Encoder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Input Text</Label>
            <Textarea
              className="min-h-48 font-mono text-sm"
              placeholder="Enter text to encode..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setFileName(null);
              }}
            />
            <div
              className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 transition-colors ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Drag &amp; drop a file here, or{" "}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              {fileName && (
                <Badge variant="secondary">{fileName}</Badge>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Base64 Output</Label>
            <Textarea
              className="min-h-48 font-mono text-sm"
              placeholder="Base64 encoded string..."
              value={output}
              readOnly
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleEncode}>
            <Lock className="size-4" />
            Encode
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
          {output && (
            <Button
              variant="outline"
              onClick={() => copyToClipboard(output, "Base64", toast)}
            >
              <Copy className="size-4" />
              Copy
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() =>
              downloadAsFile(output, "encoded-base64.txt", "text/plain", toast)
            }
            disabled={!output}
          >
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 6. Base64 Decoder ────────────────────────────────────────────────

function base64ToText(base64: string): string {
  // Handle Unicode properly
  const binary = atob(base64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function isLikelyPrintableText(str: string): boolean {
  // Check if the decoded content is mostly printable text
  let printable = 0;
  for (let i = 0; i < Math.min(str.length, 500); i++) {
    const code = str.charCodeAt(i);
    if (
      (code >= 32 && code <= 126) ||
      code === 9 ||
      code === 10 ||
      code === 13 ||
      code >= 128
    ) {
      printable++;
    }
  }
  return printable / Math.min(str.length, 500) > 0.85;
}

export function Base64Decoder() {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [isBinary, setIsBinary] = React.useState(false);
  const [decodeError, setDecodeError] = React.useState<string | null>(null);

  const handleDecode = () => {
    if (!input.trim()) {
      toast({ title: "Input is empty", description: "Please enter a Base64 string." });
      return;
    }
    setDecodeError(null);
    try {
      const decoded = base64ToText(input);
      const binary = !isLikelyPrintableText(decoded);
      setIsBinary(binary);
      setOutput(decoded);
      toast({
        title: "Decoded!",
        description: binary
          ? "Binary content detected. Use Download to save as file."
          : "Base64 decoded successfully.",
      });
    } catch {
      setDecodeError("Invalid Base64 string. Please check your input.");
      setOutput("");
      setIsBinary(false);
      toast({
        title: "Decode Error",
        description: "Invalid Base64 string.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setIsBinary(false);
    setDecodeError(null);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "decoded-file";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded!", description: "Decoded file saved." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Unlock className="size-5" />
          Base64 Decoder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Base64 Input</Label>
            <Textarea
              className="min-h-48 font-mono text-sm"
              placeholder="SGVsbG8gV29ybGQ="
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Decoded Output</Label>
              {isBinary && (
                <Badge variant="secondary" className="gap-1">
                  <AlertTriangle className="size-3" />
                  Binary
                </Badge>
              )}
            </div>
            <Textarea
              className="min-h-48 font-mono text-sm"
              placeholder="Decoded content..."
              value={output}
              readOnly
            />
          </div>
        </div>

        {decodeError && (
          <p className="text-sm text-destructive">{decodeError}</p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleDecode}>
            <Unlock className="size-4" />
            Decode
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
          {output && !isBinary && (
            <Button
              variant="outline"
              onClick={() => copyToClipboard(output, "Decoded text", toast)}
            >
              <Copy className="size-4" />
              Copy
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!output}
          >
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 7. URL Encoder ───────────────────────────────────────────────────

export function UrlEncoder() {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  const handleEncode = () => {
    if (!input.trim()) {
      toast({ title: "Input is empty", description: "Please enter a URL or text to encode." });
      return;
    }
    const encoded = encodeURIComponent(input);
    setOutput(encoded);
    toast({ title: "Encoded!", description: "URL-encoded successfully." });
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="size-5" />
          URL Encoder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Input Text / URL</Label>
            <Textarea
              className="min-h-48 font-mono text-sm"
              placeholder="Hello World & foo=bar"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>URL-Encoded Output</Label>
            <Textarea
              className="min-h-48 font-mono text-sm"
              placeholder="URL-encoded string..."
              value={output}
              readOnly
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleEncode}>
            <Link className="size-4" />
            Encode
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
          {output && (
            <Button
              variant="outline"
              onClick={() => copyToClipboard(output, "Encoded URL", toast)}
            >
              <Copy className="size-4" />
              Copy
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 8. URL Decoder ───────────────────────────────────────────────────

export function UrlDecoder() {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [decodeError, setDecodeError] = React.useState<string | null>(null);

  const handleDecode = () => {
    if (!input.trim()) {
      toast({ title: "Input is empty", description: "Please enter a URL-encoded string." });
      return;
    }
    setDecodeError(null);
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      toast({ title: "Decoded!", description: "URL decoded successfully." });
    } catch {
      setDecodeError("Invalid URL-encoded string. Check for malformed percent-encoding.");
      setOutput("");
      toast({
        title: "Decode Error",
        description: "Invalid URL-encoded string.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setDecodeError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Unlink className="size-5" />
          URL Decoder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>URL-Encoded Input</Label>
            <Textarea
              className="min-h-48 font-mono text-sm"
              placeholder="Hello%20World%20%26%20foo%3Dbar"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Decoded Output</Label>
            <Textarea
              className="min-h-48 font-mono text-sm"
              placeholder="Decoded string..."
              value={output}
              readOnly
            />
          </div>
        </div>

        {decodeError && (
          <p className="text-sm text-destructive">{decodeError}</p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleDecode}>
            <Unlink className="size-4" />
            Decode
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
          {output && (
            <Button
              variant="outline"
              onClick={() => copyToClipboard(output, "Decoded URL", toast)}
            >
              <Copy className="size-4" />
              Copy
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}