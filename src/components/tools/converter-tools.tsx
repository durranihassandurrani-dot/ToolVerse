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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Copy,
  RotateCcw,
  ArrowRightLeft,
  DollarSign,
  Ruler,
  Weight,
  Thermometer,
  Clock,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────

function formatNumber(n: number, decimals = 4): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-6 && n !== 0)) {
    return n.toExponential(4);
  }
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

function copyToClipboard(
  text: string,
  label: string,
  toast: ReturnType<typeof useToast>["toast"]
) {
  navigator.clipboard.writeText(text).then(() => {
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  });
}

// ─── 1. Currency Converter ───────────────────────────────────────────

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.9215,
  GBP: 0.7892,
  JPY: 149.52,
  INR: 83.45,
  CAD: 1.3625,
  AUD: 1.5310,
  CHF: 0.8802,
  CNY: 7.2345,
  KRW: 1325.8,
  SGD: 1.3428,
  HKD: 7.8125,
  NOK: 10.6542,
  SEK: 10.4215,
  MXN: 17.1525,
  BRL: 4.9725,
  ZAR: 18.6325,
  NZD: 1.6215,
  THB: 35.425,
  AED: 3.6725,
};

const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar (USD)",
  EUR: "Euro (EUR)",
  GBP: "British Pound (GBP)",
  JPY: "Japanese Yen (JPY)",
  INR: "Indian Rupee (INR)",
  CAD: "Canadian Dollar (CAD)",
  AUD: "Australian Dollar (AUD)",
  CHF: "Swiss Franc (CHF)",
  CNY: "Chinese Yuan (CNY)",
  KRW: "South Korean Won (KRW)",
  SGD: "Singapore Dollar (SGD)",
  HKD: "Hong Kong Dollar (HKD)",
  NOK: "Norwegian Krone (NOK)",
  SEK: "Swedish Krona (SEK)",
  MXN: "Mexican Peso (MXN)",
  BRL: "Brazilian Real (BRL)",
  ZAR: "South African Rand (ZAR)",
  NZD: "New Zealand Dollar (NZD)",
  THB: "Thai Baht (THB)",
  AED: "UAE Dirham (AED)",
};

export function CurrencyConverter() {
  const { toast } = useToast();
  const [amount, setAmount] = React.useState("1");
  const [fromCurrency, setFromCurrency] = React.useState("USD");
  const [toCurrency, setToCurrency] = React.useState("EUR");

  const result = React.useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "";
    const inUSD = num / EXCHANGE_RATES[fromCurrency];
    return formatNumber(inUSD * EXCHANGE_RATES[toCurrency], 2);
  }, [amount, fromCurrency, toCurrency]);

  const rate = React.useMemo(() => {
    const inUSD = 1 / EXCHANGE_RATES[fromCurrency];
    return formatNumber(inUSD * EXCHANGE_RATES[toCurrency], 6);
  }, [fromCurrency, toCurrency]);

  function handleSwap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  function handleReset() {
    setAmount("1");
    setFromCurrency("USD");
    setToCurrency("EUR");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="size-5 text-emerald-500" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(EXCHANGE_RATES).map((code) => (
                  <SelectItem key={code} value={code}>
                    {CURRENCY_NAMES[code]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="sm:mb-0.5"
            aria-label="Swap currencies"
          >
            <ArrowRightLeft className="size-4" />
          </Button>

          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(EXCHANGE_RATES).map((code) => (
                  <SelectItem key={code} value={code}>
                    {CURRENCY_NAMES[code]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Result</p>
            <p className="text-2xl font-bold tracking-tight">
              {result}{" "}
              <span className="text-base font-medium text-muted-foreground">
                {toCurrency}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              1 {fromCurrency} = {rate} {toCurrency}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              copyToClipboard(
                result || "0",
                "Conversion result",
                toast
              )
            }
            disabled={!result}
          >
            <Copy className="mr-1 size-3.5" /> Copy
          </Button>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-1 size-3.5" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 2. Length Converter ─────────────────────────────────────────────

const LENGTH_UNITS: Record<string, number> = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  millimeter: 0.001,
  mile: 1609.344,
  yard: 0.9144,
  foot: 0.3048,
  inch: 0.0254,
  "nautical mile": 1852,
  micrometer: 1e-6,
};

const LENGTH_LABELS: Record<string, string> = {
  meter: "Meter (m)",
  kilometer: "Kilometer (km)",
  centimeter: "Centimeter (cm)",
  millimeter: "Millimeter (mm)",
  mile: "Mile (mi)",
  yard: "Yard (yd)",
  foot: "Foot (ft)",
  inch: "Inch (in)",
  "nautical mile": "Nautical Mile (nmi)",
  micrometer: "Micrometer (μm)",
};

export function LengthConverter() {
  const { toast } = useToast();
  const [value, setValue] = React.useState("1");
  const [fromUnit, setFromUnit] = React.useState("meter");
  const [toUnit, setToUnit] = React.useState("foot");

  const result = React.useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    const inMeters = num * LENGTH_UNITS[fromUnit];
    return formatNumber(inMeters / LENGTH_UNITS[toUnit]);
  }, [value, fromUnit, toUnit]);

  function handleSwap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  function handleReset() {
    setValue("1");
    setFromUnit("meter");
    setToUnit("foot");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="size-5 text-blue-500" />
          Length Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Value</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="Enter value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(LENGTH_UNITS).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {LENGTH_LABELS[unit]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="sm:mb-0.5"
            aria-label="Swap units"
          >
            <ArrowRightLeft className="size-4" />
          </Button>

          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(LENGTH_UNITS).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {LENGTH_LABELS[unit]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Result</p>
            <p className="text-2xl font-bold tracking-tight">
              {result}{" "}
              <span className="text-base font-medium text-muted-foreground">
                {toUnit}
              </span>
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              copyToClipboard(result || "0", "Conversion result", toast)
            }
            disabled={!result}
          >
            <Copy className="mr-1 size-3.5" /> Copy
          </Button>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-1 size-3.5" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 3. Weight Converter ─────────────────────────────────────────────

const WEIGHT_UNITS: Record<string, number> = {
  kilogram: 1,
  gram: 0.001,
  milligram: 1e-6,
  pound: 0.45359237,
  ounce: 0.028349523125,
  ton: 907.18474,
  stone: 6.35029318,
  "metric ton": 1000,
};

const WEIGHT_LABELS: Record<string, string> = {
  kilogram: "Kilogram (kg)",
  gram: "Gram (g)",
  milligram: "Milligram (mg)",
  pound: "Pound (lb)",
  ounce: "Ounce (oz)",
  ton: "Ton (US, short)",
  stone: "Stone (st)",
  "metric ton": "Metric Ton (t)",
};

export function WeightConverter() {
  const { toast } = useToast();
  const [value, setValue] = React.useState("1");
  const [fromUnit, setFromUnit] = React.useState("kilogram");
  const [toUnit, setToUnit] = React.useState("pound");

  const result = React.useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    const inKg = num * WEIGHT_UNITS[fromUnit];
    return formatNumber(inKg / WEIGHT_UNITS[toUnit]);
  }, [value, fromUnit, toUnit]);

  function handleSwap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  function handleReset() {
    setValue("1");
    setFromUnit("kilogram");
    setToUnit("pound");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Weight className="size-5 text-orange-500" />
          Weight Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Value</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="Enter value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(WEIGHT_UNITS).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {WEIGHT_LABELS[unit]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="sm:mb-0.5"
            aria-label="Swap units"
          >
            <ArrowRightLeft className="size-4" />
          </Button>

          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(WEIGHT_UNITS).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {WEIGHT_LABELS[unit]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Result</p>
            <p className="text-2xl font-bold tracking-tight">
              {result}{" "}
              <span className="text-base font-medium text-muted-foreground">
                {toUnit}
              </span>
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              copyToClipboard(result || "0", "Conversion result", toast)
            }
            disabled={!result}
          >
            <Copy className="mr-1 size-3.5" /> Copy
          </Button>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-1 size-3.5" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 4. Temperature Converter ────────────────────────────────────────

const TEMP_UNITS = ["Celsius", "Fahrenheit", "Kelvin"] as const;
type TempUnit = (typeof TEMP_UNITS)[number];

function convertTemperature(value: number, from: TempUnit, to: TempUnit): number {
  // First convert to Celsius
  let celsius: number;
  switch (from) {
    case "Celsius":
      celsius = value;
      break;
    case "Fahrenheit":
      celsius = (value - 32) * (5 / 9);
      break;
    case "Kelvin":
      celsius = value - 273.15;
      break;
  }

  // Then convert from Celsius to target
  switch (to) {
    case "Celsius":
      return celsius;
    case "Fahrenheit":
      return celsius * (9 / 5) + 32;
    case "Kelvin":
      return celsius + 273.15;
  }
}

function getFormula(from: TempUnit, to: TempUnit): string {
  const formulas: Record<string, Record<string, string>> = {
    Celsius: {
      Celsius: "°C = °C",
      Fahrenheit: "°F = (°C × 9/5) + 32",
      Kelvin: "K = °C + 273.15",
    },
    Fahrenheit: {
      Celsius: "°C = (°F − 32) × 5/9",
      Fahrenheit: "°F = °F",
      Kelvin: "K = (°F − 32) × 5/9 + 273.15",
    },
    Kelvin: {
      Celsius: "°C = K − 273.15",
      Fahrenheit: "°F = (K − 273.15) × 9/5 + 32",
      Kelvin: "K = K",
    },
  };
  return formulas[from][to];
}

export function TemperatureConverter() {
  const { toast } = useToast();
  const [value, setValue] = React.useState("0");
  const [fromUnit, setFromUnit] = React.useState<TempUnit>("Celsius");
  const [toUnit, setToUnit] = React.useState<TempUnit>("Fahrenheit");

  const result = React.useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    const converted = convertTemperature(num, fromUnit, toUnit);
    return formatNumber(converted, 2);
  }, [value, fromUnit, toUnit]);

  const formula = React.useMemo(
    () => getFormula(fromUnit, toUnit),
    [fromUnit, toUnit]
  );

  function handleSwap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  function handleReset() {
    setValue("0");
    setFromUnit("Celsius");
    setToUnit("Fahrenheit");
  }

  const unitSymbols: Record<TempUnit, string> = {
    Celsius: "°C",
    Fahrenheit: "°F",
    Kelvin: "K",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="size-5 text-red-500" />
          Temperature Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Value</Label>
          <Input
            type="number"
            step="any"
            placeholder="Enter temperature"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div className="space-y-2">
            <Label>From</Label>
            <Select
              value={fromUnit}
              onValueChange={(v) => setFromUnit(v as TempUnit)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMP_UNITS.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit} ({unitSymbols[unit]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="sm:mb-0.5"
            aria-label="Swap units"
          >
            <ArrowRightLeft className="size-4" />
          </Button>

          <div className="space-y-2">
            <Label>To</Label>
            <Select
              value={toUnit}
              onValueChange={(v) => setToUnit(v as TempUnit)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMP_UNITS.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit} ({unitSymbols[unit]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Result</p>
            <p className="text-2xl font-bold tracking-tight">
              {result}{" "}
              <span className="text-base font-medium text-muted-foreground">
                {unitSymbols[toUnit]}
              </span>
            </p>
            <div className="rounded-md border bg-background px-3 py-1.5 text-xs font-mono text-muted-foreground">
              {formula}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              copyToClipboard(result || "0", "Conversion result", toast)
            }
            disabled={!result}
          >
            <Copy className="mr-1 size-3.5" /> Copy
          </Button>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-1 size-3.5" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 5. Time Converter ───────────────────────────────────────────────

const TIME_UNITS: Record<string, number> = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2592000, // 30 days
  year: 31536000, // 365 days
};

const TIME_LABELS: Record<string, string> = {
  second: "Second (s)",
  minute: "Minute (min)",
  hour: "Hour (hr)",
  day: "Day (d)",
  week: "Week (wk)",
  month: "Month (30 days)",
  year: "Year (365 days)",
};

export function TimeConverter() {
  const { toast } = useToast();
  const [value, setValue] = React.useState("1");
  const [fromUnit, setFromUnit] = React.useState("hour");
  const [toUnit, setToUnit] = React.useState("minute");

  const result = React.useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return "";
    const inSeconds = num * TIME_UNITS[fromUnit];
    return formatNumber(inSeconds / TIME_UNITS[toUnit]);
  }, [value, fromUnit, toUnit]);

  function handleSwap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  function handleReset() {
    setValue("1");
    setFromUnit("hour");
    setToUnit("minute");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-5 text-purple-500" />
          Time Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Value</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="Enter value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(TIME_UNITS).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {TIME_LABELS[unit]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="sm:mb-0.5"
            aria-label="Swap units"
          >
            <ArrowRightLeft className="size-4" />
          </Button>

          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(TIME_UNITS).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {TIME_LABELS[unit]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Result</p>
            <p className="text-2xl font-bold tracking-tight">
              {result}{" "}
              <span className="text-base font-medium text-muted-foreground">
                {toUnit}
              </span>
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              copyToClipboard(result || "0", "Conversion result", toast)
            }
            disabled={!result}
          >
            <Copy className="mr-1 size-3.5" /> Copy
          </Button>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-1 size-3.5" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}