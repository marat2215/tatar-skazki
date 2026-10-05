"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = { label: string; value: number };

/** Столбики активности за последние дни (цвета берутся из CSS-переменных темы) */
export function ActivityChart({ data, label }: { data: Point[]; label: string }) {
  return (
    <div className="h-48 w-full" role="img" aria-label={`${label}: ${data.map((d) => `${d.label} — ${d.value}`).join(", ")}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: -24 }}>
          <XAxis dataKey="label" tickLine={false} axisLine={false} interval={1} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))" }}
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              color: "hsl(var(--foreground))",
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" name="●" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
