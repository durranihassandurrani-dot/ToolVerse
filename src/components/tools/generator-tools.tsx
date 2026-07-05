"use client";

import * as React from "react";
import QRCode from "qrcode";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Key,
  QrCode,
  Barcode,
  Palette,
  Paintbrush,
  Fingerprint,
  FileText,
  Copy,
  RotateCcw,
  Download,
  RefreshCw,
  Shuffle,
  Eye,
  Wifi,
  Mail,
  Phone,
  Link,
  Type,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────
function copyToClipboard(
  text: string,
  label: string,
  toast: ReturnType<typeof useToast>["toast"]
) {
  navigator.clipboard.writeText(text).then(() => {
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  });
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── 1. Password Generator ───────────────────────────────────────────
export function PasswordGenerator() {
  const { toast } = useToast();
  const [length, setLength] = React.useState(16);
  const [useUpper, setUseUpper] = React.useState(true);
  const [useLower, setUseLower] = React.useState(true);
  const [useNumbers, setUseNumbers] = React.useState(true);
  const [useSymbols, setUseSymbols] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [bulkPasswords, setBulkPasswords] = React.useState<string[]>([]);

  function generate(): string {
    let chars = "";
    if (useUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (useNumbers) chars += "0123456789";
    if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (chars.length === 0) {
      chars = "abcdefghijklmnopqrstuvwxyz";
    }
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (n) => chars[n % chars.length]).join("");
  }

  function handleGenerate() {
    const pw = generate();
    setPassword(pw);
    setBulkPasswords([]);
  }

  function handleBulkGenerate() {
    const pws = Array.from({ length: 5 }, () => generate());
    setPassword(pws[0]);
    setBulkPasswords(pws);
  }

  function getStrength(pw: string): { label: string; color: string; pct: number } {
    if (!pw) return { label: "None", color: "bg-muted", pct: 0 };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (pw.length >= 20) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    if (score <= 2) return { label: "Weak", color: "bg-red-500", pct: 25 };
    if (score <= 3) return { label: "Medium", color: "bg-yellow-500", pct: 50 };
    if (score <= 5) return { label: "Strong", color: "bg-green-500", pct: 75 };
    return { label: "Very Strong", color: "bg-emerald-600", pct: 100 };
  }

  const strength = getStrength(password);

  React.useEffect(() => {
    handleGenerate();
  }, []);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="size-5" />
          Password Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Length slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Length</Label>
            <span className="text-sm font-mono font-semibold">{length}</span>
          </div>
          <Slider
            value={[length]}
            onValueChange={([v]) => setLength(v)}
            min={4}
            max={128}
            step={1}
          />
        </div>

        {/* Character type checkboxes */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={useUpper} onCheckedChange={(v) => setUseUpper(!!v)} />
            Uppercase (A-Z)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={useLower} onCheckedChange={(v) => setUseLower(!!v)} />
            Lowercase (a-z)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={useNumbers} onCheckedChange={(v) => setUseNumbers(!!v)} />
            Numbers (0-9)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={useSymbols} onCheckedChange={(v) => setUseSymbols(!!v)} />
            Symbols (!@#$)
          </label>
        </div>

        {/* Generated password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Generated Password</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(password, "Password", toast)}
              disabled={!password}
            >
              <Copy className="size-4" />
              Copy
            </Button>
          </div>
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="break-all font-mono text-sm">{password}</p>
          </div>
          {/* Strength meter */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Strength</span>
              <span className="font-medium">{strength.label}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${strength.color}`}
                style={{ width: `${strength.pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bulk passwords */}
        {bulkPasswords.length > 0 && (
          <div className="space-y-2">
            <Label>Generated Passwords</Label>
            <div className="space-y-1 rounded-lg border bg-muted/50 p-3">
              {bulkPasswords.map((pw, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <p className="break-all font-mono text-xs">{pw}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0"
                    onClick={() => copyToClipboard(pw, `Password ${i + 1}`, toast)}
                  >
                    <Copy className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleGenerate}>
            <RefreshCw className="size-4" />
            Generate
          </Button>
          <Button variant="outline" onClick={handleBulkGenerate}>
            <Shuffle className="size-4" />
            Generate 5 Passwords
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 2. QR Code Generator ────────────────────────────────────────────
export function QRCodeGenerator() {
  const { toast } = useToast();
  const [content, setContent] = React.useState("https://example.com");
  const [type, setType] = React.useState("url");
  const [size, setSize] = React.useState(256);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  function getContent() {
    switch (type) {
      case "url":
        return content;
      case "email":
        return `mailto:${content}`;
      case "phone":
        return `tel:${content}`;
      case "wifi":
        return `WIFI:T:WPA;S:${content};;`;
      default:
        return content;
    }
  }

  React.useEffect(() => {
    if (!canvasRef.current) return;
    const data = getContent();
    if (!data) return;
    QRCode.toCanvas(canvasRef.current, data, {
      width: size,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });
  }, [content, type, size]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast({ title: "Downloaded!", description: "QR code saved as PNG." });
  }

  const typeOptions = [
    { value: "text", label: "Text", icon: <Type className="size-4" /> },
    { value: "url", label: "URL", icon: <Link className="size-4" /> },
    { value: "email", label: "Email", icon: <Mail className="size-4" /> },
    { value: "phone", label: "Phone", icon: <Phone className="size-4" /> },
    { value: "wifi", label: "WiFi", icon: <Wifi className="size-4" /> },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="size-5" />
          QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <Label>Content</Label>
            <Input
              placeholder={
                type === "email"
                  ? "user@example.com"
                  : type === "phone"
                    ? "+1234567890"
                    : type === "wifi"
                      ? "NetworkName"
                      : "Enter text or URL..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex flex-wrap gap-1.5">
              {typeOptions.map((opt) => (
                <Button
                  key={opt.value}
                  variant={type === opt.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setType(opt.value)}
                >
                  {opt.icon}
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Size: {size}px</Label>
            <Select
              value={String(size)}
              onValueChange={(v) => setSize(Number(v))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="128">128 x 128</SelectItem>
                <SelectItem value="256">256 x 256</SelectItem>
                <SelectItem value="512">512 x 512</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-lg border bg-white p-4">
            <canvas ref={canvasRef} />
          </div>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="size-4" />
            Download PNG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 3. Barcode Generator ────────────────────────────────────────────
export function BarcodeGenerator() {
  const { toast } = useToast();
  const [text, setText] = React.useState("123456789012");
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Simple CODE128 encoder (Set B)
  function encodeCODE128(data: string): number[] {
    const CODE128B_START = 104;
    const CODE128_STOP = 106;
    const codes: number[] = [CODE128B_START];

    let checksum = CODE128B_START;
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i);
      if (charCode < 32 || charCode > 127) continue;
      const value = charCode - 32;
      codes.push(value);
      checksum += value * (i + 1);
    }
    checksum = checksum % 103;
    codes.push(checksum);
    codes.push(CODE128_STOP);
    return codes;
  }

  // CODE128 bar patterns (each code maps to 6 bars: 3 black + 3 white)
  const CODE128_PATTERNS: string[] = [
    "212222","222122","222221","121223","121322","131222","122213","122312",
    "132212","221213","221312","231212","112232","122132","122231","113222",
    "123122","123221","223211","221132","221231","213212","223112","312131",
    "311222","321122","321221","312212","322112","322211","212123","212321",
    "232121","111323","131123","131321","112313","132113","132311","211313",
    "231113","231311","112133","112331","132131","113123","113321","133121",
    "313121","211331","231131","213113","213311","213131","311123","311321",
    "331121","312113","312311","332111","314111","221411","431111","111224",
    "111422","121124","121421","141122","141221","112214","112412","122114",
    "122411","142112","142211","241211","221114","413111","241112","134111",
    "111242","121142","121241","114212","124112","124211","411212","421112",
    "421211","212141","214121","412121","111143","111341","131141","114113",
    "114311","411113","411311","113141","114131","311141","411131","211412",
    "211214","211232","2331112"
  ];

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const barWidth = 2;
    const height = 100;
    const quietZone = 20;
    const codes = encodeCODE128(text);
    let totalModules = 0;

    for (const code of codes) {
      const pattern = CODE128_PATTERNS[code] || "222222";
      for (const ch of pattern) {
        totalModules += Number(ch);
      }
    }

    canvas.width = totalModules * barWidth + quietZone * 2;
    canvas.height = height + quietZone * 2;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let x = quietZone;
    ctx.fillStyle = "#000000";

    for (const code of codes) {
      const pattern = CODE128_PATTERNS[code] || "222222";
      let isBlack = true;
      for (const ch of pattern) {
        const w = Number(ch) * barWidth;
        if (isBlack) {
          ctx.fillRect(x, quietZone, w, height);
        }
        x += w;
        isBlack = !isBlack;
      }
    }
  }, [text]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "barcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast({ title: "Downloaded!", description: "Barcode saved as PNG." });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Barcode className="size-5" />
          Barcode Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Text to Encode (CODE128)</Label>
          <Input
            placeholder="Enter text to encode..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-lg border bg-white p-4">
            <canvas ref={canvasRef} />
          </div>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="size-4" />
            Download PNG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 4. Color Picker ─────────────────────────────────────────────────
export function ColorPicker() {
  const { toast } = useToast();
  const [hex, setHex] = React.useState("#6366f1");
  const inputRef = React.useRef<HTMLInputElement>(null);

  function hexToRgb(h: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  function rgbToHsl(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  function hslToRgb(
    h: number,
    s: number,
    l: number
  ): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;
    let r: number, g: number, b: number;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  function rgbToHex(r: number, g: number, b: number): string {
    return (
      "#" +
      [r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  function handleHexChange(value: string) {
    if (/^#[0-9a-fA-F]{0,6}$/.test(value)) {
      setHex(value);
    }
  }

  function handleHslChange(h: number, s: number, l: number) {
    const newRgb = hslToRgb(h, s, l);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  function getContrastColor(h: string) {
    const { r, g, b } = hexToRgb(h);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="size-5" />
          Color Picker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color preview */}
        <div className="flex items-center gap-4">
          <button
            className="size-20 rounded-xl border-2 border-border shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: hex }}
            onClick={() => inputRef.current?.click()}
            title="Click to use eyedropper"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click swatch for eyedropper
              </span>
            </div>
            <input
              ref={inputRef}
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="size-0 opacity-0 absolute"
              tabIndex={-1}
            />
          </div>
        </div>

        <Separator />

        {/* HEX */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">HEX</p>
            <p className="font-mono text-sm">{hex}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(hex, "HEX", toast)}
          >
            <Copy className="size-3" />
            Copy
          </Button>
        </div>

        {/* RGB */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">RGB</p>
            <p className="font-mono text-sm">{rgbStr}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(rgbStr, "RGB", toast)}
          >
            <Copy className="size-3" />
            Copy
          </Button>
        </div>

        {/* HSL */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">HSL</p>
            <p className="font-mono text-sm">{hslStr}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(hslStr, "HSL", toast)}
          >
            <Copy className="size-3" />
            Copy
          </Button>
        </div>

        <Separator />

        {/* HEX input */}
        <div className="space-y-2">
          <Label>HEX Input</Label>
          <Input
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            maxLength={7}
            className="font-mono"
          />
        </div>

        {/* HSL sliders */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Hue</Label>
              <span className="text-xs font-mono text-muted-foreground">
                {hsl.h}°
              </span>
            </div>
            <Slider
              value={[hsl.h]}
              onValueChange={([v]) => handleHslChange(v, hsl.s, hsl.l)}
              min={0}
              max={360}
              step={1}
              className="[&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-red-500 [&_[data-slot=slider-range]]:via-green-500 [&_[data-slot=slider-range]]:to-blue-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Saturation</Label>
              <span className="text-xs font-mono text-muted-foreground">
                {hsl.s}%
              </span>
            </div>
            <Slider
              value={[hsl.s]}
              onValueChange={([v]) => handleHslChange(hsl.h, v, hsl.l)}
              min={0}
              max={100}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Lightness</Label>
              <span className="text-xs font-mono text-muted-foreground">
                {hsl.l}%
              </span>
            </div>
            <Slider
              value={[hsl.l]}
              onValueChange={([v]) => handleHslChange(hsl.h, hsl.s, v)}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 5. Color Palette Generator ──────────────────────────────────────

// Approximate color name from hue/saturation/lightness
function getColorName(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d < 0.05) {
    if (l < 0.1) return "Black";
    if (l < 0.2) return "Charcoal";
    if (l > 0.95) return "White";
    if (l > 0.8) return "Light Gray";
    if (l > 0.5) return "Gray";
    return "Dark Gray";
  }
  const s = d / (1 - Math.abs(2 * l - 1));
  if (s < 0.15) {
    if (l < 0.15) return "Near Black";
    if (l > 0.85) return "Near White";
    return "Gray";
  }
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;

  const prefix = l < 0.35 ? "Dark " : l > 0.7 ? "Light " : "";
  const satPrefix = s < 0.5 ? "Muted " : "";

  if (h < 15) return `${prefix}Red`;
  if (h < 35) return `${prefix}Orange`;
  if (h < 50) return `${prefix}${satPrefix}Yellow`;
  if (h < 70) return `${prefix}${satPrefix}Lime`;
  if (h < 150) return `${prefix}Green`;
  if (h < 170) return `${prefix}Teal`;
  if (h < 195) return `${prefix}Cyan`;
  if (h < 250) return `${prefix}Blue`;
  if (h < 280) return `${prefix}Purple`;
  if (h < 320) return `${prefix}Magenta`;
  if (h < 345) return `${prefix}Pink`;
  return `${prefix}Red`;
}

function generatePalette(): string[] {
  const baseHue = Math.random() * 360;
  const strategies = [
    // Analogous
    () => {
      const offset = Math.random() * 30 + 10;
      return Array.from({ length: 5 }, (_, i) => {
        const h = (baseHue + i * offset) % 360;
        const s = 60 + Math.random() * 30;
        const l = 35 + i * 10 + Math.random() * 5;
        return hslToHexColor(h, s, l);
      });
    },
    // Complementary
    () => {
      const comp = (baseHue + 180) % 360;
      const hues = [
        baseHue,
        (baseHue + 30) % 360,
        (baseHue + 330) % 360,
        comp,
        (comp + 30) % 360,
      ];
      return hues.map((h, i) => hslToHexColor(h, 65 + Math.random() * 20, 40 + i * 8));
    },
    // Triadic
    () => {
      const h2 = (baseHue + 120) % 360;
      const h3 = (baseHue + 240) % 360;
      const hues = [
        baseHue,
        (baseHue + 20) % 360,
        h2,
        h3,
        (h3 + 20) % 360,
      ];
      return hues.map((h, i) => hslToHexColor(h, 60 + Math.random() * 25, 40 + i * 7));
    },
    // Monochromatic
    () =>
      Array.from({ length: 5 }, (_, i) =>
        hslToHexColor(baseHue, 55 + Math.random() * 30, 25 + i * 15)
      ),
  ];
  return strategies[Math.floor(Math.random() * strategies.length)]();
}

function hslToHexColor(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return (
    "#" +
    [r, g, b]
      .map((x) => Math.round(x * 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function ColorPaletteGenerator() {
  const { toast } = useToast();
  const [palette, setPalette] = React.useState<string[]>(() => generatePalette());

  function handleGenerate() {
    setPalette(generatePalette());
  }

  function handleCopyAll() {
    copyToClipboard(palette.join("\n"), "All colors", toast);
  }

  function getContrastColor(h: string) {
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="size-5" />
          Color Palette Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-5 gap-2">
          {palette.map((color, i) => (
            <button
              key={i}
              className="group relative flex min-h-[200px] flex-col items-center justify-end rounded-xl border transition-transform hover:scale-[1.02] hover:shadow-lg"
              style={{ backgroundColor: color }}
              onClick={() => copyToClipboard(color, `Color ${i + 1}`, toast)}
              title={`Click to copy ${color}`}
            >
              <div
                className="w-full rounded-b-[10px] p-3 text-center transition-colors"
                style={{
                  backgroundColor: "rgba(0,0,0,0.35)",
                  color: "#ffffff",
                }}
              >
                <p className="font-mono text-xs font-bold">{color}</p>
                <p className="mt-0.5 text-[10px] opacity-80">
                  {getColorName(color)}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleGenerate}>
            <RefreshCw className="size-4" />
            Generate New
          </Button>
          <Button variant="outline" onClick={handleCopyAll}>
            <Copy className="size-4" />
            Copy All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 6. UUID Generator ───────────────────────────────────────────────
export function UUIDGenerator() {
  const { toast } = useToast();
  const [current, setCurrent] = React.useState(generateUUID());
  const [history, setHistory] = React.useState<string[]>([]);

  function handleGenerate(count: number = 1) {
    const newUuids = Array.from({ length: count }, () => generateUUID());
    setCurrent(newUuids[0]);
    setHistory((prev) => [...newUuids.reverse(), ...prev].slice(0, 10));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="size-5" />
          UUID Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current UUID */}
        <div className="space-y-2">
          <Label>Generated UUID v4</Label>
          <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/50 p-4">
            <p className="break-all font-mono text-sm">{current}</p>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => copyToClipboard(current, "UUID", toast)}
            >
              <Copy className="size-4" />
            </Button>
          </div>
        </div>

        {/* Generate buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleGenerate(1)}>
            <RefreshCw className="size-4" />
            Generate UUID
          </Button>
          {[
            { count: 1, label: "1" },
            { count: 5, label: "5" },
            { count: 10, label: "10" },
            { count: 25, label: "25" },
          ].map((opt) => (
            <Button
              key={opt.count}
              variant="outline"
              size="sm"
              onClick={() => handleGenerate(opt.count)}
            >
              Bulk: {opt.label}
            </Button>
          ))}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-2">
            <Label>History (last 10)</Label>
            <div className="space-y-1 rounded-lg border p-3">
              {history.map((uuid, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <p className="truncate font-mono text-xs">{uuid}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0"
                    onClick={() => copyToClipboard(uuid, "UUID", toast)}
                  >
                    <Copy className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 7. Lorem Ipsum Generator ────────────────────────────────────────
const LOREM_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.",
  "Praesent dapibus, neque id cursus faucibus, tortor neque egestas auguae, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend.",
  "Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci.",
  "Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit.",
  "Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras varius, urna in tincidunt dapibus, nisl nisl gravida lacus, id commodo tortor nisl et lacus. Vivamus consectetuer hendrerit lacus.",
  "Sed hendrerit. dolor at augue. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.",
  "In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.",
  "Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.",
  "Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.",
  "Nulla facilisi. Etiam dignissim diam at enim. Ut tincidunt tortor. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce aliquet pede non pede. Suspendisse dapibus lorem pellentesque magna. Integer nulla. Donec blandit feugiat ligula. Donec hendrerit, felis et imperdiet euismod, purus ipsum pretium metus, in lacinia nulla nisl eget sapien.",
  "Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Fusce vel dui. Sed in libero ut nibh placerat accumsan. Proin faucibus arcu quis ante. In consectetuer turpis ut velit. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed vestibulum sit amet cursus id turpis.",
  "Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus.",
  "Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.",
  "Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet.",
  "Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante sed lacinia. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
  "Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Fusce id purus. Ut varius tincidunt libero. Phasellus dolor.",
  "Maecenas vestibulum mollis diam. Pellentesque ut neque. Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis.",
];

const LOREM_SENTENCES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
  "Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
  "Integer in mauris eu nibh euismod gravida.",
  "Praesent dapibus, neque id cursus faucibus, tortor neque egestas auguae, eu vulputate magna eros eu erat.",
  "Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.",
  "Phasellus ultrices nulla quis nibh. Quisque a lectus.",
  "Donec consectetuer ligula vulputate sem tristique cursus.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  "Proin pharetra nonummy pede. Mauris et orci.",
  "Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.",
  "Vestibulum volutpat pretium libero. Cras id dui.",
  "Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede.",
  "Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis.",
  "Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi.",
  "Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo.",
];

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit",
  "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat",
  "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt",
  "mollit", "anim", "id", "est", "laborum", "curabitur", "pretium", "tincidunt",
  "lacus", "nulla", "gravida", "orci", "odio", "varius", "turpis", "pharetra",
  "eros", "bibendum", "nec", "luctus", "felis", "sollicitudin", "mauris", "integer",
  "nibh", "euismod", "gravida", "praesent", "dapibus", "neque", "cursus",
  "faucibus", "tortor", "egestas", "augue", "vulputate", "erat", "aliquam",
  "volutpat", "nam", "dui", "mi", "accumsan", "porttitor", "facilisis", "metus",
  "phasellus", "ultrices", "quis", "lectus", "donec", "consectetuer", "ligula",
  "tristique", "cursus", "pellentesque", "habitant", "morbi", "senectus", "netus",
  "malesuada", "fames", "ac", "turpis", "egestas", "proin", "nonummy", "pede",
  "aenean", "lorem", "porttitor", "laoreet", "augue", "suspendisse", "purus",
  "scelerisque", "vulputate", "vitae", "pretium", "mattis", "nunc", "eget",
  "neque", "semper", "libero", "sit", "amet", "adipiscing", "sem", "neque",
  "sed", "ipsum",
];

export function LoremIpsumGenerator() {
  const { toast } = useToast();
  const [count, setCount] = React.useState(3);
  const [type, setType] = React.useState<"paragraphs" | "sentences" | "words">(
    "paragraphs"
  );
  const [output, setOutput] = React.useState("");

  function generate() {
    let result = "";
    if (type === "paragraphs") {
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        paras.push(LOREM_PARAGRAPHS[i % LOREM_PARAGRAPHS.length]);
      }
      result = paras.join("\n\n");
    } else if (type === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(LOREM_SENTENCES[i % LOREM_SENTENCES.length]);
      }
      result = sentences.join(" ");
    } else {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
      }
      result = words.join(" ");
    }
    setOutput(result);
  }

  React.useEffect(() => {
    generate();
  }, [type, count]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Lorem Ipsum Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-1.5">
              {(["paragraphs", "sentences", "words"] as const).map((t) => (
                <Button
                  key={t}
                  variant={type === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setType(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Count: {count}</Label>
            <Slider
              value={[count]}
              onValueChange={([v]) => setCount(v)}
              min={1}
              max={20}
              step={1}
              className="w-[180px]"
            />
          </div>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Output</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(output, "Lorem Ipsum", toast)}
              disabled={!output}
            >
              <Copy className="size-4" />
              Copy
            </Button>
          </div>
          <div className="max-h-[400px] overflow-y-auto rounded-lg border bg-muted/50 p-4">
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {output}
            </p>
          </div>
        </div>

        <Button onClick={generate}>
          <RefreshCw className="size-4" />
          Generate
        </Button>
      </CardContent>
    </Card>
  );
}