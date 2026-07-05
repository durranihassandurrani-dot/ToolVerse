"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import JSZip from "jszip";
import {
  Upload,
  Download,
  FileText,
  Merge,
  Scissors,
  ArrowDownToLine,
  ArrowUpFromLine,
  Trash2,
  FileUp,
  FileDown,
  FileOutput,
  Minimize2,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadUint8Array(data: Uint8Array, filename: string, mimeType = "application/pdf") {
  const blob = new Blob([data], { type: mimeType });
  downloadBlob(blob, filename);
}

// ─── 1. PDF Merge ────────────────────────────────────────────────────

export function PdfMerge() {
  const { toast } = useToast();
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const [merging, setMerging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((f) =>
      f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (pdfFiles.length === 0) {
      toast({ title: "Error", description: "Please upload PDF files only." });
      return;
    }
    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    setFiles((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const merge = async () => {
    if (files.length < 2) {
      toast({ title: "Error", description: "Please add at least 2 PDF files." });
      return;
    }
    setMerging(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const result = await merged.save();
      downloadUint8Array(result, "merged.pdf");
      toast({ title: "Merged!", description: `Combined ${files.length} PDFs into one.` });
    } catch {
      toast({ title: "Error", description: "Failed to merge PDFs. They may be encrypted or corrupted." });
    } finally {
      setMerging(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Merge className="h-5 w-5" />
          PDF Merge
        </CardTitle>
        <CardDescription>
          Merge multiple PDFs into a single document
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(Array.from(e.dataTransfer.files));
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              const f = Array.from(e.target.files ?? []);
              if (f.length > 0) addFiles(f);
              e.target.value = "";
            }}
          />
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-8 w-8" />
            <p>Drop PDF files here or click to upload</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((f, i) => (
              <div
                key={`${f.name}-${i}`}
                className="flex items-center gap-2 p-2 rounded-md border bg-muted/30"
              >
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="flex-1 text-sm truncate">{f.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatBytes(f.size)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveFile(i, "up")}
                  disabled={i === 0}
                >
                  <ArrowUpFromLine className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveFile(i, "down")}
                  disabled={i === files.length - 1}
                >
                  <ArrowDownToLine className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => removeFile(i)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={merge}
          disabled={merging || files.length < 2}
          className="w-full"
        >
          {merging ? "Merging..." : `Merge ${files.length} PDFs`}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── 2. PDF Split ────────────────────────────────────────────────────

export function PdfSplit() {
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [totalPages, setTotalPages] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [mode, setMode] = React.useState<"all" | "range">("all");
  const [rangeFrom, setRangeFrom] = React.useState(1);
  const [rangeTo, setRangeTo] = React.useState(1);
  const [processing, setProcessing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const loadFile = async (f: File) => {
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const count = doc.getPageCount();
      setFile(f);
      setTotalPages(count);
      setRangeFrom(1);
      setRangeTo(count);
      toast({
        title: "PDF Loaded",
        description: `${f.name} has ${count} page${count !== 1 ? "s" : ""}.`,
      });
    } catch {
      toast({ title: "Error", description: "Failed to read PDF. It may be encrypted or corrupted." });
    }
  };

  const addFile = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (pdfFiles.length === 0) {
      toast({ title: "Error", description: "Please upload a PDF file." });
      return;
    }
    loadFile(pdfFiles[0]);
  };

  const splitAll = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const zip = new JSZip();
      const baseName = file.name.replace(/\.pdf$/i, "");

      for (let i = 0; i < doc.getPageCount(); i++) {
        const newDoc = await PDFDocument.create();
        const [page] = await newDoc.copyPages(doc, [i]);
        newDoc.addPage(page);
        const pdfBytes = await newDoc.save();
        zip.file(`${baseName}_page_${i + 1}.pdf`, pdfBytes);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `${baseName}_split_all.zip`);
      toast({
        title: "Split Complete!",
        description: `Split ${doc.getPageCount()} pages into separate PDFs (ZIP).`,
      });
    } catch {
      toast({ title: "Error", description: "Failed to split PDF." });
    } finally {
      setProcessing(false);
    }
  };

  const splitRange = async () => {
    if (!file) return;
    if (rangeFrom < 1 || rangeTo > totalPages || rangeFrom > rangeTo) {
      toast({ title: "Error", description: "Invalid page range." });
      return;
    }
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const newDoc = await PDFDocument.create();
      const indices = [];
      for (let i = rangeFrom - 1; i < rangeTo; i++) {
        indices.push(i);
      }
      const pages = await newDoc.copyPages(doc, indices);
      pages.forEach((p) => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      const baseName = file.name.replace(/\.pdf$/i, "");
      downloadUint8Array(pdfBytes, `${baseName}_pages_${rangeFrom}-${rangeTo}.pdf`);
      toast({
        title: "Extracted!",
        description: `Extracted pages ${rangeFrom} to ${rangeTo}.`,
      });
    } catch {
      toast({ title: "Error", description: "Failed to extract pages." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          PDF Split
        </CardTitle>
        <CardDescription>
          Split a PDF into individual pages or extract a page range
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              dragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFile(Array.from(e.dataTransfer.files));
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = Array.from(e.target.files ?? []);
                if (f.length > 0) addFile(f);
                e.target.value = "";
              }}
            />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-8 w-8" />
              <p>Drop a PDF here or click to upload</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              </div>
              <span className="text-sm font-medium">{totalPages} pages</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant={mode === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("all")}
              >
                Split All Pages (ZIP)
              </Button>
              <Button
                variant={mode === "range" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("range")}
              >
                Extract Page Range
              </Button>
            </div>

            {mode === "range" && (
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1">
                  <Label>From Page</Label>
                  <Input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={rangeFrom}
                    onChange={(e) => setRangeFrom(Number(e.target.value))}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label>To Page</Label>
                  <Input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={rangeTo}
                    onChange={(e) => setRangeTo(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={mode === "all" ? splitAll : splitRange}
              disabled={processing}
              className="w-full"
            >
              {processing
                ? "Processing..."
                : mode === "all"
                  ? `Split All ${totalPages} Pages`
                  : `Extract Pages ${rangeFrom}–${rangeTo}`}
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setFile(null);
                setTotalPages(0);
              }}
            >
              Upload Different PDF
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 3. PDF to Text ──────────────────────────────────────────────────

export function PdfToText() {
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [extractedText, setExtractedText] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const extractText = async (pdfBytes: ArrayBuffer): Promise<string> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    const doc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: unknown) => {
          const textItem = item as { str?: string };
          return textItem.str ?? "";
        })
        .join(" ");
      pages.push(pageText);
    }
    return pages.join("\n\n--- Page Break ---\n\n");
  };

  const handleFile = async (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (pdfFiles.length === 0) {
      toast({ title: "Error", description: "Please upload a PDF file." });
      return;
    }
    const f = pdfFiles[0];
    setFile(f);
    setProcessing(true);
    setExtractedText("");
    try {
      const bytes = await f.arrayBuffer();
      const text = await extractText(bytes);
      setExtractedText(text);
      toast({
        title: "Text Extracted!",
        description: "PDF content has been extracted successfully.",
      });
    } catch {
      toast({ title: "Error", description: "Failed to extract text from PDF." });
    } finally {
      setProcessing(false);
    }
  };

  const downloadText = () => {
    if (!extractedText || !file) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const baseName = file.name.replace(/\.pdf$/i, "");
    downloadBlob(blob, `${baseName}.txt`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileOutput className="h-5 w-5" />
          PDF to Text
        </CardTitle>
        <CardDescription>
          Extract text content from a PDF file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(Array.from(e.dataTransfer.files));
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const f = Array.from(e.target.files ?? []);
              if (f.length > 0) handleFile(f);
              e.target.value = "";
            }}
          />
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-8 w-8" />
            <p>Drop a PDF here or click to upload</p>
          </div>
        </div>

        {processing && (
          <p className="text-sm text-muted-foreground text-center">Extracting text...</p>
        )}

        {extractedText && (
          <div className="space-y-3">
            <Textarea
              value={extractedText}
              readOnly
              rows={10}
              className="font-mono text-xs"
            />
            <Button onClick={downloadText} className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download as Text File
            </Button>
          </div>
        )}

        {file && !processing && (
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              setFile(null);
              setExtractedText("");
            }}
          >
            Upload Different PDF
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 4. Word to PDF ──────────────────────────────────────────────────

export function WordToPdf() {
  const { toast } = useToast();
  const [text, setText] = React.useState("");
  const [processing, setProcessing] = React.useState(false);

  const convertToPdf = async () => {
    if (!text.trim()) {
      toast({ title: "Error", description: "Please enter some text content." });
      return;
    }
    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const margin = 50;
      const lineHeight = fontSize * 1.5;
      const pageWidth = 595.28; // A4
      const pageHeight = 841.89;
      const maxWidth = pageWidth - margin * 2;
      const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);

      // Split text into paragraphs (double newline = paragraph break)
      const paragraphs = text.split(/\n\s*\n/);

      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;
      let lineCount = 0;

      for (const paragraph of paragraphs) {
        // Split paragraph into lines that fit the page width
        const rawLines = paragraph.split("\n");
        for (const rawLine of rawLines) {
          // Word wrap
          const words = rawLine.split(" ");
          let currentLine = "";
          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);
            if (testWidth > maxWidth && currentLine) {
              // Draw current line
              page.drawText(currentLine, {
                x: margin,
                y,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
              });
              y -= lineHeight;
              lineCount++;
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          // Draw remaining text
          if (currentLine) {
            page.drawText(currentLine, {
              x: margin,
              y,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });
            y -= lineHeight;
            lineCount++;
          }

          // Check if we need a new page
          if (lineCount >= maxLinesPerPage) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
            lineCount = 0;
          }
        }

        // Add paragraph spacing
        y -= lineHeight * 0.5;
        lineCount++;
        if (lineCount >= maxLinesPerPage) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
          lineCount = 0;
        }
      }

      const pdfBytes = await pdfDoc.save();
      downloadUint8Array(pdfBytes, "document.pdf");
      toast({ title: "Converted!", description: "Text converted to PDF successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to convert text to PDF." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5" />
          Text to PDF
        </CardTitle>
        <CardDescription>
          Convert plain text to a downloadable PDF document
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Enter your text content</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here...&#10;&#10;Use double line breaks to separate paragraphs."
            rows={12}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Use double line breaks to create paragraph spacing.
          </p>
        </div>

        <Button
          onClick={convertToPdf}
          disabled={processing || !text.trim()}
          className="w-full"
        >
          {processing ? "Converting..." : "Convert to PDF"}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── 5. PDF Compressor ───────────────────────────────────────────────

export function PdfCompressor() {
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [originalSize, setOriginalSize] = React.useState(0);
  const [compressedSize, setCompressedSize] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [compressedBytes, setCompressedBytes] = React.useState<Uint8Array | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addFile = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (pdfFiles.length === 0) {
      toast({ title: "Error", description: "Please upload a PDF file." });
      return;
    }
    const f = pdfFiles[0];
    setFile(f);
    setOriginalSize(f.size);
    setCompressedSize(0);
    setCompressedBytes(null);
  };

  const compress = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);
      const newDoc = await PDFDocument.create();

      // Copy all pages - this strips some metadata/bloat
      const pageIndices = srcDoc.getPageIndices();
      const pages = await newDoc.copyPages(srcDoc, pageIndices);
      pages.forEach((p) => newDoc.addPage(p));

      const result = await newDoc.save();
      setCompressedBytes(result);
      setCompressedSize(result.length);

      const reduction = Math.round((1 - result.length / file.size) * 100);
      toast({
        title: "Compressed!",
        description:
          reduction > 0
            ? `Reduced by ${reduction}% (${formatBytes(file.size - result.length)} saved)`
            : `Size unchanged. The PDF was already well-optimized.`,
      });
    } catch {
      toast({ title: "Error", description: "Failed to compress PDF. It may be encrypted or corrupted." });
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!compressedBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, "");
    downloadUint8Array(compressedBytes, `${baseName}_compressed.pdf`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Minimize2 className="h-5 w-5" />
          PDF Compressor
        </CardTitle>
        <CardDescription>
          Reduce PDF file size by re-creating the document structure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              dragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFile(Array.from(e.dataTransfer.files));
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = Array.from(e.target.files ?? []);
                if (f.length > 0) addFile(f);
                e.target.value = "";
              }}
            />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-8 w-8" />
              <p>Drop a PDF here or click to upload</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              </div>
              <span className="text-sm font-medium">{formatBytes(originalSize)}</span>
            </div>

            <Button
              onClick={compress}
              disabled={processing}
              className="w-full"
            >
              {processing ? "Compressing..." : "Compress PDF"}
            </Button>

            {compressedSize > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <p className="text-muted-foreground">Original</p>
                    <p className="font-semibold text-lg">{formatBytes(originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Compressed</p>
                    <p className="font-semibold text-lg">{formatBytes(compressedSize)}</p>
                  </div>
                </div>

                <Button onClick={download} className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Compressed PDF
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setFile(null);
                setOriginalSize(0);
                setCompressedSize(0);
                setCompressedBytes(null);
              }}
            >
              Upload Different PDF
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}