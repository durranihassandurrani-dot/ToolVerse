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
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Copy, Palette } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────

function copyToClipboard(
  text: string,
  label: string,
  toast: ReturnType<typeof useToast>["toast"]
) {
  navigator.clipboard.writeText(text).then(() => {
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  });
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let clean = hex.replace(/^#/, "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      case bn:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function isValidHex(hex: string): boolean {
  const clean = hex.replace(/^#/, "");
  return /^[0-9a-fA-F]{3}$/.test(clean) || /^[0-9a-fA-F]{6}$/.test(clean);
}

function rgbCssString(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}

function hslCssString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Shared copy row component
function CopyRow({
  label,
  value,
  toastFn,
}: {
  label: string;
  value: string;
  toastFn: ReturnType<typeof useToast>["toast"];
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm">{value}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={() => copyToClipboard(value, label, toastFn)}
      >
        <Copy className="size-4" />
        <span className="sr-only">Copy {label}</span>
      </Button>
    </div>
  );
}

// ─── 1. HexToRgb ────────────────────────────────────────────────────────

export function HexToRgb() {
  const { toast } = useToast();
  const [hexInput, setHexInput] = React.useState("#ff6b35");
  const [nativeColor, setNativeColor] = React.useState("#ff6b35");

  const rgb = React.useMemo(() => {
    if (!isValidHex(hexInput)) return null;
    return hexToRgb(hexInput);
  }, [hexInput]);

  const hsl = React.useMemo(() => {
    if (!rgb) return null;
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
  }, [rgb]);

  const hexDisplay = React.useMemo(() => {
    if (!rgb) return null;
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }, [rgb]);

  const displayColor = rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : "#000000";

  function handleHexChange(value: string) {
    const v = value.startsWith("#") ? value : "#" + value;
    setHexInput(v);
    if (isValidHex(v)) {
      const parsed = hexToRgb(v);
      if (parsed) {
        setNativeColor(rgbToHex(parsed.r, parsed.g, parsed.b));
      }
    }
  }

  function handleNativeColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNativeColor(e.target.value);
    setHexInput(e.target.value);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="size-5 text-primary" />
          HEX to RGB Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input area */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="hex-input">HEX Color Code</Label>
            <Input
              id="hex-input"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#ff6b35"
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>Visual Picker</Label>
            <input
              type="color"
              value={nativeColor}
              onChange={handleNativeColorChange}
              className="h-9 w-14 cursor-pointer rounded-md border border-input"
            />
          </div>
        </div>

        {/* Color preview */}
        <div
          className="flex h-24 items-center justify-center rounded-xl border text-sm font-medium"
          style={{ backgroundColor: displayColor }}
        >
          <span
            className="rounded-md px-2 py-1"
            style={{
              color:
                (rgb?.r ?? 0) * 0.299 +
                  (rgb?.g ?? 0) * 0.587 +
                  (rgb?.b ?? 0) * 0.114 >
                150
                  ? "#000000"
                  : "#ffffff",
            }}
          >
            {hexDisplay ?? "Invalid HEX"}
          </span>
        </div>

        {/* Results */}
        {rgb && hsl && hexDisplay && (
          <div className="space-y-3">
            {/* RGB values */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium">RGB Values</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Red</p>
                  <p className="text-lg font-bold">{rgb.r}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Green</p>
                  <p className="text-lg font-bold">{rgb.g}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Blue</p>
                  <p className="text-lg font-bold">{rgb.b}</p>
                </div>
              </div>
            </div>

            {/* HSL values */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium">HSL Values</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Hue</p>
                  <p className="text-lg font-bold">{hsl.h}&deg;</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Saturation</p>
                  <p className="text-lg font-bold">{hsl.s}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Lightness</p>
                  <p className="text-lg font-bold">{hsl.l}%</p>
                </div>
              </div>
            </div>

            {/* Copyable formats */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Copy Formats</p>
              <CopyRow
                label="HEX"
                value={hexDisplay}
                toastFn={toast}
              />
              <CopyRow
                label="RGB"
                value={rgbCssString(rgb.r, rgb.g, rgb.b)}
                toastFn={toast}
              />
              <CopyRow
                label="HSL"
                value={hslCssString(hsl.h, hsl.s, hsl.l)}
                toastFn={toast}
              />
            </div>
          </div>
        )}

        {!rgb && hexInput.replace(/^#/, "").length > 0 && (
          <p className="text-sm text-destructive">
            Invalid HEX code. Use 3-digit (e.g. #f00) or 6-digit (e.g. #ff0000)
            format.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 2. RgbToHex ────────────────────────────────────────────────────────

export function RgbToHex() {
  const { toast } = useToast();
  const [r, setR] = React.useState(255);
  const [g, setG] = React.useState(107);
  const [b, setB] = React.useState(53);

  const hex = React.useMemo(() => rgbToHex(r, g, b), [r, g, b]);
  const hsl = React.useMemo(() => rgbToHsl(r, g, b), [r, g, b]);
  const nativeColor = hex;

  function handleNativeColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    const hexVal = e.target.value;
    const parsed = hexToRgb(hexVal);
    if (parsed) {
      setR(parsed.r);
      setG(parsed.g);
      setB(parsed.b);
    }
  }

  function clampAndSet(
    setter: (v: number) => void,
    value: string
  ) {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    setter(Math.max(0, Math.min(255, num)));
  }

  const luminance =
    r * 0.299 + g * 0.587 + b * 0.114;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="size-5 text-primary" />
          RGB to HEX Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual picker */}
        <div className="flex items-center gap-3">
          <Label htmlFor="rgb-color-input">Visual Picker</Label>
          <input
            id="rgb-color-input"
            type="color"
            value={nativeColor}
            onChange={handleNativeColorChange}
            className="h-9 w-14 cursor-pointer rounded-md border border-input"
          />
        </div>

        {/* Color preview */}
        <div
          className="flex h-24 items-center justify-center rounded-xl border text-sm font-medium"
          style={{ backgroundColor: hex }}
        >
          <span
            className="rounded-md px-2 py-1"
            style={{ color: luminance > 150 ? "#000000" : "#ffffff" }}
          >
            {hex.toUpperCase()}
          </span>
        </div>

        {/* RGB Sliders */}
        <div className="bg-muted/50 rounded-xl p-4 space-y-4">
          <p className="text-sm font-medium">RGB Channels</p>

          {/* Red */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-red-500" htmlFor="r-input">
                Red (R)
              </Label>
              <Input
                id="r-input"
                type="number"
                min={0}
                max={255}
                value={r}
                onChange={(e) => clampAndSet(setR, e.target.value)}
                className="w-20 text-right font-mono"
              />
            </div>
            <Slider
              value={[r]}
              onValueChange={([v]) => setR(v)}
              min={0}
              max={255}
              step={1}
              className="[&_[data-slot=slider-range]]:bg-red-500"
            />
          </div>

          {/* Green */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-green-500" htmlFor="g-input">
                Green (G)
              </Label>
              <Input
                id="g-input"
                type="number"
                min={0}
                max={255}
                value={g}
                onChange={(e) => clampAndSet(setG, e.target.value)}
                className="w-20 text-right font-mono"
              />
            </div>
            <Slider
              value={[g]}
              onValueChange={([v]) => setG(v)}
              min={0}
              max={255}
              step={1}
              className="[&_[data-slot=slider-range]]:bg-green-500"
            />
          </div>

          {/* Blue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-blue-500" htmlFor="b-input">
                Blue (B)
              </Label>
              <Input
                id="b-input"
                type="number"
                min={0}
                max={255}
                value={b}
                onChange={(e) => clampAndSet(setB, e.target.value)}
                className="w-20 text-right font-mono"
              />
            </div>
            <Slider
              value={[b]}
              onValueChange={([v]) => setB(v)}
              min={0}
              max={255}
              step={1}
              className="[&_[data-slot=slider-range]]:bg-blue-500"
            />
          </div>
        </div>

        {/* HSL Values */}
        <div className="bg-muted/50 rounded-xl p-4 space-y-2">
          <p className="text-sm font-medium">HSL Values</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Hue</p>
              <p className="text-lg font-bold">{hsl.h}&deg;</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Saturation</p>
              <p className="text-lg font-bold">{hsl.s}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Lightness</p>
              <p className="text-lg font-bold">{hsl.l}%</p>
            </div>
          </div>
        </div>

        {/* Copyable formats */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Copy Formats</p>
          <CopyRow
            label="HEX"
            value={hex}
            toastFn={toast}
          />
          <CopyRow
            label="RGB"
            value={rgbCssString(r, g, b)}
            toastFn={toast}
          />
          <CopyRow
            label="HSL"
            value={hslCssString(hsl.h, hsl.s, hsl.l)}
            toastFn={toast}
          />
        </div>
      </CardContent>
    </Card>
  );
}