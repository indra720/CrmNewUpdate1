'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Plus, Minus, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';


const ProductivityTeamLeaderPage = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const [teamLeaderData, setTeamLeaderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/team-leader-report/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const uniqueAdminsMap = new Map();
      data.team_leaders_list?.forEach((item: any) => {
        if (item.admin && item.admin.id) {
          uniqueAdminsMap.set(item.admin.id, item.admin);
        }
      });
      const uniqueAdmins = Array.from(uniqueAdminsMap.values());
      setAdmins(uniqueAdmins);
    } catch (error: any) {
      console.error('Error fetching admins:', error.message);
      // Do not set main error state for admin fetching failure
    }
  };

  const fetchTeamLeaderData = async (
    adminId?: string,
    start?: Date | undefined, // Changed to Date | undefined
    end?: Date | undefined // Changed to Date | undefined
  ) => {
    const formattedStartDate = start ? format(start, 'yyyy-MM-dd') : undefined;
    const formattedEndDate = end ? format(end, 'yyyy-MM-dd') : undefined;

    console.log('Fetching data with params:', { adminId, start: formattedStartDate, end: formattedEndDate }); // Log parameters
    const token = localStorage.getItem('authToken');
    setLoading(true);
    setError(null);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/productivity/team-leader-report/`;
      const params = new URLSearchParams();
      if (adminId && adminId !== 'all-admins') {
        params.append('admin', adminId);
      }
      if (formattedStartDate) params.append('start_date', formattedStartDate);
      if (formattedEndDate) params.append('end_date', formattedEndDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      console.log('Fetching URL:', url); // Log final URL
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeamLeaderData(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchTeamLeaderData(selectedAdmin, startDate, endDate);
  }, [selectedAdmin, startDate, endDate]); // Added startDate, endDate to dependencies

  const handleAdminChange = (value: string) => {
    setSelectedAdmin(value);
  };
  
  const handleApplyFilter = () => {
      console.log('Apply Filter button clicked'); // Log button click
      fetchTeamLeaderData(selectedAdmin, startDate, endDate);
  };

  const handleClearFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    fetchTeamLeaderData(selectedAdmin);
  };

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  if (loading && !teamLeaderData) { // Show initial loading screen
    return (
      <div className="text-center py-8 text-lg">
        Loading team leader productivity data...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-8 text-lg text-red-500">
        Error: {error}
      </div>
    );
  }
  if (!teamLeaderData) {
    return (
      <div className="text-center py-8 text-lg">
        No team leader productivity data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Productivity Index</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="admin-select">TeamLeader</Label>
              <Select value={selectedAdmin} onValueChange={handleAdminChange}>
                <SelectTrigger id="admin-select">
                  <SelectValue placeholder="Select Admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-admins">All TeamLeader</SelectItem>
                  {admins.map((admin) => (
                    <SelectItem key={admin.id} value={admin.id.toString()}>
                      {admin.name || admin.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>

            <div className="flex gap-2">
              <Button
                className="w-full flex items-center gap-2"
                onClick={handleApplyFilter}
              >
                <Filter className="h-4 w-4" />
                Apply Filter
              </Button>
               <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleClearFilter}
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>