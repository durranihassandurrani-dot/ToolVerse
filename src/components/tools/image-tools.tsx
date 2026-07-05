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
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Crop,
  Eraser,
  Minimize2,
  ImageIcon as ImageLucide,
  GripVertical,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function DragDropZone({
  onFiles,
  accept = "image/*",
  multiple = false,
  children,
}: {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  children?: React.ReactNode;
}) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
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
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) onFiles(files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) onFiles(files);
        }}
      />
      {children ?? (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Upload className="h-8 w-8" />
          <p>Drop an image here or click to upload</p>
        </div>
      )}
    </div>
  );
}

// ─── 1. Image Compressor ─────────────────────────────────────────────

export function ImageCompressor() {
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = React.useState<string>("");
  const [compressedUrl, setCompressedUrl] = React.useState<string>("");
  const [compressedSize, setCompressedSize] = React.useState<number>(0);
  const [quality, setQuality] = React.useState<number>(75);
  const [processing, setProcessing] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  const handleFile = React.useCallback(
    (files: File[]) => {
      const f = files[0];
      if (!f || !f.type.startsWith("image/")) {
        toast({ title: "Error", description: "Please upload a valid image file." });
        return;
      }
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      setFile(f);
      setOriginalUrl(URL.createObjectURL(f));
      setCompressedUrl("");
      setCompressedSize(0);
    },
    [originalUrl, compressedUrl, toast]
  );

  const compress = React.useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Compression failed"))),
          "image/jpeg",
          quality / 100
        );
      });

      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      setCompressedUrl(URL.createObjectURL(blob));
      setCompressedSize(blob.size);
      toast({
        title: "Compressed!",
        description: `Saved ${formatBytes(file.size - blob.size)} (${Math.round((1 - blob.size / file.size) * 100)}% reduction)`,
      });
    } catch {
      toast({ title: "Error", description: "Failed to compress image." });
    } finally {
      setProcessing(false);
    }
  }, [file, quality, compressedUrl, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Minimize2 className="h-5 w-5" />
          Image Compressor
        </CardTitle>
        <CardDescription>
          Compress images using JPEG quality reduction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file ? (
          <DragDropZone onFiles={handleFile} />
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quality</span>
                <span className="font-medium">{quality}%</span>
              </div>
              <Slider
                value={[quality]}
                onValueChange={([v]) => setQuality(v)}
                min={1}
                max={100}
                step={1}
              />
            </div>

            <Button onClick={compress} disabled={processing} className="w-full">
              {processing ? "Compressing..." : "Compress Image"}
            </Button>

            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div>
                <p className="text-muted-foreground">Original</p>
                <p className="font-semibold text-lg">{formatBytes(file.size)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Compressed</p>
                <p className="font-semibold text-lg">
                  {compressedSize > 0 ? formatBytes(compressedSize) : "—"}
                </p>
              </div>
            </div>

            {compressedUrl && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground text-center">Original</p>
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="w-full rounded-lg border object-contain max-h-48"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground text-center">Compressed</p>
                  <img
                    src={compressedUrl}
                    alt="Compressed"
                    className="w-full rounded-lg border object-contain max-h-48"
                  />
                </div>
              </div>
            )}

            {compressedUrl && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const canvas = document.createElement("canvas");
                  const img = new window.Image();
                  img.onload = () => {
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    canvas.getContext("2d")!.drawImage(img, 0, 0);
                    canvas.toBlob(
                      (blob) => {
                        if (blob) downloadBlob(blob, `compressed_${file.name}`);
                      },
                      "image/jpeg",
                      quality / 100
                    );
                  };
                  img.src = compressedUrl;
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Compressed Image
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setFile(null);
                if (originalUrl) URL.revokeObjectURL(originalUrl);
                if (compressedUrl) URL.revokeObjectURL(compressedUrl);
                setOriginalUrl("");
                setCompressedUrl("");
                setCompressedSize(0);
              }}
            >
              Upload Different Image
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 2. Image Resizer ────────────────────────────────────────────────

const PRESETS = [
  { label: "640 × 480", w: 640, h: 480 },
  { label: "1280 × 720", w: 1280, h: 720 },
  { label: "1920 × 1080", w: 1920, h: 1080 },
  { label: "Custom", w: 0, h: 0 },
];

export function ImageResizer() {
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const [resultUrl, setResultUrl] = React.useState<string>("");
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const [maintainAspect, setMaintainAspect] = React.useState(true);
  const [aspectRatio, setAspectRatio] = React.useState<number>(1);
  const [selectedPreset, setSelectedPreset] = React.useState(4); // Custom
  const [processing, setProcessing] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFile = React.useCallback(
    (files: File[]) => {
      const f = files[0];
      if (!f || !f.type.startsWith("image/")) {
        toast({ title: "Error", description: "Please upload a valid image file." });
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      setResultUrl("");
      const img = new window.Image();
      img.onload = () => {
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      };
      img.src = URL.createObjectURL(f);
    },
    [previewUrl, resultUrl, toast]
  );

  const handleWidthChange = (newW: number) => {
    setWidth(newW);
    if (maintainAspect && aspectRatio) {
      setHeight(Math.round(newW / aspectRatio));
    }
  };

  const handleHeightChange = (newH: number) => {
    setHeight(newH);
    if (maintainAspect && aspectRatio) {
      setWidth(Math.round(newH * aspectRatio));
    }
  };

  const handlePreset = (idx: number) => {
    setSelectedPreset(idx);
    const p = PRESETS[idx];
    if (p.w > 0 && p.h > 0) {
      setWidth(p.w);
      setHeight(p.h);
      setMaintainAspect(false);
    } else {
      setMaintainAspect(true);
      if (file) {
        const img = new window.Image();
        img.onload = () => {
          setWidth(img.naturalWidth);
          setHeight(img.naturalHeight);
        };
        img.src = previewUrl;
      }
    }
  };

  const resize = React.useCallback(async () => {
    if (!file || width <= 0 || height <= 0) return;
    setProcessing(true);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Resize failed"))),
          file.type,
          1
        );
      });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      toast({ title: "Resized!", description: `Image resized to ${width}×${height}` });
    } catch {
      toast({ title: "Error", description: "Failed to resize image." });
    } finally {
      setProcessing(false);
    }
  }, [file, width, height, resultUrl, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image Resizer
        </CardTitle>
        <CardDescription>
          Resize images to specific dimensions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file ? (
          <DragDropZone onFiles={handleFile} />
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <Button
                  key={p.label}
                  variant={selectedPreset === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePreset(i)}
                >
                  {p.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  min={1}
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  min={1}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="maintain-aspect"
                checked={maintainAspect}
                onCheckedChange={(v) => setMaintainAspect(v === true)}
              />
              <Label htmlFor="maintain-aspect" className="text-sm font-normal cursor-pointer">
                Maintain aspect ratio
              </Label>
            </div>

            <Button onClick={resize} disabled={processing} className="w-full">
              {processing ? "Resizing..." : "Resize Image"}
            </Button>

            {resultUrl && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground text-center">Original ({formatBytes(file.size)})</p>
                    <img
                      src={previewUrl}
                      alt="Original"
                      className="w-full rounded-lg border object-contain max-h-48"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground text-center">
                      Resized ({width}×{height})
                    </p>
                    <img
                      src={resultUrl}
                      alt="Resized"
                      className="w-full rounded-lg border object-contain max-h-48"
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const img = new window.Image();
                    img.onload = () => {
                      const canvas = document.createElement("canvas");
                      canvas.width = width;
                      canvas.height = height;
                      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
                      canvas.toBlob(
                        (blob) => {
                          if (blob)
                            downloadBlob(
                              blob,
                              `resized_${width}x${height}_${file.name}`
                            );
                        },
                        file.type,
                        1
                      );
                    };
                    img.src = resultUrl;
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Resized Image
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setFile(null);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                if (resultUrl) URL.revokeObjectURL(resultUrl);
                setPreviewUrl("");
                setResultUrl("");
              }}
            >
              Upload Different Image
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 3. Image Cropper ────────────────────────────────────────────────

export function ImageCropper() {
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [imageEl, setImageEl] = React.useState<HTMLImageElement | null>(null);
  const [cropBox, setCropBox] = React.useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [resultUrl, setResultUrl] = React.useState<string>("");
  const [displayScale, setDisplayScale] = React.useState(1);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleFile = React.useCallback(
    (files: File[]) => {
      const f = files[0];
      if (!f || !f.type.startsWith("image/")) {
        toast({ title: "Error", description: "Please upload a valid image file." });
        return;
      }
      setFile(f);
      setResultUrl("");
      setCropBox(null);
      const img = new window.Image();
      img.onload = () => {
        setImageEl(img);
      };
      img.src = URL.createObjectURL(f);
    },
    [toast]
  );

  React.useEffect(() => {
    if (!imageEl || !containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const scale = Math.min(containerWidth / imageEl.naturalWidth, 400 / imageEl.naturalHeight);
    setDisplayScale(scale);
  }, [imageEl]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasCoords(e);
    setDragging(true);
    setDragStart(pos);
    setCropBox({ x: pos.x, y: pos.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    const pos = getCanvasCoords(e);
    const x = Math.min(dragStart.x, pos.x);
    const y = Math.min(dragStart.y, pos.y);
    const w = Math.abs(pos.x - dragStart.x);
    const h = Math.abs(pos.y - dragStart.y);
    setCropBox({ x, y, w, h });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const applyCrop = React.useCallback(() => {
    if (!imageEl || !cropBox || !canvasRef.current) return;
    const scaleX = imageEl.naturalWidth / canvasRef.current.width;
    const scaleY = imageEl.naturalHeight / canvasRef.current.height;

    const sx = Math.round(cropBox.x * scaleX);
    const sy = Math.round(cropBox.y * scaleY);
    const sw = Math.round(cropBox.w * scaleX);
    const sh = Math.round(cropBox.h * scaleY);

    if (sw <= 0 || sh <= 0) {
      toast({ title: "Error", description: "Please select a crop area first." });
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imageEl, sx, sy, sw, sh, 0, 0, sw, sh);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast({ title: "Error", description: "Failed to crop image." });
          return;
        }
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(URL.createObjectURL(blob));
        toast({ title: "Cropped!", description: `Crop area: ${sw}×${sh} px` });
      },
      file!.type,
      1
    );
  }, [imageEl, cropBox, file, resultUrl, toast]);

  React.useEffect(() => {
    if (!imageEl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = imageEl.naturalWidth * displayScale;
    canvas.height = imageEl.naturalHeight * displayScale;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageEl, 0, 0, canvas.width, canvas.height);

    if (cropBox) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(cropBox.x, cropBox.y, cropBox.w, cropBox.h);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(cropBox.x, cropBox.y, cropBox.w, cropBox.h);
    }
  }, [imageEl, cropBox, displayScale]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crop className="h-5 w-5" />
          Image Cropper
        </CardTitle>
        <CardDescription>
          Click and drag on the image to select a crop area
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file ? (
          <DragDropZone onFiles={handleFile} />
        ) : (
          <>
            <div ref={containerRef} className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full rounded-lg border cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>

            {cropBox && cropBox.w > 0 && cropBox.h > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Crop:{" "}
                  {Math.round(cropBox.w / displayScale)}×
                  {Math.round(cropBox.h / displayScale)} px
                </p>
                <Button size="sm" onClick={applyCrop}>
                  Apply Crop
                </Button>
              </div>
            )}

            {resultUrl && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground text-center">Cropped Result</p>
                  <img
                    src={resultUrl}
                    alt="Cropped"
                    className="w-full rounded-lg border object-contain max-h-64 mx-auto"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = resultUrl;
                    a.download = `cropped_${file.name}`;
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Cropped Image
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setFile(null);
                setImageEl(null);
                setCropBox(null);
                if (resultUrl) URL.revokeObjectURL(resultUrl);
                setResultUrl("");
              }}
            >
              Upload Different Image
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 4. Background Remover ───────────────────────────────────────────

export function BackgroundRemover() {
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const [resultUrl, setResultUrl] = React.useState<string>("");
  const [bgColor, setBgColor] = React.useState<string>("#ffffff");
  const [sensitivity, setSensitivity] = React.useState<number>(30);
  const [processing, setProcessing] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFile = React.useCallback(
    (files: File[]) => {
      const f = files[0];
      if (!f || !f.type.startsWith("image/")) {
        toast({ title: "Error", description: "Please upload a valid image file." });
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      setResultUrl("");
    },
    [previewUrl, resultUrl, toast]
  );

  const removeBackground = React.useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Parse target bg color
      const targetR = parseInt(bgColor.slice(1, 3), 16);
      const targetG = parseInt(bgColor.slice(3, 5), 16);
      const targetB = parseInt(bgColor.slice(5, 7), 16);
      const threshold = sensitivity * 2.55; // 0-255 range

      for (let i = 0; i < data.length; i += 4) {
        const dr = data[i] - targetR;
        const dg = data[i + 1] - targetG;
        const db = data[i + 2] - targetB;
        const distance = Math.sqrt(dr * dr + dg * dg + db * db);

        if (distance <= threshold) {
          // Smooth alpha transition near threshold
          const alpha = Math.max(0, Math.min(255, ((distance / threshold) * 255)));
          data[i + 3] = Math.round(alpha);
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Processing failed"))),
          "image/png"
        );
      });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      toast({ title: "Done!", description: "Background removed successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to process image." });
    } finally {
      setProcessing(false);
    }
  }, [file, bgColor, sensitivity, resultUrl, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eraser className="h-5 w-5" />
          Background Remover
        </CardTitle>
        <CardDescription>
          Remove solid-color backgrounds from images
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file ? (
          <DragDropZone onFiles={handleFile} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Background Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-9 w-14 rounded border cursor-pointer"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Sensitivity: {sensitivity}</Label>
                <Slider
                  value={[sensitivity]}
                  onValueChange={([v]) => setSensitivity(v)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            <Button onClick={removeBackground} disabled={processing} className="w-full">
              {processing ? "Processing..." : "Remove Background"}
            </Button>

            {resultUrl && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground text-center">Original</p>
                    <img
                      src={previewUrl}
                      alt="Original"
                      className="w-full rounded-lg border object-contain max-h-48"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground text-center">Result</p>
                    <div
                      className="w-full rounded-lg border object-contain max-h-48 flex items-center justify-center"
                      style={{
                        backgroundImage:
                          "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                        backgroundSize: "16px 16px",
                        backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                      }}
                    >
                      <img
                        src={resultUrl}
                        alt="Result"
                        className="max-h-48 object-contain"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = resultUrl;
                    a.download = `no-bg_${file.name.replace(/\.[^.]+$/, "")}.png`;
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download as PNG
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setFile(null);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                if (resultUrl) URL.revokeObjectURL(resultUrl);
                setPreviewUrl("");
                setResultUrl("");
              }}
            >
              Upload Different Image
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}