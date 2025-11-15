'use client';

import { BarChart, PieChart } from "@/components/dashboard/custom-charts";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Globe, Briefcase } from "lucide-react";
import Link from 'next/link';

const kpiData = [
  { title: "Total Profit", value: 51880, icon: TrendingUp, change: "+15.2%", changeType: "increase", subtext: "vs last month", prefix: "$" },
  { title: "Total Staff", value: 18, icon: Users, change: "+2", changeType: "increase", subtext: "vs last month" },
  { title: "Top Lead Source", value: 100, icon: Globe, change: "+100", changeType: "increase", subtext: "vs last month", prefix: "Website " },
  { title: "Total Freelancers", value: 7, icon: Briefcase, change: "+3", changeType: "increase", subtext: "vs last month" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Link href="#" key={index}>
            <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 bg-card">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                <div className="text-primary">
                  <kpi.icon className="h-8 w-8" />
                </div>
                <p className="text-sm font-semibold text-foreground">{kpi.title}</p>
                <p className="text-lg font-bold text-muted-foreground">
                  <AnimatedCounter from={0} to={kpi.value} prefix={kpi.prefix} />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm bg-card text-card-foreground">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart />
          </CardContent>
        </Card>
        <Card className="shadow-sm bg-card text-card-foreground">
          <CardHeader className="flex flex-row justify-between items-center">
             <CardTitle>Staff Management</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart type="staff" />
          </CardContent>
        </Card>
        <Card className="shadow-sm bg-card text-card-foreground">
           <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Source</CardTitle>
          </CardHeader>
          <CardContent>
           <PieChart type="source" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
