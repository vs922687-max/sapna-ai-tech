import { useEffect, useMemo, useState } from "react";
import { ActionBar, Field, Stat, copyText, inputCls } from "./ui-primitives";

const I = inputCls();

function fmtINR(n: number) { return isFinite(n) ? "₹ " + n.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "—"; }

export function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [as, setAs] = useState(new Date().toISOString().slice(0, 10));
  const r = useMemo(() => {
    if (!dob) return null;
    const d1 = new Date(dob); const d2 = new Date(as);
    if (isNaN(+d1) || isNaN(+d2) || d2 < d1) return null;
    let y = d2.getFullYear() - d1.getFullYear();
    let m = d2.getMonth() - d1.getMonth();
    let d = d2.getDate() - d1.getDate();
    if (d < 0) { m--; d += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const days = Math.floor((+d2 - +d1) / 86400000);
    return { y, m, d, days, weeks: Math.floor(days / 7), months: y * 12 + m };
  }, [dob, as]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Date of birth"><input type="date" className={I} value={dob} onChange={(e) => setDob(e.target.value)} /></Field>
        <Field label="Age as of"><input type="date" className={I} value={as} onChange={(e) => setAs(e.target.value)} /></Field>
      </div>
      {r && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          <Stat label="Years" value={r.y} /><Stat label="Months" value={r.m} /><Stat label="Days" value={r.d} />
          <Stat label="Total days" value={r.days.toLocaleString()} /><Stat label="Total weeks" value={r.weeks.toLocaleString()} />
        </div>
      )}
    </div>
  );
}

export function EmiCalculator() {
  const [p, setP] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [n, setN] = useState(240);
  const r = rate / 12 / 100;
  const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n; const interest = total - p;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Loan amount (₹)"><input type="number" className={I} value={p} onChange={(e) => setP(+e.target.value)} /></Field>
        <Field label="Interest rate (% p.a.)"><input type="number" step="0.1" className={I} value={rate} onChange={(e) => setRate(+e.target.value)} /></Field>
        <Field label="Tenure (months)"><input type="number" className={I} value={n} onChange={(e) => setN(+e.target.value)} /></Field>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Stat label="EMI" value={fmtINR(emi)} />
        <Stat label="Total interest" value={fmtINR(interest)} />
        <Stat label="Total payment" value={fmtINR(total)} />
      </div>
    </div>
  );
}

function GstBase({ mode }: { mode: "add" | "remove" }) {
  const [amt, setAmt] = useState(1000);
  const [rate, setRate] = useState(18);
  const { base, tax, total } = useMemo(() => {
    if (mode === "add") { const tax = (amt * rate) / 100; return { base: amt, tax, total: amt + tax }; }
    const base = amt / (1 + rate / 100); return { base, tax: amt - base, total: amt };
  }, [amt, rate, mode]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={mode === "add" ? "Base amount (₹)" : "Total amount (₹)"}><input type="number" className={I} value={amt} onChange={(e) => setAmt(+e.target.value)} /></Field>
        <Field label="GST rate (%)">
          <select className={I} value={rate} onChange={(e) => setRate(+e.target.value)}>
            {[0, 3, 5, 12, 18, 28].map((v) => <option key={v} value={v}>{v}%</option>)}
          </select>
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat label="Base" value={fmtINR(base)} />
        <Stat label="GST" value={fmtINR(tax)} />
        <Stat label="Total" value={fmtINR(total)} />
      </div>
    </div>
  );
}
export const GstCalculator = () => <GstBase mode="add" />;
export const GstExclusive = () => <GstBase mode="add" />;
export const GstInclusive = () => <GstBase mode="remove" />;

export function SipCalculator() {
  const [m, setM] = useState(10000);
  const [rate, setRate] = useState(12);
  const [y, setY] = useState(10);
  const n = y * 12; const r = rate / 12 / 100;
  const fv = m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = m * n;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Monthly investment (₹)"><input type="number" className={I} value={m} onChange={(e) => setM(+e.target.value)} /></Field>
        <Field label="Expected return (% p.a.)"><input type="number" step="0.1" className={I} value={rate} onChange={(e) => setRate(+e.target.value)} /></Field>
        <Field label="Duration (years)"><input type="number" className={I} value={y} onChange={(e) => setY(+e.target.value)} /></Field>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Stat label="Invested" value={fmtINR(invested)} />
        <Stat label="Est. returns" value={fmtINR(fv - invested)} />
        <Stat label="Future value" value={fmtINR(fv)} />
      </div>
    </div>
  );
}
export const LoanCalculator = EmiCalculator;

export function PercentageCalculator() {
  const [a, setA] = useState(50); const [b, setB] = useState(200);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Value A"><input type="number" className={I} value={a} onChange={(e) => setA(+e.target.value)} /></Field>
        <Field label="Value B"><input type="number" className={I} value={b} onChange={(e) => setB(+e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Stat label={`${a}% of ${b}`} value={((a * b) / 100).toFixed(2)} />
        <Stat label={`${a} is X% of ${b}`} value={b ? ((a / b) * 100).toFixed(2) + "%" : "—"} />
        <Stat label={`% change A→B`} value={a ? (((b - a) / a) * 100).toFixed(2) + "%" : "—"} />
      </div>
    </div>
  );
}

export function BmiCalculator() {
  const [h, setH] = useState(170); const [w, setW] = useState(70);
  const bmi = w / Math.pow(h / 100, 2);
  const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Height (cm)"><input type="number" className={I} value={h} onChange={(e) => setH(+e.target.value)} /></Field>
        <Field label="Weight (kg)"><input type="number" className={I} value={w} onChange={(e) => setW(+e.target.value)} /></Field>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="BMI" value={bmi.toFixed(1)} />
        <Stat label="Category" value={cat} />
      </div>
    </div>
  );
}

export function BmrCalculator() {
  const [age, setAge] = useState(30);
  const [h, setH] = useState(170); const [w, setW] = useState(70);
  const [sex, setSex] = useState<"m" | "f">("m");
  const bmr = 10 * w + 6.25 * h - 5 * age + (sex === "m" ? 5 : -161);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Age"><input type="number" className={I} value={age} onChange={(e) => setAge(+e.target.value)} /></Field>
        <Field label="Height (cm)"><input type="number" className={I} value={h} onChange={(e) => setH(+e.target.value)} /></Field>
        <Field label="Weight (kg)"><input type="number" className={I} value={w} onChange={(e) => setW(+e.target.value)} /></Field>
        <Field label="Sex">
          <select className={I} value={sex} onChange={(e) => setSex(e.target.value as never)}><option value="m">Male</option><option value="f">Female</option></select>
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="BMR" value={Math.round(bmr) + " kcal"} />
        <Stat label="Sedentary" value={Math.round(bmr * 1.2) + " kcal"} />
        <Stat label="Moderate" value={Math.round(bmr * 1.55) + " kcal"} />
        <Stat label="Very active" value={Math.round(bmr * 1.9) + " kcal"} />
      </div>
    </div>
  );
}

export function DiscountCalculator() {
  const [p, setP] = useState(1999); const [d, setD] = useState(20);
  const off = (p * d) / 100; const final = p - off;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Price (₹)"><input type="number" className={I} value={p} onChange={(e) => setP(+e.target.value)} /></Field>
        <Field label="Discount %"><input type="number" className={I} value={d} onChange={(e) => setD(+e.target.value)} /></Field>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="You save" value={fmtINR(off)} />
        <Stat label="Final price" value={fmtINR(final)} />
      </div>
    </div>
  );
}

export function ProfitCalculator() {
  const [cp, setCp] = useState(100); const [sp, setSp] = useState(150);
  const profit = sp - cp; const pct = cp ? (profit / cp) * 100 : 0;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Cost price (₹)"><input type="number" className={I} value={cp} onChange={(e) => setCp(+e.target.value)} /></Field>
        <Field label="Selling price (₹)"><input type="number" className={I} value={sp} onChange={(e) => setSp(+e.target.value)} /></Field>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label={profit >= 0 ? "Profit" : "Loss"} value={fmtINR(Math.abs(profit))} />
        <Stat label="% change" value={pct.toFixed(2) + "%"} />
      </div>
    </div>
  );
}

export function ProfitMargin() {
  const [cost, setCost] = useState(100); const [rev, setRev] = useState(150);
  const margin = rev ? ((rev - cost) / rev) * 100 : 0;
  const markup = cost ? ((rev - cost) / cost) * 100 : 0;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Cost (₹)"><input type="number" className={I} value={cost} onChange={(e) => setCost(+e.target.value)} /></Field>
        <Field label="Revenue (₹)"><input type="number" className={I} value={rev} onChange={(e) => setRev(+e.target.value)} /></Field>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Gross margin" value={margin.toFixed(2) + "%"} />
        <Stat label="Markup" value={markup.toFixed(2) + "%"} />
      </div>
    </div>
  );
}

export function DateDifference() {
  const [a, setA] = useState(""); const [b, setB] = useState("");
  const r = useMemo(() => {
    if (!a || !b) return null;
    const d1 = new Date(a); const d2 = new Date(b);
    const days = Math.round((+d2 - +d1) / 86400000);
    return { days: Math.abs(days), weeks: Math.floor(Math.abs(days) / 7), months: Math.floor(Math.abs(days) / 30), years: Math.floor(Math.abs(days) / 365) };
  }, [a, b]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Start date"><input type="date" className={I} value={a} onChange={(e) => setA(e.target.value)} /></Field>
        <Field label="End date"><input type="date" className={I} value={b} onChange={(e) => setB(e.target.value)} /></Field>
      </div>
      {r && <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Days" value={r.days} /><Stat label="Weeks" value={r.weeks} /><Stat label="Months" value={r.months} /><Stat label="Years" value={r.years} />
      </div>}
    </div>
  );
}

export function TimeCalculator() {
  const [a, setA] = useState("01:30:00"); const [b, setB] = useState("00:45:30");
  const [op, setOp] = useState<"+" | "-">("+");
  const toSec = (s: string) => { const [h, m, sec] = s.split(":").map((x) => +x || 0); return h * 3600 + m * 60 + sec; };
  const total = op === "+" ? toSec(a) + toSec(b) : toSec(a) - toSec(b);
  const abs = Math.abs(total);
  const out = `${Math.floor(abs / 3600).toString().padStart(2, "0")}:${Math.floor((abs % 3600) / 60).toString().padStart(2, "0")}:${(abs % 60).toString().padStart(2, "0")}`;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Time A (HH:MM:SS)"><input className={I} value={a} onChange={(e) => setA(e.target.value)} /></Field>
        <Field label="Operation"><select className={I} value={op} onChange={(e) => setOp(e.target.value as never)}><option value="+">Add</option><option value="-">Subtract</option></select></Field>
        <Field label="Time B"><input className={I} value={b} onChange={(e) => setB(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><Stat label="Result" value={(total < 0 ? "-" : "") + out} /></div>
    </div>
  );
}

const UNITS = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000 },
  volume: { l: 1, ml: 0.001, "m³": 1000, gal: 3.78541, "fl oz": 0.0295735, cup: 0.24 },
} as const;
type UnitCat = keyof typeof UNITS;

export function UnitConverter() {
  const [cat, setCat] = useState<UnitCat>("length");
  const cats = UNITS[cat];
  const keys = Object.keys(cats);
  const [from, setFrom] = useState(keys[0]);
  const [to, setTo] = useState(keys[1]);
  const [val, setVal] = useState(1);
  useEffect(() => { setFrom(Object.keys(UNITS[cat])[0]); setTo(Object.keys(UNITS[cat])[1]); }, [cat]);
  const factor = (cats as Record<string, number>);
  const result = val * factor[from] / factor[to];
  const [tempFrom, setTempFrom] = useState("C"); const [tempTo, setTempTo] = useState("F"); const [tempVal, setTempVal] = useState(0);
  const toC = (v: number, u: string) => u === "C" ? v : u === "F" ? (v - 32) * 5 / 9 : v - 273.15;
  const fromC = (v: number, u: string) => u === "C" ? v : u === "F" ? v * 9 / 5 + 32 : v + 273.15;
  const tempOut = fromC(toC(tempVal, tempFrom), tempTo);
  return (
    <div>
      <Field label="Category">
        <select className={I} value={cat} onChange={(e) => setCat(e.target.value as UnitCat)}>
          <option value="length">Length</option><option value="weight">Weight</option><option value="volume">Volume</option>
        </select>
      </Field>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field label="Value"><input type="number" className={I} value={val} onChange={(e) => setVal(+e.target.value)} /></Field>
        <Field label="From"><select className={I} value={from} onChange={(e) => setFrom(e.target.value)}>{keys.map(k => <option key={k}>{k}</option>)}</select></Field>
        <Field label="To"><select className={I} value={to} onChange={(e) => setTo(e.target.value)}>{keys.map(k => <option key={k}>{k}</option>)}</select></Field>
      </div>
      <div className="mt-3"><Stat label="Result" value={result.toLocaleString(undefined, { maximumFractionDigits: 6 })} /></div>
      <div className="mt-6 border-t border-border/60 pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Temperature</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Value"><input type="number" className={I} value={tempVal} onChange={(e) => setTempVal(+e.target.value)} /></Field>
          <Field label="From"><select className={I} value={tempFrom} onChange={(e) => setTempFrom(e.target.value)}><option>C</option><option>F</option><option>K</option></select></Field>
          <Field label="To"><select className={I} value={tempTo} onChange={(e) => setTempTo(e.target.value)}><option>C</option><option>F</option><option>K</option></select></Field>
        </div>
        <div className="mt-3"><Stat label="Result" value={tempOut.toFixed(2) + "°" + tempTo} /></div>
      </div>
    </div>
  );
}

export function CurrencyConverter() {
  const [from, setFrom] = useState("USD"); const [to, setTo] = useState("INR");
  const [amt, setAmt] = useState(100);
  const [rate, setRate] = useState<number | null>(null);
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true); setErr("");
    fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((d) => { if (d?.rates?.[to]) setRate(d.rates[to]); else setErr("Rate unavailable"); })
      .catch(() => setErr("Failed to fetch rates"))
      .finally(() => setLoading(false));
  }, [from, to]);
  const currencies = ["INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SGD", "AED", "SAR", "HKD", "NZD", "ZAR"];
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Amount"><input type="number" className={I} value={amt} onChange={(e) => setAmt(+e.target.value)} /></Field>
        <Field label="From"><select className={I} value={from} onChange={(e) => setFrom(e.target.value)}>{currencies.map(c => <option key={c}>{c}</option>)}</select></Field>
        <Field label="To"><select className={I} value={to} onChange={(e) => setTo(e.target.value)}>{currencies.map(c => <option key={c}>{c}</option>)}</select></Field>
      </div>
      <div className="mt-4">
        <Stat label={loading ? "Loading…" : err || `1 ${from} = ${rate ?? "?"} ${to}`} value={rate ? (amt * rate).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " " + to : "—"} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Rates via frankfurter.app (ECB reference rates)</p>
    </div>
  );
}

export function FuelCost() {
  const [dist, setDist] = useState(100); const [mileage, setMileage] = useState(15); const [price, setPrice] = useState(105);
  const litres = dist / mileage; const cost = litres * price;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Distance (km)"><input type="number" className={I} value={dist} onChange={(e) => setDist(+e.target.value)} /></Field>
        <Field label="Mileage (km/L)"><input type="number" className={I} value={mileage} onChange={(e) => setMileage(+e.target.value)} /></Field>
        <Field label="Fuel price (₹/L)"><input type="number" className={I} value={price} onChange={(e) => setPrice(+e.target.value)} /></Field>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Fuel needed" value={litres.toFixed(2) + " L"} />
        <Stat label="Trip cost" value={fmtINR(cost)} />
      </div>
    </div>
  );
}

export function SimpleInterest() {
  const [p, setP] = useState(10000); const [r, setR] = useState(7); const [t, setT] = useState(5);
  const si = (p * r * t) / 100;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Principal (₹)"><input type="number" className={I} value={p} onChange={(e) => setP(+e.target.value)} /></Field>
        <Field label="Rate (% p.a.)"><input type="number" step="0.1" className={I} value={r} onChange={(e) => setR(+e.target.value)} /></Field>
        <Field label="Time (years)"><input type="number" className={I} value={t} onChange={(e) => setT(+e.target.value)} /></Field>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Interest" value={fmtINR(si)} />
        <Stat label="Total" value={fmtINR(p + si)} />
      </div>
    </div>
  );
}

export function CompoundInterest() {
  const [p, setP] = useState(10000); const [r, setR] = useState(7); const [t, setT] = useState(5); const [n, setN] = useState(1);
  const amt = p * Math.pow(1 + r / 100 / n, n * t);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Principal (₹)"><input type="number" className={I} value={p} onChange={(e) => setP(+e.target.value)} /></Field>
        <Field label="Rate (% p.a.)"><input type="number" step="0.1" className={I} value={r} onChange={(e) => setR(+e.target.value)} /></Field>
        <Field label="Time (years)"><input type="number" className={I} value={t} onChange={(e) => setT(+e.target.value)} /></Field>
        <Field label="Compound/year">
          <select className={I} value={n} onChange={(e) => setN(+e.target.value)}>
            <option value={1}>Annually</option><option value={2}>Semi</option><option value={4}>Quarterly</option><option value={12}>Monthly</option><option value={365}>Daily</option>
          </select>
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Interest" value={fmtINR(amt - p)} />
        <Stat label="Total" value={fmtINR(amt)} />
      </div>
    </div>
  );
}

export { ActionBar as _AB, copyText as _cp }; // silence unused
