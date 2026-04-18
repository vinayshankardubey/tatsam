"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const GOLD = "#C9A35A";
const MAROON = "#8B2C2C";
const AMBER = "#F4B860";
const BROWN = "#2B1F1A";

export function ReadingsOverTimeChart({
  data,
}: {
  data: Array<{ date: string; count: number }>;
}) {
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-5 md:p-6">
      <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
        Readings over the last 30 days
      </p>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
            <CartesianGrid stroke="#EADFCD" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke={BROWN}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                const d = new Date(v);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis
              stroke={BROWN}
              fontSize={11}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#FFF",
                border: `1px solid ${GOLD}`,
                borderRadius: 8,
              }}
              labelStyle={{ color: BROWN, fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={MAROON}
              strokeWidth={2.5}
              dot={{ fill: AMBER, r: 3 }}
              activeDot={{ r: 5, fill: MAROON }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PlanBreakdownChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  const colors = [MAROON, GOLD, AMBER];
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-5 md:p-6">
      <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
        Plan mix
      </p>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={2}
              label={({ name, percent }) =>
                `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
              }
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: BROWN }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
