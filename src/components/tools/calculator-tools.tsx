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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Calculator,
  Copy,
  RotateCcw,
  Printer,
  Cake,
  Heart,
  Percent,
  Banknote,
  Receipt,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
} from "lucide-react";

// ─── Helper ───────────────────────────────────────────────────────────
function formatNumber(n: number, decimals = 2): string {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function copyToClipboard(text: string, label: string, toast: ReturnType<typeof useToast>["toast"]) {
  navigator.clipboard.writeText(text).then(() => {
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  });
}

// ─── 1. Age Calculator ────────────────────────────────────────────────
export function AgeCalculator() {
  const { toast } = useToast();
  const [dob, setDob] = React.useState<string>("");
  const [result, setResult] = React.useState<ReturnType<typeof calculateAge> | null>(null);

  function calculateAge(dobStr: string) {
    const birth = new Date(dobStr);
    const now = new Date();

    if (isNaN(birth.getTime()) || birth > now) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(totalMs / (1000 * 60));
    const totalSeconds = Math.floor(totalMs / 1000);

    // Next birthday countdown
    let nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) {
      nextBirthday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const countdownMs = nextBirthday.getTime() - now.getTime();
    const countdownDays = Math.floor(countdownMs / (1000 * 60 * 60 * 24));
    const countdownHours = Math.floor((countdownMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      countdownDays,
      countdownHours,
    };
  }

  const handleCalculate = () => {
    const r = calculateAge(dob);
    if (r) setResult(r);
  };

  const handleReset = () => {
    setDob("");
    setResult(null);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Age: ${result.years} years, ${result.months} months, ${result.days} days\nTotal days: ${result.totalDays.toLocaleString()}\nTotal hours: ${result.totalHours.toLocaleString()}\nTotal minutes: ${result.totalMinutes.toLocaleString()}\nTotal seconds: ${result.totalSeconds.toLocaleString()}`;
    copyToClipboard(text, "Age details", toast);
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="size-5 text-pink-500" />
            Age Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="age-dob">Date of Birth</Label>
            <Input
              id="age-dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCalculate} disabled={!dob} className="gap-2">
              <Calculator className="size-4" />
              Calculate Age
            </Button>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>

          {result && (
            <>
              <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-3xl font-bold">{result.years}</p>
                    <p className="text-xs text-muted-foreground mt-1">Years</p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-3xl font-bold">{result.months}</p>
                    <p className="text-xs text-muted-foreground mt-1">Months</p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-3xl font-bold">{result.days}</p>
                    <p className="text-xs text-muted-foreground mt-1">Days</p>
                  </div>
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Total Days Lived</span>
                    <span className="font-medium">{result.totalDays.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Total Hours Lived</span>
                    <span className="font-medium">{result.totalHours.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Total Minutes Lived</span>
                    <span className="font-medium">{result.totalMinutes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Total Seconds Lived</span>
                    <span className="font-medium">{result.totalSeconds.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="size-4 text-red-500" />
                  <p className="text-sm font-medium">Next Birthday</p>
                </div>
                <p className="text-2xl font-bold">
                  {result.countdownDays} days{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    and {result.countdownHours} hours
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                  <Copy className="size-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                  <Printer className="size-4" />
                  Print
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── 2. BMI Calculator ────────────────────────────────────────────────
export function BMICalculator() {
  const { toast } = useToast();
  const [unitSystem, setUnitSystem] = React.useState<"metric" | "imperial">("metric");
  const [weightKg, setWeightKg] = React.useState<string>("");
  const [weightLbs, setWeightLbs] = React.useState<string>("");
  const [heightCm, setHeightCm] = React.useState<string>("");
  const [heightFt, setHeightFt] = React.useState<string>("");
  const [heightIn, setHeightIn] = React.useState<string>("");
  const [result, setResult] = React.useState<{ bmi: number; category: string; color: string } | null>(null);

  function getBmiCategory(bmi: number): { category: string; color: string } {
    if (bmi < 18.5) return { category: "Underweight", color: "bg-blue-500" };
    if (bmi < 25) return { category: "Normal", color: "bg-green-500" };
    if (bmi < 30) return { category: "Overweight", color: "bg-yellow-500" };
    return { category: "Obese", color: "bg-red-500" };
  }

  const handleCalculate = () => {
    let bmi: number | null = null;

    if (unitSystem === "metric") {
      const w = parseFloat(weightKg);
      const h = parseFloat(heightCm);
      if (w > 0 && h > 0) {
        const hm = h / 100;
        bmi = w / (hm * hm);
      }
    } else {
      const w = parseFloat(weightLbs);
      const ft = parseFloat(heightFt) || 0;
      const inc = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inc;
      if (w > 0 && totalInches > 0) {
        bmi = (w / (totalInches * totalInches)) * 703;
      }
    }

    if (bmi !== null && isFinite(bmi)) {
      const { category, color } = getBmiCategory(bmi);
      setResult({ bmi, category, color });
    }
  };

  const handleReset = () => {
    setWeightKg("");
    setWeightLbs("");
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setResult(null);
  };

  const handleCopy = () => {
    if (!result) return;
    copyToClipboard(
      `BMI: ${formatNumber(result.bmi, 1)}\nCategory: ${result.category}`,
      "BMI result",
      toast
    );
  };

  const bmiPosition = result ? Math.min(Math.max((result.bmi / 40) * 100, 0), 100) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="size-5 text-red-500" />
            BMI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Unit System</Label>
            <Select
              value={unitSystem}
              onValueChange={(v) => {
                setUnitSystem(v as "metric" | "imperial");
                setResult(null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg / cm)</SelectItem>
                <SelectItem value="imperial">Imperial (lbs / ft+in)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {unitSystem === "metric" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bmi-weight-kg">Weight (kg)</Label>
                <Input
                  id="bmi-weight-kg"
                  type="number"
                  placeholder="e.g. 70"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  min={0}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bmi-height-cm">Height (cm)</Label>
                <Input
                  id="bmi-height-cm"
                  type="number"
                  placeholder="e.g. 175"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  min={0}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bmi-weight-lbs">Weight (lbs)</Label>
                <Input
                  id="bmi-weight-lbs"
                  type="number"
                  placeholder="e.g. 154"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  min={0}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bmi-height-ft">Height (ft)</Label>
                <Input
                  id="bmi-height-ft"
                  type="number"
                  placeholder="e.g. 5"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  min={0}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bmi-height-in">Height (in)</Label>
                <Input
                  id="bmi-height-in"
                  type="number"
                  placeholder="e.g. 9"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  min={0}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleCalculate} className="gap-2">
              <Calculator className="size-4" />
              Calculate BMI
            </Button>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>

          {result && (
            <>
              <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                <div className="text-center">
                  <p className="text-5xl font-bold">{formatNumber(result.bmi, 1)}</p>
                  <Badge className="mt-2">{result.category}</Badge>
                </div>

                {/* Visual BMI Scale */}
                <div className="space-y-2">
                  <div className="relative h-4 rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="bg-blue-400 h-full" style={{ width: "46.25%" }} />
                      <div className="bg-green-400 h-full" style={{ width: "16.25%" }} />
                      <div className="bg-yellow-400 h-full" style={{ width: "12.5%" }} />
                      <div className="bg-red-400 h-full" style={{ width: "25%" }} />
                    </div>
                    <div
                      className="absolute top-0 h-full w-1 bg-foreground transition-all duration-300"
                      style={{ left: `${bmiPosition}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40+</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                  <Copy className="size-4" />
                  Copy
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── 3. Percentage Calculator ─────────────────────────────────────────
export function PercentageCalculator() {
  const { toast } = useToast();

  // Tab 1: What is X% of Y?
  const [pctOfX, setPctOfX] = React.useState<string>("");
  const [pctOfY, setPctOfY] = React.useState<string>("");

  // Tab 2: X is what % of Y?
  const [whatPctX, setWhatPctX] = React.useState<string>("");
  const [whatPctY, setWhatPctY] = React.useState<string>("");

  // Tab 3: % Change from X to Y
  const [changeX, setChangeX] = React.useState<string>("");
  const [changeY, setChangeY] = React.useState<string>("");

  // Tab 4: X + Y% = ?
  const [addBase, setAddBase] = React.useState<string>("");
  const [addPct, setAddPct] = React.useState<string>("");

  function calcPctOf() {
    const x = parseFloat(pctOfX);
    const y = parseFloat(pctOfY);
    if (!isNaN(x) && !isNaN(y)) return (x / 100) * y;
    return null;
  }
  function calcWhatPct() {
    const x = parseFloat(whatPctX);
    const y = parseFloat(whatPctY);
    if (!isNaN(x) && !isNaN(y) && y !== 0) return (x / y) * 100;
    return null;
  }
  function calcChange() {
    const x = parseFloat(changeX);
    const y = parseFloat(changeY);
    if (!isNaN(x) && !isNaN(y) && x !== 0) return ((y - x) / Math.abs(x)) * 100;
    return null;
  }
  function calcAdd() {
    const b = parseFloat(addBase);
    const p = parseFloat(addPct);
    if (!isNaN(b) && !isNaN(p)) return b + (b * p) / 100;
    return null;
  }

  const r1 = calcPctOf();
  const r2 = calcWhatPct();
  const r3 = calcChange();
  const r4 = calcAdd();

  const handleReset = () => {
    setPctOfX("");
    setPctOfY("");
    setWhatPctX("");
    setWhatPctY("");
    setChangeX("");
    setChangeY("");
    setAddBase("");
    setAddPct("");
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text, "Result", toast);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="size-5 text-blue-500" />
            Percentage Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="of" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="of" className="text-xs sm:text-sm">X% of Y</TabsTrigger>
              <TabsTrigger value="what" className="text-xs sm:text-sm">X is ?% of Y</TabsTrigger>
              <TabsTrigger value="change" className="text-xs sm:text-sm">% Change</TabsTrigger>
              <TabsTrigger value="add" className="text-xs sm:text-sm">X + Y%</TabsTrigger>
            </TabsList>

            {/* Tab 1: What is X% of Y? */}
            <TabsContent value="of" className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="pct-of-x">Percentage (%)</Label>
                  <Input
                    id="pct-of-x"
                    type="number"
                    placeholder="e.g. 25"
                    value={pctOfX}
                    onChange={(e) => setPctOfX(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pct-of-y">Of Value</Label>
                  <Input
                    id="pct-of-y"
                    type="number"
                    placeholder="e.g. 200"
                    value={pctOfY}
                    onChange={(e) => setPctOfY(e.target.value)}
                  />
                </div>
              </div>
              {r1 !== null && (
                <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="text-2xl font-bold">{formatNumber(r1)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(formatNumber(r1))}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Tab 2: X is what % of Y? */}
            <TabsContent value="what" className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="what-pct-x">Value (X)</Label>
                  <Input
                    id="what-pct-x"
                    type="number"
                    placeholder="e.g. 50"
                    value={whatPctX}
                    onChange={(e) => setWhatPctX(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="what-pct-y">Total (Y)</Label>
                  <Input
                    id="what-pct-y"
                    type="number"
                    placeholder="e.g. 200"
                    value={whatPctY}
                    onChange={(e) => setWhatPctY(e.target.value)}
                  />
                </div>
              </div>
              {r2 !== null && (
                <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="text-2xl font-bold">{formatNumber(r2)}%</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(formatNumber(r2) + "%")}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Tab 3: % Change from X to Y */}
            <TabsContent value="change" className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="change-x">From (X)</Label>
                  <Input
                    id="change-x"
                    type="number"
                    placeholder="e.g. 100"
                    value={changeX}
                    onChange={(e) => setChangeX(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="change-y">To (Y)</Label>
                  <Input
                    id="change-y"
                    type="number"
                    placeholder="e.g. 150"
                    value={changeY}
                    onChange={(e) => setChangeY(e.target.value)}
                  />
                </div>
              </div>
              {r3 !== null && (
                <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Change</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{formatNumber(Math.abs(r3))}%</p>
                      {r3 > 0 ? (
                        <TrendingUp className="size-5 text-green-500" />
                      ) : r3 < 0 ? (
                        <TrendingDown className="size-5 text-red-500" />
                      ) : (
                        <Minus className="size-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(`${r3 > 0 ? "+" : ""}${formatNumber(r3)}%`)}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Tab 4: X + Y% = ? */}
            <TabsContent value="add" className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="add-base">Base Value (X)</Label>
                  <Input
                    id="add-base"
                    type="number"
                    placeholder="e.g. 1000"
                    value={addBase}
                    onChange={(e) => setAddBase(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-pct">Percentage (Y%)</Label>
                  <Input
                    id="add-pct"
                    type="number"
                    placeholder="e.g. 15"
                    value={addPct}
                    onChange={(e) => setAddPct(e.target.value)}
                  />
                </div>
              </div>
              {r4 !== null && (
                <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Result</p>
                    <p className="text-2xl font-bold">{formatNumber(r4)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(formatNumber(r4))}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="size-4" />
            Reset All
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── 4. Loan EMI Calculator ───────────────────────────────────────────
export function LoanEMICalculator() {
  const { toast } = useToast();
  const [loanAmount, setLoanAmount] = React.useState<string>("");
  const [interestRate, setInterestRate] = React.useState<string>("");
  const [tenure, setTenure] = React.useState<string>("");
  const [tenureUnit, setTenureUnit] = React.useState<"years" | "months">("years");
  const [result, setResult] = React.useState<{
    emi: number;
    totalInterest: number;
    totalPayment: number;
    principalPercent: number;
    interestPercent: number;
  } | null>(null);

  const handleCalculate = () => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const N = parseFloat(tenure);

    if (!P || P <= 0 || !annualRate || annualRate <= 0 || !N || N <= 0) return;

    const months = tenureUnit === "years" ? N * 12 : N;
    const r = annualRate / 12 / 100;

    let emi: number;
    if (r === 0) {
      emi = P / months;
    } else {
      const factor = Math.pow(1 + r, months);
      emi = (P * r * factor) / (factor - 1);
    }

    const totalPayment = emi * months;
    const totalInterest = totalPayment - P;
    const principalPercent = (P / totalPayment) * 100;
    const interestPercent = (totalInterest / totalPayment) * 100;

    setResult({ emi, totalInterest, totalPayment, principalPercent, interestPercent });
  };

  const handleReset = () => {
    setLoanAmount("");
    setInterestRate("");
    setTenure("");
    setTenureUnit("years");
    setResult(null);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Monthly EMI: ${formatNumber(result.emi)}\nTotal Interest: ${formatNumber(result.totalInterest)}\nTotal Payment: ${formatNumber(result.totalPayment)}`;
    copyToClipboard(text, "EMI details", toast);
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="size-5 text-green-500" />
            Loan EMI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="loan-amount">Loan Amount</Label>
            <Input
              id="loan-amount"
              type="number"
              placeholder="e.g. 500000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              min={0}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
            <Input
              id="interest-rate"
              type="number"
              placeholder="e.g. 8.5"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              min={0}
              step={0.1}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="loan-tenure">Loan Tenure</Label>
              <Input
                id="loan-tenure"
                type="number"
                placeholder="e.g. 20"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                min={0}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tenure Unit</Label>
              <Select
                value={tenureUnit}
                onValueChange={(v) => setTenureUnit(v as "years" | "months")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="years">Years</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCalculate} className="gap-2">
              <Calculator className="size-4" />
              Calculate EMI
            </Button>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>

          {result && (
            <>
              <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground">Monthly EMI</p>
                    <p className="text-2xl font-bold mt-1">{formatNumber(result.emi)}</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground">Total Interest</p>
                    <p className="text-2xl font-bold mt-1 text-red-500">
                      {formatNumber(result.totalInterest)}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground">Total Payment</p>
                    <p className="text-2xl font-bold mt-1">{formatNumber(result.totalPayment)}</p>
                  </div>
                </div>

                {/* Visual breakdown bar */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Payment Breakdown</p>
                  <div className="flex h-6 rounded-full overflow-hidden">
                    <div
                      className="bg-primary flex items-center justify-center text-xs text-primary-foreground font-medium transition-all duration-500"
                      style={{ width: `${result.principalPercent}%` }}
                    >
                      {result.principalPercent.toFixed(1)}%
                    </div>
                    <div
                      className="bg-red-400 flex items-center justify-center text-xs text-white font-medium transition-all duration-500"
                      style={{ width: `${result.interestPercent}%` }}
                    >
                      {result.interestPercent.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="size-3 rounded-sm bg-primary" />
                      Principal
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-3 rounded-sm bg-red-400" />
                      Interest
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                  <Copy className="size-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                  <Printer className="size-4" />
                  Print
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── 5. GST Calculator ────────────────────────────────────────────────
export function GSTCalculator() {
  const { toast } = useToast();
  const [amount, setAmount] = React.useState<string>("");
  const [gstRate, setGstRate] = React.useState<string>("18");
  const [customRate, setCustomRate] = React.useState<string>("");
  const [mode, setMode] = React.useState<"add" | "remove">("add");
  const [result, setResult] = React.useState<{
    originalAmount: number;
    cgst: number;
    sgst: number;
    totalAmount: number;
    gstAmount: number;
  } | null>(null);

  const effectiveRate = gstRate === "custom" ? parseFloat(customRate) || 0 : parseFloat(gstRate);

  const handleCalculate = () => {
    const a = parseFloat(amount);
    const r = effectiveRate;
    if (!a || a <= 0 || r <= 0) return;

    if (mode === "add") {
      const gstAmount = (a * r) / 100;
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      setResult({
        originalAmount: a,
        cgst,
        sgst,
        gstAmount,
        totalAmount: a + gstAmount,
      });
    } else {
      // Remove GST: total = amount (inclusive). original = amount / (1 + rate/100)
      const originalAmount = a / (1 + r / 100);
      const gstAmount = a - originalAmount;
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      setResult({
        originalAmount,
        cgst,
        sgst,
        gstAmount,
        totalAmount: a,
      });
    }
  };

  const handleReset = () => {
    setAmount("");
    setGstRate("18");
    setCustomRate("");
    setMode("add");
    setResult(null);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Original: ${formatNumber(result.originalAmount)}\nCGST: ${formatNumber(result.cgst)}\nSGST: ${formatNumber(result.sgst)}\nGST: ${formatNumber(result.gstAmount)}\nTotal: ${formatNumber(result.totalAmount)}`;
    copyToClipboard(text, "GST details", toast);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="size-5 text-amber-500" />
            GST Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode toggle */}
          <div className="grid gap-2">
            <Label>Mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={mode === "add" ? "default" : "outline"}
                size="sm"
                onClick={() => { setMode("add"); setResult(null); }}
                className="gap-2"
              >
                <Plus className="size-4" />
                Add GST
              </Button>
              <Button
                variant={mode === "remove" ? "default" : "outline"}
                size="sm"
                onClick={() => { setMode("remove"); setResult(null); }}
                className="gap-2"
              >
                <Minus className="size-4" />
                Remove GST
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gst-amount">
              {mode === "add" ? "Base Amount" : "Amount (Incl. GST)"}
            </Label>
            <Input
              id="gst-amount"
              type="number"
              placeholder="e.g. 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0}
            />
          </div>

          <div className="grid gap-2">
            <Label>GST Rate</Label>
            <Select value={gstRate} onValueChange={setGstRate}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
                <SelectItem value="custom">Custom Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {gstRate === "custom" && (
            <div className="grid gap-2">
              <Label htmlFor="custom-gst-rate">Custom GST Rate (%)</Label>
              <Input
                id="custom-gst-rate"
                type="number"
                placeholder="e.g. 3"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                min={0}
                step={0.1}
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleCalculate} disabled={!amount} className="gap-2">
              <Calculator className="size-4" />
              Calculate
            </Button>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>

          {result && (
            <>
              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Original Amount</p>
                    <p className="text-lg font-bold mt-1">
                      {formatNumber(result.originalAmount)}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Total GST ({effectiveRate}%)</p>
                    <p className="text-lg font-bold mt-1 text-amber-600 dark:text-amber-400">
                      {formatNumber(result.gstAmount)}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">CGST ({effectiveRate / 2}%)</p>
                    <p className="text-lg font-bold mt-1">{formatNumber(result.cgst)}</p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">SGST ({effectiveRate / 2}%)</p>
                    <p className="text-lg font-bold mt-1">{formatNumber(result.sgst)}</p>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-3xl font-bold mt-1">{formatNumber(result.totalAmount)}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                <Copy className="size-4" />
                Copy
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}