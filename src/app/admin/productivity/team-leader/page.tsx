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
import { Calendar, Plus, Minus, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductivityTeamLeaderPage = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
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
      // Extract unique admins from team_leaders_list
      const uniqueAdminsMap = new Map();
      data.team_leaders_list?.forEach((item: any) => {
        if (item.admin && item.admin.id) {
          uniqueAdminsMap.set(item.admin.id, item.admin);
        }
      });
      const uniqueAdmins = Array.from(uniqueAdminsMap.values());
      setAdmins(uniqueAdmins);
      console.log('Admins fetched successfully', uniqueAdmins);
    } catch (error: any) {
      console.error('Error fetching admins:', error.message);
      setError(error.message);
    }
  };

  const fetchTeamLeaderData = async () => {
    const token = localStorage.getItem('authToken');
    setLoading(true);
    setError(null);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/productivity/team-leader-report/`;
      const params = new URLSearchParams();
      if (selectedAdmin && selectedAdmin !== 'all-admins') {
        params.append('admin', selectedAdmin);
      }
      if (isFiltered) {
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
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
      console.log('Data fetched successfully', data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchTeamLeaderData();
  }, []);

  useEffect(() => {
    fetchTeamLeaderData();
  }, [selectedAdmin, isFiltered]);

  useEffect(() => {
    if (isFiltered) {
      fetchTeamLeaderData();
    }
  }, [startDate, endDate]);

  const handleAdminChange = (value: string) => {
    setSelectedAdmin(value);
  };

  const handleFilterToggle = () => {
    if (isFiltered) {
      setStartDate('');
      setEndDate('');
    }
    setIsFiltered(!isFiltered);
  };

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  if (loading) {
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
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="space-y-2 lg:w-48">
              <Label htmlFor="admin-select">Admin</Label>
              <Select value={selectedAdmin} onValueChange={handleAdminChange}>
                <SelectTrigger id="admin-select">
                  <SelectValue placeholder="Select Admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-admins">All Admins</SelectItem>
                  {admins.map((admin) => (
                    <SelectItem key={admin.id} value={admin.id}>
                      {admin.user.name || admin.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 lg:w-48">
              <Label htmlFor="start-date">Start Date</Label>
              <div className="relative">
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2 lg:w-48">
              <Label htmlFor="end-date">End Date</Label>
              <div className="relative">
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Filter</Label>
              <Button
                className="w-full bg-orange-500 text-black flex items-center gap-2"
                onClick={handleFilterToggle}
              >
                {isFiltered ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                {isFiltered ? 'Clear Filter' : 'Apply Filter'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.N.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Total Calls</TableHead>
                  <TableHead className="hidden md:table-cell">Interested</TableHead>
                  <TableHead className="hidden lg:table-cell">Not Interested</TableHead>
                  <TableHead className="hidden lg:table-cell">Lost</TableHead>
                  <TableHead className="hidden lg:table-cell">Visit</TableHead>
                  <TableHead className="hidden lg:table-cell">Interested %</TableHead>
                  <TableHead className="text-right">Visit %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamLeaderData.team_leader_data && teamLeaderData.team_leader_data.map((row: any, i: number) => (
                  <React.Fragment key={row.id}>
                    <TableRow data-state={expandedRowId === row.id && 'selected'}>
                      <TableCell>
                        
                          <div className="lg:hidden">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-green-600"
                              onClick={() => toggleRow(row.id)}
                            >
                              {expandedRowId === row.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </Button>
                          </div>
                          
                          <div className="hidden lg:block">
                            {i + 1}.
                          </div>
                        
                      </TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.total_calls}</TableCell>
                      <TableCell className="hidden md:table-cell">{row.interested}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.not_interested}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.lost}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.visit}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.interested_percentage}%</TableCell>
                      <TableCell className="text-right">{row.visit_percentage}%</TableCell>
                    </TableRow>
                    {expandedRowId === row.id && (
                      <TableRow className="lg:hidden">
                        <TableCell colSpan={9} className="p-0">
                          <div className="p-4">
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                <div className="flex items-center gap-4">
                                  <div className="text-lg font-bold">{row.name}</div>
                                </div>
                              </div>
                              <div className="overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium">Total Calls:</span>
                                    </div>
                                    <span className="text-sm capitalize ml-auto md:ml-0">{row.total_calls}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium">Interested:</span>
                                    </div>
                                    <span className="text-sm ml-auto md:ml-0">{row.interested}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium">Not Interested:</span>
                                    </div>
                                    <span className="text-sm ml-auto md:ml-0">{row.not_interested}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium">Other Location:</span>
                                    </div>
                                    <span className="text-sm ml-auto md:ml-0">{row.other_location}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium">Lost:</span>
                                    </div>
                                    <span className="text-sm ml-auto md:ml-0">{row.lost}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium">Visit:</span>
                                    </div>
                                    <span className="text-sm ml-auto md:ml-0">{row.visit}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium">Interested %:</span>
                                    </div>
                                    <span className="text-sm ml-auto md:ml-0">{row.interested_percentage}%</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium">Visit %:</span>
                                    </div>
                                    <span className="text-sm ml-auto md:ml-0">{row.visit_percentage}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
                 {(!teamLeaderData.team_leader_data || teamLeaderData.team_leader_data.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Data is not found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="hidden md:table-cell">{teamLeaderData.counts?.total_all_calls || 0}</TableCell>
                  <TableCell className="hidden md:table-cell">{teamLeaderData.counts?.total_all_interested || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">{teamLeaderData.counts?.total_all_not_interested || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">{teamLeaderData.counts?.total_all_lost || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">{teamLeaderData.counts?.total_all_visit || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {teamLeaderData.counts?.total_all_calls > 0
                      ? Math.round((teamLeaderData.counts.total_all_interested / teamLeaderData.counts.total_all_calls) * 100)
                      : 0}
                    %
                  </TableCell>
                  <TableCell className="text-right">
                    {teamLeaderData.counts?.total_all_calls > 0
                      ? Math.round((teamLeaderData.counts.total_all_visit / teamLeaderData.counts.total_all_calls) * 100)
                      : 0}
                    %
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductivityTeamLeaderPage;