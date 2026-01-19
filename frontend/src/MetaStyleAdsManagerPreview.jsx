import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import {
  ChevronDown,
  Filter,
  SlidersHorizontal,
  Calendar as CalendarIcon,
  RefreshCcw,
  Search,
  BarChart3,
  Layers,
  Megaphone,
  Target,
  Settings,
  Bell,
} from "lucide-react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function formatGBP(n) {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(v);
}

function format2(n) {
  const v = Number.isFinite(n) ? n : 0;
  return v.toFixed(2);
}

function formatDateISO(d) {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISO(s) {
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

const PRESETS = [
  { key: "today", label: "Today", getRange: () => ({ from: startOfToday(), to: new Date() }) },
  { key: "yesterday", label: "Yesterday", getRange: () => {
      const t = startOfToday();
      return { from: addDays(t, -1), to: addDays(t, 0) };
    }
  },
  { key: "last7", label: "Last 7 days", getRange: () => {
      const t = startOfToday();
      return { from: addDays(t, -6), to: new Date() };
    }
  },
  { key: "last14", label: "Last 14 days", getRange: () => {
      const t = startOfToday();
      return { from: addDays(t, -13), to: new Date() };
    }
  },
  { key: "last30", label: "Last 30 days", getRange: () => {
      const t = startOfToday();
      return { from: addDays(t, -29), to: new Date() };
    }
  },
  { key: "thisMonth", label: "This month", getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from, to: now };
    }
  },
];

function DateRangePicker({ value, onChange }) {
  const label = useMemo(() => {
    const from = value?.from ? formatDateISO(value.from) : "";
    const to = value?.to ? formatDateISO(value.to) : "";
    if (!from || !to) return "Select dates";
    // FB-like compact label
    return `${from} → ${to}`;
  }, [value]);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("preset");
  const [customFrom, setCustomFrom] = useState(value?.from ? formatDateISO(value.from) : formatDateISO(startOfToday()));
  const [customTo, setCustomTo] = useState(value?.to ? formatDateISO(value.to) : formatDateISO(new Date()));

  const applyCustom = () => {
    const f = parseISO(customFrom);
    const t = parseISO(customTo);
    if (!f || !t) return;
    // ensure from <= to
    const from = f.getTime() <= t.getTime() ? f : t;
    const to = f.getTime() <= t.getTime() ? t : f;
    onChange?.({ from, to });
    setOpen(false);
  };

  const applyPreset = (p) => {
    const r = p.getRange();
    setCustomFrom(formatDateISO(r.from));
    setCustomTo(formatDateISO(r.to));
    onChange?.(r);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 gap-2 rounded-xl">
          <CalendarIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{label}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] rounded-2xl p-0 shadow-xl">
        <div className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold">Date range</div>
            <div className="flex gap-2">
              <Button
                variant={mode === "preset" ? "default" : "outline"}
                size="sm"
                className="rounded-xl"
                onClick={() => setMode("preset")}
              >
                Presets
              </Button>
              <Button
                variant={mode === "custom" ? "default" : "outline"}
                size="sm"
                className="rounded-xl"
                onClick={() => setMode("custom")}
              >
                Custom
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t" />

        {mode === "preset" ? (
          <div className="max-h-[320px] overflow-auto p-2">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => applyPreset(p)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <span className="font-medium">{p.label}</span>
                <span className="text-xs text-muted-foreground">{(() => {
                  const r = p.getRange();
                  return `${formatDateISO(r.from)} → ${formatDateISO(r.to)}`;
                })()}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">From</div>
                <Input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="h-9 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">To</div>
                <Input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="h-9 rounded-xl"
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="rounded-xl" onClick={applyCustom}>Apply</Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}



function StatusPill({ status }) {
  const variant = status === "Active" ? "default" : status === "Paused" ? "secondary" : "outline";
  const text = status;
  return (
    <Badge variant={variant} className="rounded-full px-2 py-0.5 text-xs">
      {text}
    </Badge>
  );
}

function RecommendationPill({ rec }) {
  const map = {
    Scale: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Turn off": "bg-red-50 text-red-700 border-red-200",
    Keep: "bg-slate-50 text-slate-700 border-slate-200",
    "Too early": "bg-amber-50 text-amber-800 border-amber-200",
  };
  const cls = map[rec] ?? "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>
      {rec}
    </span>
  );
}

function KPI({ label, value, hint }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          {hint ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground">i</button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[260px] text-xs">{hint}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

function EntityTable({ rows, columns, onRowClick }) {
  return (
    <div className="rounded-2xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            {columns.map((c) => (
              <TableHead key={c.key} className="whitespace-nowrap text-xs font-semibold">
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow
              key={r.id}
              className="cursor-pointer hover:bg-muted/40"
              onClick={() => onRowClick?.(r)}
            >
              {columns.map((c) => (
                <TableCell key={c.key} className="whitespace-nowrap text-sm">
                  {typeof c.render === "function" ? c.render(r) : r[c.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TopControls({ accountName, dateRange, setDateRange, query, setQuery }) {
  return (
    <div className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-muted flex items-center justify-center">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Ads Manager</div>
            <div className="text-xs text-muted-foreground">{accountName}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campaigns, ad sets, ads"
              className="h-9 w-[320px] rounded-xl pl-9"
            />
          </div>

          <DateRangePicker value={dateRange} onChange={setDateRange} />

          <Button variant="outline" className="h-9 rounded-xl gap-2">
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 rounded-xl gap-2">
                <span className="hidden sm:inline">Actions</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl">
              <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Save view</DropdownMenuItem>
              <DropdownMenuItem>Manage columns</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ active }) {
  const items = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "campaigns", label: "Campaigns", icon: Megaphone },
    { key: "adsets", label: "Ad Sets", icon: Target },
    { key: "ads", label: "Ads", icon: Layers },
    { key: "alerts", label: "Alerts", icon: Bell },
    { key: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <div className="hidden lg:flex h-[calc(100vh-0px)] w-64 flex-col border-r bg-background">
      <div className="p-4">
        <div className="rounded-2xl border bg-muted/30 p-3">
          <div className="text-xs font-semibold text-muted-foreground">Workspace</div>
          <div className="mt-1 text-sm font-semibold">Performance Console</div>
          <div className="mt-2 text-xs text-muted-foreground">Meta-like UI + your rules</div>
        </div>
      </div>
      <div className="px-3 pb-4">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.key;
          return (
            <div
              key={it.key}
              className={`mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                isActive ? "bg-muted font-semibold" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MetaStyleAdsManagerPreview() {
  const [view, setView] = useState("adsets");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [query, setQuery] = useState("");
  const [breakEvenROAS, setBreakEvenROAS] = useState(1.34);

  // State for real data from backend
  const [campaigns, setCampaigns] = useState([]);
  const [adsets, setAdsets] = useState([]);
  const [adsetInsights, setAdsetInsights] = useState([]);

  // Fetch data from Flask backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/campaigns")
      .then(res => res.json())
      .then(data => {
        console.log("CAMPAIGNS:", data);
        setCampaigns(data);
      })
      .catch(err => console.error("Campaign fetch error", err));

    fetch("http://127.0.0.1:5000/adsets")
      .then(res => res.json())
      .then(data => {
        console.log("ADSETS:", data);
        setAdsets(data);
      })
      .catch(err => console.error("Adset fetch error", err));
  }, []);

  // Fetch insights from backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/adsets/insights")
      .then(res => res.json())
      .then(data => setAdsetInsights(data))
      .catch(err => console.error("Insights fetch error", err))
  }, [])

  const [dateRange, setDateRange] = useState(() => {
    const p = PRESETS.find((x) => x.key === "today");
    return p.getRange();
  });

  const data = useMemo(() => {
    const insightsMap = Object.fromEntries(adsetInsights.map((i) => [i.adset_id, i]));

    const q = query.trim().toLowerCase();
    const filterByName = (arr, fields) => {
      if (!q) return arr;
      return arr.filter((x) => fields.some((f) => String(x[f] ?? "").toLowerCase().includes(q)));
    };

    // Map backend data to UI expectations
    const mappedCampaigns = campaigns.map(c => ({
      id: c.id,
      name: c.name,
      status: c.status === "PAUSED" ? "Paused" : "Active",
      spend: 0,
      purchases: 0,
      revenue: 0,
      roas: 0,
      cpp: 0
    }));

    const mappedAdsets = adsets.map(a => {
      const insight = insightsMap[a.id] || {};
      const spend = Number(insight.spend ?? 0);
      const purchases = Number(insight.purchases ?? 0);
      const revenue = Number(insight.revenue ?? 0);
      const roas = Number(insight.roas ?? 0);
      const cpp = purchases > 0 ? spend / purchases : null;
      
      const recommendation = spend > 0 && roas < breakEvenROAS ? "Turn off" : "Keep";
      
      return {
        id: a.id,
        name: a.name,
        campaign: a.campaign_id,
        status: a.status === "PAUSED" ? "Paused" : "Active",
        budget: a.daily_budget ?? 0,
        spend,
        purchases,
        revenue,
        roas,
        cpp,
        rec: recommendation
      };
    });

    const campaignsFiltered = filterByName(mappedCampaigns, ["name", "status"]);
    const adsetsFiltered = filterByName(mappedAdsets, ["name", "campaign", "status", "rec"]);
    const ads = [];

    const totals = {
      spend: adsetsFiltered.reduce((s, r) => s + r.spend, 0),
      purchases: adsetsFiltered.reduce((s, r) => s + r.purchases, 0),
      revenue: adsetsFiltered.reduce((s, r) => s + r.revenue, 0),
    };
    totals.roas = totals.spend > 0 ? totals.revenue / totals.spend : 0;
    totals.cpp = totals.purchases > 0 ? totals.spend / totals.purchases : 0;

    const top = [...adsetsFiltered].sort((a, b) => (b.roas ?? 0) - (a.roas ?? 0)).slice(0, 3);
    const off = adsetsFiltered
      .filter((r) => r.status === "Active")
      .filter((r) => r.spend >= 50 && (r.roas ?? 0) < breakEvenROAS)
      .sort((a, b) => (a.roas ?? 0) - (b.roas ?? 0));

    return { campaigns: campaignsFiltered, adsets: adsetsFiltered, ads, totals, top, off };
  }, [query, campaigns, adsets, adsetInsights, breakEvenROAS]);

  const openRow = (row) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const title = view === "campaigns" ? "Campaigns" : view === "adsets" ? "Ad Sets" : "Ads";

  const columnsByTab = useMemo(() => {
    if (view === "campaigns") {
      return [
        { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
        { key: "name", header: "Campaign" },
        { key: "spend", header: "Spend", render: (r) => formatGBP(r.spend) },
        { key: "purchases", header: "Purchases" },
        { key: "revenue", header: "Revenue", render: (r) => formatGBP(r.revenue) },
        { key: "roas", header: "ROAS", render: (r) => format2(r.roas) },
        { key: "cpp", header: "Cost / purchase", render: (r) => (r.purchases ? formatGBP(r.cpp) : "—") },
      ];
    }
    if (view === "ads") {
      return [
        { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
        { key: "name", header: "Ad" },
        { key: "adset", header: "Ad set" },
        { key: "spend", header: "Spend", render: (r) => formatGBP(r.spend) },
        { key: "purchases", header: "Purchases" },
        { key: "revenue", header: "Revenue", render: (r) => formatGBP(r.revenue) },
        { key: "roas", header: "ROAS", render: (r) => format2(r.roas) },
        { key: "cpp", header: "Cost / purchase", render: (r) => (r.purchases ? formatGBP(r.cpp) : "—") },
      ];
    }
    // adsets
    return [
      { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
      { key: "name", header: "Ad set" },
      { key: "campaign", header: "Campaign" },
      { key: "budget", header: "Budget (daily)", render: (r) => formatGBP(r.budget) },
      { key: "spend", header: "Spend", render: (r) => `£${Number(r.spend ?? 0).toFixed(2)}` },
      { key: "purchases", header: "Purchases" },
      { key: "revenue", header: "Revenue", render: (r) => `£${Number(r.revenue ?? 0).toFixed(2)}` },
      { key: "roas", header: "ROAS", render: (r) => Number(r.roas ?? 0).toFixed(2) },
      { key: "cpp", header: "Cost / purchase", render: (r) => (r.purchases ? `£${Number(r.cpp ?? 0).toFixed(2)}` : "—") },
      { key: "rec", header: "Recommendation", render: (r) => <RecommendationPill rec={r.rec} /> },
    ];
  }, [view]);

  const rows = view === "campaigns" ? data.campaigns : view === "adsets" ? data.adsets : [];

  return (
    <div className="min-h-screen bg-muted/30">
      <TopControls
        accountName="Nas • Meta Ad Account (Preview)"
        dateRange={dateRange}
        setDateRange={setDateRange}
        query={query}
        setQuery={setQuery}
      />

      <div className="flex">
        <Sidebar active={view} />

        <div className="mx-auto w-full max-w-7xl px-4 py-6">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold text-muted-foreground">{formatDateISO(dateRange.from)} → {formatDateISO(dateRange.to)}</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
              <div className="mt-1 text-sm text-muted-foreground">Meta-like view for campaigns, ad sets, and ads.</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" className="h-9 rounded-xl gap-2">
                <Filter className="h-4 w-4" /> Filters
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 rounded-xl gap-2">
                    <SlidersHorizontal className="h-4 w-4" /> Columns <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-2xl">
                  <DropdownMenuLabel>Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Performance (default)</DropdownMenuItem>
                  <DropdownMenuItem>Delivery</DropdownMenuItem>
                  <DropdownMenuItem>Engagement</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Customize…</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Select defaultValue="active">
                <SelectTrigger className="h-9 w-[180px] rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">Break-even ROAS:</label>
                <Input
                  type="number"
                  step="0.01"
                  value={breakEvenROAS}
                  onChange={(e) => setBreakEvenROAS(parseFloat(e.target.value) || 1.34)}
                  className="h-9 w-[100px] rounded-xl"
                />
              </div>

              <Button className="h-9 rounded-xl">Create</Button>
            </div>
          </div>

          {/* View buttons (Campaigns / Ad Sets / Ads) */}
          <div className="mt-5">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setView("campaigns")}
                className={`h-9 px-4 rounded-xl font-medium text-sm transition-colors ${
                  view === "campaigns"
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Campaigns
              </button>
              <button
                onClick={() => setView("adsets")}
                className={`h-9 px-4 rounded-xl font-medium text-sm transition-colors ${
                  view === "adsets"
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Ad Sets
              </button>
              <button
                onClick={() => setView("ads")}
                className={`h-9 px-4 rounded-xl font-medium text-sm transition-colors ${
                  view === "ads"
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Ads
              </button>
            </div>

            <div className="mt-4">
                {/* KPI row */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  <KPI label="Total spend" value={formatGBP(data.totals.spend)} />
                  <KPI label="Purchases" value={String(data.totals.purchases)} />
                  <KPI label="Revenue" value={formatGBP(data.totals.revenue)} />
                  <KPI label="Blended ROAS" value={format2(data.totals.roas)} hint={`Break-even ROAS: ${format2(breakEvenROAS)}`} />
                  <KPI label="Cost / purchase" value={data.totals.purchases ? formatGBP(data.totals.cpp) : "—"} />
                </div>

                {/* Winners/Losers strip */}
                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
                  <Card className="rounded-2xl shadow-sm lg:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Active performance (preview)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-muted-foreground">This is a UI preview. Wire it to Meta Insights API later.</div>
                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {data.top.map((x) => (
                          <div key={x.id} className="rounded-2xl border bg-muted/20 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-sm font-semibold line-clamp-2">{x.name}</div>
                              <RecommendationPill rec={x.rec} />
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">Spend {formatGBP(x.spend)} • ROAS {format2(x.roas)} • Purch {x.purchases}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Suggested turn-offs</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-muted-foreground">Rule: spend ≥ £50 and ROAS &lt; BE</div>
                      <div className="mt-3 space-y-2">
                        {data.off.length ? (
                          data.off.slice(0, 3).map((x) => (
                            <div key={x.id} className="rounded-2xl border bg-red-50/60 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="text-sm font-semibold line-clamp-2">{x.name}</div>
                                <span className="text-xs font-semibold text-red-700">OFF</span>
                              </div>
                              <div className="mt-2 text-xs text-red-800/80">Spend {formatGBP(x.spend)} • ROAS {format2(x.roas)} • Purch {x.purchases}</div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border bg-muted/20 p-3 text-sm">Nothing flagged right now.</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Table */}
                <div className="mt-4">
                  <div className="rounded-2xl border bg-background">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          {columnsByTab.map((c) => (
                            <TableHead key={c.key} className="whitespace-nowrap text-xs font-semibold">
                              {c.header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {view === "campaigns" &&
                          data.campaigns.map(c => (
                            <TableRow
                              key={c.id}
                              className="cursor-pointer hover:bg-muted/40"
                              onClick={() => openRow(c)}
                            >
                              {columnsByTab.map((col) => (
                                <TableCell key={col.key} className="whitespace-nowrap text-sm">
                                  {typeof col.render === "function" ? col.render(c) : c[col.key]}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        {view === "adsets" &&
                          data.adsets.map(a => (
                            <TableRow
                              key={a.id}
                              className="cursor-pointer hover:bg-muted/40"
                              onClick={() => openRow(a)}
                            >
                              {columnsByTab.map((col) => (
                                <TableCell key={col.key} className="whitespace-nowrap text-sm">
                                  {typeof col.render === "function" ? col.render(a) : a[col.key]}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Row Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-[420px] sm:w-[520px] rounded-l-2xl">
          <SheetHeader>
            <SheetTitle className="text-base">Details</SheetTitle>
          </SheetHeader>
          {selectedRow ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border bg-muted/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{selectedRow.name}</div>
                    {selectedRow.campaign ? (
                      <div className="mt-1 text-xs text-muted-foreground">Campaign: {selectedRow.campaign}</div>
                    ) : selectedRow.adset ? (
                      <div className="mt-1 text-xs text-muted-foreground">Ad set: {selectedRow.adset}</div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={selectedRow.status} />
                    {selectedRow.rec ? <RecommendationPill rec={selectedRow.rec} /> : null}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border bg-background p-3">
                    <div className="text-xs text-muted-foreground">Spend</div>
                    <div className="mt-1 text-lg font-semibold">{formatGBP(selectedRow.spend)}</div>
                  </div>
                  <div className="rounded-xl border bg-background p-3">
                    <div className="text-xs text-muted-foreground">ROAS</div>
                    <div className="mt-1 text-lg font-semibold">{format2(selectedRow.roas)}</div>
                  </div>
                  <div className="rounded-xl border bg-background p-3">
                    <div className="text-xs text-muted-foreground">Purchases</div>
                    <div className="mt-1 text-lg font-semibold">{selectedRow.purchases}</div>
                  </div>
                  <div className="rounded-xl border bg-background p-3">
                    <div className="text-xs text-muted-foreground">Cost / purchase</div>
                    <div className="mt-1 text-lg font-semibold">{selectedRow.purchases ? formatGBP(selectedRow.cpp || (selectedRow.spend / clamp(selectedRow.purchases, 1, 1e9))) : "—"}</div>
                  </div>
                </div>
              </div>

              <Card className="rounded-2xl shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Why this recommendation?</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-muted-foreground">
                  {selectedRow.rec === "Turn off" ? (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>ROAS {format2(selectedRow.roas)} is below break-even {format2(breakEvenROAS)}.</li>
                      <li>Spend {formatGBP(selectedRow.spend)} passed the minimum evaluation threshold.</li>
                      <li>Suggested action: pause this to protect blended ROAS.</li>
                    </ul>
                  ) : selectedRow.rec === "Scale" ? (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>ROAS {format2(selectedRow.roas)} is comfortably above break-even {format2(breakEvenROAS)}.</li>
                      <li>Stable purchases: {selectedRow.purchases} today.</li>
                      <li>Suggested action: increase budget or duplicate into new tests.</li>
                    </ul>
                  ) : (
                    <div>Not enough signal to recommend a strong action. Keep monitoring.</div>
                  )}

                  <div className="mt-3 rounded-xl border bg-muted/20 p-3 text-xs">
                    This is a UI preview. Later you’ll replace these numbers with Meta Insights data.
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button className="rounded-xl" variant="outline">View in Meta</Button>
                <Button 
                  className="rounded-xl"
                  onClick={async () => {
                    try {
                      const isCampaign = selectedRow.campaign === undefined;
                      const endpoint = isCampaign
                        ? `http://127.0.0.1:5000/campaigns/${selectedRow.id}/status`
                        : `http://127.0.0.1:5000/adsets/${selectedRow.id}/status`;
                      const nextStatus = selectedRow.status === "Paused" ? "ACTIVE" : "PAUSED";

                      await fetch(endpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: nextStatus })
                      });

                      const [campaignsRes, adsetsRes] = await Promise.all([
                        fetch("http://127.0.0.1:5000/campaigns"),
                        fetch("http://127.0.0.1:5000/adsets")
                      ]);

                      const [campaignsData, adsetsData] = await Promise.all([
                        campaignsRes.json(),
                        adsetsRes.json()
                      ]);

                      console.log("CAMPAIGNS (after action):", campaignsData);
                      console.log("ADSETS (after action):", adsetsData);

                      setCampaigns(campaignsData);
                      setAdsets(adsetsData);

                      setDrawerOpen(false);
                    } catch (err) {
                      console.error("Action error:", err);
                    }
                  }}
                >
                  {selectedRow.status === "Paused" ? "Resume" : "Pause"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 text-sm text-muted-foreground">Select a row to see details.</div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
