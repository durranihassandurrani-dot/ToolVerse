"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Type,
  Hash,
  AlignLeft,
  Copy,
  RotateCcw,
  BookOpen,
  Clock,
  MessageSquare,
  FileText,
  CaseSensitive,
  Binary,
  ArrowDownAZ,
  ArrowUpAZ,
} from "lucide-react";

// ─── Helper ───────────────────────────────────────────────────────────
function copyToClipboard(
  text: string,
  label: string,
  toast: ReturnType<typeof useToast>["toast"]
) {
  navigator.clipboard.writeText(text).then(() => {
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  });
}

// ─── 1. Word Counter ─────────────────────────────────────────────────
export function WordCounter() {
  const [text, setText] = React.useState("");

  const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
  const wordCount = words.length;
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, "").length;
  const sentences =
    text.trim() === ""
      ? 0
      : text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs =
    text.trim() === ""
      ? 0
      : text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length ||
        (text.trim().length > 0 ? 1 : 0);
  const avgWordLength =
    wordCount > 0
      ? (
          words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, "").length, 0) /
          wordCount
        ).toFixed(1)
      : "0";
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));
  const speakingTimeMin = Math.max(1, Math.ceil(wordCount / 130));

  const stats = [
    {
      label: "Words",
      value: wordCount,
      icon: <Type className="size-4 text-muted-foreground" />,
    },
    {
      label: "Characters",
      value: charCount,
      icon: <Hash className="size-4 text-muted-foreground" />,
    },
    {
      label: "Characters (no spaces)",
      value: charNoSpaces,
      icon: <Binary className="size-4 text-muted-foreground" />,
    },
    {
      label: "Sentences",
      value: sentences,
      icon: <MessageSquare className="size-4 text-muted-foreground" />,
    },
    {
      label: "Paragraphs",
      value: paragraphs,
      icon: <AlignLeft className="size-4 text-muted-foreground" />,
    },
    {
      label: "Avg Word Length",
      value: avgWordLength,
      icon: <CaseSensitive className="size-4 text-muted-foreground" />,
    },
    {
      label: "Reading Time",
      value: wordCount === 0 ? "0 min" : `${readingTimeMin} min`,
      icon: <BookOpen className="size-4 text-muted-foreground" />,
    },
    {
      label: "Speaking Time",
      value: wordCount === 0 ? "0 min" : `${speakingTimeMin} min`,
      icon: <Clock className="size-4 text-muted-foreground" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Word Counter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[200px] resize-y text-base"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              {stat.icon}
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 2. Character Counter ────────────────────────────────────────────
export function CharacterCounter() {
  const [text, setText] = React.useState("");

  const totalChars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const lettersOnly = (text.match(/[a-zA-Z]/g) || []).length;
  const digitsOnly = (text.match(/[0-9]/g) || []).length;
  const specialChars = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  const uppercase = (text.match(/[A-Z]/g) || []).length;
  const lowercase = (text.match(/[a-z]/g) || []).length;

  const stats = [
    { label: "Total Characters", value: totalChars },
    { label: "Without Spaces", value: charsNoSpaces },
    { label: "Letters Only", value: lettersOnly },
    { label: "Digits Only", value: digitsOnly },
    { label: "Special Characters", value: specialChars },
    { label: "Uppercase", value: uppercase },
    { label: "Lowercase", value: lowercase },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="size-5" />
          Character Counter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[160px] resize-y text-base"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border p-3 text-center"
            >
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 3. Case Converter ───────────────────────────────────────────────
export function CaseConverter() {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  function toUpperCase(t: string) {
    return t.toUpperCase();
  }

  function toLowerCase(t: string) {
    return t.toLowerCase();
  }

  function toTitleCase(t: string) {
    return t.replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    );
  }

  function toSentenceCase(t: string) {
    return t
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
  }

  function toToggleCase(t: string) {
    return t
      .split("")
      .map((c) =>
        c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
      )
      .join("");
  }

  function toCamelCase(t: string) {
    return t
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
  }

  function toPascalCase(t: string) {
    const camel = toCamelCase(t);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }

  function toSnakeCase(t: string) {
    return t
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/[\s\-]+/g, "_")
      .toLowerCase();
  }

  function toKebabCase(t: string) {
    return t
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  }

  const conversions = [
    { label: "UPPERCASE", fn: toUpperCase },
    { label: "lowercase", fn: toLowerCase },
    { label: "Title Case", fn: toTitleCase },
    { label: "Sentence case", fn: toSentenceCase },
    { label: "tOGGLE cASE", fn: toToggleCase },
    { label: "camelCase", fn: toCamelCase },
    { label: "PascalCase", fn: toPascalCase },
    { label: "snake_case", fn: toSnakeCase },
    { label: "kebab-case", fn: toKebabCase },
  ];

  function applyConversion(fn: (t: string) => string) {
    const result = fn(input);
    setOutput(result);
    setInput(result);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CaseSensitive className="size-5" />
          Case Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Type or paste your text here..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOutput("");
          }}
          className="min-h-[140px] resize-y text-base"
        />

        <div className="flex flex-wrap gap-2">
          {conversions.map((c) => (
            <Button
              key={c.label}
              variant="outline"
              size="sm"
              onClick={() => applyConversion(c.fn)}
              disabled={input.trim() === ""}
            >
              {c.label}
            </Button>
          ))}
        </div>

        {output && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Preview
              </Label>
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="whitespace-pre-wrap break-words text-sm">
                  {output}
                </p>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              copyToClipboard(input, "Text", toast)
            }
            disabled={input.trim() === ""}
          >
            <Copy className="size-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setInput("");
              setOutput("");
            }}
            disabled={input.trim() === ""}
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}