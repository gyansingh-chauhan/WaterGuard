import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

interface DataPoint {
  time: string;
  ph: number;
  turbidity: number;
  tds: number;
  temp: number;
  cond: number;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function useSimulatedStream() {
  const [series, setSeries] = useState<DataPoint[]>([]);
  const seed = useRef({ ph: 7.0, turbidity: 2.5, tds: 320, temp: 27, cond: 550 });

  useEffect(() => {
    const start = Date.now() - 29 * 1500;
    const initial: DataPoint[] = Array.from({ length: 30 }).map((_, i) => {
      const t = new Date(start + i * 1500).toLocaleTimeString();
      const nudge = () => Math.random() - 0.5;
      seed.current.ph = clamp(seed.current.ph + nudge() * 0.05, 6.4, 8.8);
      seed.current.turbidity = clamp(seed.current.turbidity + nudge() * 0.3, 0.5, 8);
      seed.current.tds = clamp(seed.current.tds + nudge() * 10, 50, 1200);
      seed.current.temp = clamp(seed.current.temp + nudge() * 0.3, 10, 40);
      seed.current.cond = clamp(seed.current.cond + nudge() * 8, 100, 1500);
      return { time: t, ...seed.current } as DataPoint;
    });
    setSeries(initial);

    const id = setInterval(() => {
      const t = new Date().toLocaleTimeString();
      const nudge = () => Math.random() - 0.5;
      seed.current.ph = clamp(seed.current.ph + nudge() * 0.05, 6.0, 9.2);
      seed.current.turbidity = clamp(seed.current.turbidity + nudge() * 0.4, 0.2, 10);
      seed.current.tds = clamp(seed.current.tds + nudge() * 12, 30, 1500);
      seed.current.temp = clamp(seed.current.temp + nudge() * 0.4, 8, 45);
      seed.current.cond = clamp(seed.current.cond + nudge() * 12, 80, 2000);
      setSeries((prev) => [...prev.slice(-29), { time: t, ...seed.current }]);
    }, 1500);

    return () => clearInterval(id);
  }, []);

  const latest = series[series.length - 1];
  return { series, latest };
}

function getRiskLabel(d: DataPoint | undefined) {
  if (!d) return { level: "Unknown", color: "secondary" as const };
  let score = 0;
  if (d.turbidity > 5) score += 2;
  if (d.turbidity > 8) score += 2;
  if (d.tds > 500) score += 1;
  if (d.tds > 1000) score += 1;
  if (d.ph < 6.5 || d.ph > 8.5) score += 2;
  if (d.temp > 30) score += 1;
  if (d.cond > 800) score += 1;

  if (score >= 6) return { level: "Critical", color: "destructive" as const };
  if (score >= 4) return { level: "High", color: "default" as const };
  if (score >= 2) return { level: "Moderate", color: "secondary" as const };
  return { level: "Low", color: "secondary" as const };
}

const Dashboard = () => {
  const { series, latest } = useSimulatedStream();
  const risk = useMemo(() => getRiskLabel(latest), [latest]);

  const title = "Live Water Quality Dashboard | WaterGuard";
  const description = "Real-time IoT water quality metrics with risk estimation for waterborne disease spread.";
  const canonical = typeof window !== "undefined" ? window.location.origin + "/dashboard" : "";

  return (
    <main className="container py-10 space-y-8">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Live Water Quality</h1>
          <p className="text-muted-foreground">Streaming from simulated IoT sensors</p>
        </div>
        <Badge variant={risk.color}>Risk: {risk.level}</Badge>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>pH</CardTitle>
            <CardDescription>Ideal range: 6.5 – 8.5</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{latest?.ph.toFixed(2)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Turbidity</CardTitle>
            <CardDescription>NTU (lower is better)</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{latest?.turbidity.toFixed(1)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>TDS</CardTitle>
            <CardDescription>ppm</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{Math.round(latest?.tds ?? 0)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Temperature</CardTitle>
            <CardDescription>°C</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{latest?.temp.toFixed(1)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conductivity</CardTitle>
            <CardDescription>µS/cm</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{Math.round(latest?.cond ?? 0)}</CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Trends</CardTitle>
            <CardDescription>Last ~45 seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <LineChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" hide />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="ph" stroke="hsl(var(--brand-1))" dot={false} name="pH" />
                  <Line yAxisId="left" type="monotone" dataKey="turbidity" stroke="hsl(var(--brand-2))" dot={false} name="Turbidity" />
                  <Line yAxisId="right" type="monotone" dataKey="tds" stroke="hsl(var(--primary))" dot={false} name="TDS" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Dashboard;
