'use client';

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Type definitions
interface DayData {
  day: number;
  date: string;
  day_name: string;
  leads: number;
  salary: number;
}

interface StaffData {
  name: string;
  email: string;
  mobile: string;
  salary: string;
}

interface ApiResponse {
  staff: StaffData;
  year: number;
  month: number;
  monthly_salary: string;
  total_salary: number;
  months_list: [number, string][];
  daily_productivity_data: DayData[];
}

export default function ProductivityPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState<DayData[]>([]);
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [monthsList, setMonthsList] = useState<[number, string][]>([]);
  const [loading, setLoading] = useState(false); // Set to false initially
  const [error, setError] = useState("");
  const [staffId, setStaffId] = useState('1'); // Default staff ID

  const { toast } = useToast();
  
  const yearsList = Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i);

  // Mock data for UI display
  const mockCalendarData: DayData[] = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    date: `2023-10-${i + 1}`,
    day_name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i % 7],
    leads: Math.floor(Math.random() * 20),
    salary: Math.floor(Math.random() * 1000),
  }));

  const mockMonthsList: [number, string][] = [
    [1, 'January'], [2, 'February'], [3, 'March'], [4, 'April'],
    [5, 'May'], [6, 'June'], [7, 'July'], [8, 'August'],
    [9, 'September'], [10, 'October'], [11, 'November'], [12, 'December'],
  ];

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    setTimeout(() => {
      setCalendarData(mockCalendarData);
      setMonthsList(mockMonthsList);
      setStaffData({ name: "Mock Staff", email: "mock@example.com", mobile: "1234567890", salary: "50000" });
      setMonthlySalary(15000);
      setTotalSalary(150000);
      setLoading(false);
    }, 1000);
  }, []);

  // async function fetchCalendar() {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     if (!token) {
  //       throw new Error("Authentication token not found.");
  //     }

  //     console.log("=== FETCHING STAFF CALENDAR ===");
  //     console.log("Staff ID:", staffId);
  //     console.log("Year:", year);
  //     console.log("Month:", month);

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/staff/${staffId}/calendar/?year=${year}&month=${month}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Token ${token}`,
  //         },
  //       }
  //     );

  //     console.log("API Response Status:", response.status);

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data: ApiResponse = await response.json();
  //     console.log("API Response Data:", data);

  //     setCalendarData(data.daily_productivity_data || []);
  //     setStaffData(data.staff);
  //     setMonthlySalary(parseFloat(data.monthly_salary) || 0);
  //     setTotalSalary(data.total_salary || 0);
  //     setMonthsList(data.months_list || []);

  //     toast({
  //       title: "Success",
  //       description: "Calendar data loaded successfully",
  //       className: "bg-green-500 text-white",
  //     });

  //   } catch (err: any) {
  //     console.error("=== API ERROR ===");
  //     console.error("Error:", err);
  //     setError(err.message);
  //     toast({
  //       title: "Error",
  //       description: err.message || "Failed to fetch calendar data",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   fetchCalendar();
  // }, [staffId, year, month]);

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchCalendar();
  }

  function getCellBgColor(leads?: number) {
    if (leads === undefined || leads === 0) return "bg-red-500 text-white"; // Red for 0 leads
    return "bg-green-500 text-white"; // Green for 1+ leads
  }

  const DayCell = ({ dayData }: { dayData: DayData }) => {
    const bgColor = getCellBgColor(dayData.leads);

    return (
      <div className={cn("p-2 h-20 md:h-24 flex flex-col justify-between rounded-lg transition-all hover:scale-105", bgColor)}>
        <div className="font-semibold text-base text-right">{dayData.day}</div>
        <div className="text-xs">
          <div className="font-medium">Leads: {dayData.leads}</div>
          <div className="font-medium">Earn: ₹{dayData.salary}</div>
        </div>
        {dayData.leads > 0 && (
          <div className="text-xs opacity-75">
            {dayData.leads >= 15 ? "🔥" : dayData.leads >= 10 ? "✨" : dayData.leads >= 5 ? "👍" : "📈"}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Productivity Calendar</h1>
      


      <Card>
        <CardHeader>
          <form onSubmit={handleFilterSubmit} className="flex flex-col gap-4 items-center sm:flex-row">
            <div className="w-full sm:w-auto"> {/* Month Select */}
              <Select value={String(month)} onValueChange={(value) => setMonth(Number(value))}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {monthsList.map(([monthNum, monthName]) => (
                    <SelectItem key={monthNum} value={String(monthNum)}>{monthName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-4 w-full sm:w-auto"> {/* Year Select and Filter Button */}
              <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                   {yearsList.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Filter
              </Button>
            </div>
          </form>
        </CardHeader>
        <CardContent>
            {loading ? (
                 <div className="flex justify-center items-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            ) : error ? (
                <div className="text-center text-red-500 py-10">
                  <p>{error}</p>
                  <Button onClick={fetchCalendar} className="mt-4">
                    Try Again
                  </Button>
                </div>
            ) : (
             <>
                {/* Color Legend */}
                <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-sm font-semibold mb-3">Performance Legend:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                      <span>0 Leads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-tr from-primary/40 to-secondary/40 rounded"></div>
                      <span>1-4 Leads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-tr from-primary/60 to-secondary/60 rounded"></div>
                      <span>5-9 Leads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-tr from-primary/80 to-secondary/80 rounded"></div>
                      <span>10-14 Leads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-tr from-primary to-secondary rounded"></div>
                      <span>15+ Leads</span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-semibold text-muted-foreground pb-2">{day}</div>
                    ))}
                </div>
                <div className="hidden md:grid grid-cols-7 gap-2">
                    {calendarData.map((dayData, index) => (
                      <DayCell key={index} dayData={dayData} />
                    ))}
                </div>
                <div className="md:hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Week</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Earn</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calendarData.map((dayData, index) => (
                        <TableRow key={index}>
                          <TableCell>{dayData.day}</TableCell>
                          <TableCell>{dayData.day_name}</TableCell>
                          <TableCell>Leads</TableCell>
                          <TableCell>₹{dayData.salary}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">Monthly Salary: <span className="text-primary">₹{monthlySalary.toLocaleString()}</span></div>
                    <div className="text-lg font-semibold">Total Earned: <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">₹{totalSalary.toLocaleString()}</span></div>
                </div>
             </>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
