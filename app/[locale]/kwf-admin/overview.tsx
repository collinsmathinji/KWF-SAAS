"use client"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const data = [
  {
    name: "Jan",
    revenue: 18000,
    users: 120,
  },
  {
    name: "Feb",
    revenue: 22000,
    users: 132,
  },
  {
    name: "Mar",
    revenue: 25000,
    users: 145,
  },
  {
    name: "Apr",
    revenue: 28000,
    users: 162,
  },
  {
    name: "May",
    revenue: 32000,
    users: 180,
  },
  {
    name: "Jun",
    revenue: 38000,
    users: 210,
  },
  {
    name: "Jul",
    revenue: 42000,
    users: 240,
  },
  {
    name: "Aug",
    revenue: 45000,
    users: 270,
  },
  {
    name: "Sep",
    revenue: 48000,
    users: 300,
  },
  {
    name: "Oct",
    revenue: 52000,
    users: 330,
  },
  {
    name: "Nov",
    revenue: 56000,
    users: 360,
  },
  {
    name: "Dec",
    revenue: 60000,
    users: 390,
  },
]

export function Overview() {
  return (
    <Tabs defaultValue="revenue" className="w-full">
      <div className="flex justify-between items-center">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="revenue" className="mt-4">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value) => [`$${value}`, "Revenue"]}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "none",
              }}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} className="animate-pulse-slow" />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="users" className="mt-4">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value) => [value, "Users"]}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "none",
              }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              className="animate-pulse-slow"
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}

