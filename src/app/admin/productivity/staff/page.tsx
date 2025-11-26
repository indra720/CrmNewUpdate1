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
import { Calendar, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchAdminTeamLeaders } from '../../../../lib/api';

const ProductivityStaffPage = () => {
  const [teamLeaders, setTeamLeaders] = useState<any[]>([]);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const [teamLeaderData, setTeamLeaderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamLeadersList = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminTeamLeaders();
      setTeamLeaders(data.team_leaders_list || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamLeaderData = async (filterTeamLeader?: string, filterStartDate?: string, filterEndDate?: string) => {
    const token = localStorage.getItem('authToken');
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      // Use filter values if provided, otherwise use state values
      const currentSelectedTeamLeader = filterTeamLeader !== undefined ? filterTeamLeader : selectedTeamLeader;
      const currentStartDate = filterStartDate !== undefined ? filterStartDate : startDate;
      const currentEndDate = filterEndDate !== undefined ? filterEndDate : endDate;

      if (currentSelectedTeamLeader && currentSelectedTeamLeader !== 'all-team-leaders') {
        params.append('team_leader_id', currentSelectedTeamLeader);
      }
      if (currentStartDate) {
        params.append('start_date', currentStartDate);
      }
      if (currentEndDate) {
        params.append('end_date', currentEndDate);
      }
      const queryString = params.toString();
      const url = queryString
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/productivity-report/?${queryString}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/admin/productivity-report/`;

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

      const transformedStaffData = (data.staff_list || []).map((staff: any) => ({
        id: staff.id,
        name: staff.name,
        total_calls: staff.total_leads || 0,
        interested: staff.interested || 0,
        visit: staff.visit || 0,
        not_interested: staff.not_interested || 0,
        other_location: staff.other_location || 0,
        lost: staff.lost || 0,
        interested_percentage: staff.total_leads > 0 ? Math.round((staff.interested / staff.total_leads) * 100) : 0,
        visit_percentage: staff.total_leads > 0 ? Math.round((staff.visit / staff.total_leads) * 100) : 0,
      }));

      const transformedData = {
        ...data,
        staff_data: transformedStaffData,
        total_all_calls: data.counts?.total_leads || 0,
        total_all_interested: data.counts?.interested || 0,
        total_all_visit: data.counts?.total_visit || 0,
        total_all_not_interested: data.counts?.not_interested || 0,
        total_all_other_location: data.counts?.other_location || 0,
        total_all_lost: data.counts?.lost_leads || 0,
      };

      setTeamLeaderData(transformedData);
      console.log('Data fetched successfully', transformedData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch on component mount
    fetchTeamLeaderData();
    fetchTeamLeadersList();
  }, []); // Empty dependency array means this runs once on mount

  const handleFilter = () => {
    fetchTeamLeaderData(selectedTeamLeader, startDate, endDate);
  };

  const handleTeamLeaderChange = (value: string) => {
    setSelectedTeamLeader(value);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="team-leader-select">Team Leader</Label>
              <Select value={selectedTeamLeader} onValueChange={handleTeamLeaderChange}>
                <SelectTrigger id="team-leader-select">
                  <SelectValue placeholder="Select Team Leader" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-team-leaders">All Team Leaders</SelectItem>
                  {teamLeaders.map((teamLeader) => (
                    <SelectItem key={teamLeader.id} value={teamLeader.id}>
                      {teamLeader.user.name || teamLeader.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
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
            <Button onClick={handleFilter} className="mt-8 w-full sm:w-auto">Filter</Button>
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
                  <TableHead className="hidden md:table-cell">Visit</TableHead>
                  <TableHead className="hidden lg:table-cell">Not Interested</TableHead>
                  <TableHead className="hidden lg:table-cell">Other Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Lost</TableHead>
                  <TableHead className="hidden lg:table-cell">Interested %</TableHead>
                  <TableHead className="text-right">Visit %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamLeaderData.staff_data && teamLeaderData.staff_data.map((row: any, i: number) => (
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
                      <TableCell className="hidden md:table-cell">{row.visit}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.not_interested}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.other_location}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.lost}</TableCell>
                      <TableCell className="hidden lg:table-cell">{row.interested_percentage}%</TableCell>
                      <TableCell className="text-right">{row.visit_percentage}%</TableCell>
                    </TableRow>
                    {expandedRowId === row.id && (
                      <TableRow className="lg:hidden">
                        <TableCell colSpan={10} className="p-0">
                          <div className="p-4">
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                <div className="text-lg font-bold">{row.name}</div>
                              </div>
                              <div className="overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Total Calls:</span>
                                    <span className="text-sm capitalize ml-auto">{row.total_calls}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Interested:</span>
                                    <span className="text-sm ml-auto">{row.interested}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Not Interested:</span>
                                    <span className="text-sm ml-auto">{row.not_interested}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Other Location:</span>
                                    <span className="text-sm ml-auto">{row.other_location}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Lost:</span>
                                    <span className="text-sm ml-auto">{row.lost}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Visit:</span>
                                    <span className="text-sm ml-auto">{row.visit}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Interested %:</span>
                                    <span className="text-sm ml-auto">{row.interested_percentage}%</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Visit %:</span>
                                    <span className="text-sm ml-auto">{row.visit_percentage}%</span>
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
                {(!teamLeaderData.staff_data || teamLeaderData.staff_data.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No matching records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="hidden md:table-cell">{teamLeaderData.total_all_calls}</TableCell>
                  <TableCell className="hidden md:table-cell">{teamLeaderData.total_all_interested}</TableCell>
                  <TableCell className="hidden md:table-cell">{teamLeaderData.total_all_visit}</TableCell>
                  <TableCell className="hidden lg:table-cell">{teamLeaderData.total_all_not_interested}</TableCell>
                  <TableCell className="hidden lg:table-cell">{teamLeaderData.total_all_other_location}</TableCell>
                  <TableCell className="hidden lg:table-cell">{teamLeaderData.total_all_lost}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {teamLeaderData.total_all_calls > 0 ? Math.round((teamLeaderData.total_all_interested / teamLeaderData.total_all_calls) * 100) : 0}%
                  </TableCell>
                  <TableCell className="text-right">
                    {teamLeaderData.total_all_calls > 0 ? Math.round((teamLeaderData.total_all_visit / teamLeaderData.total_all_calls) * 100) : 0}%
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

export default ProductivityStaffPage;




// {
//     "counts": {
//         "total_leads": 0,
//         "total_interested_leads": 0,
//         "total_not_interested_leads": 0,
//         "total_other_location_leads": 0,
//         "total_not_picked_leads": 0,
//         "total_lost_leads": 0,
//         "total_visits_leads": 0
//     },
//     "team_leaders_list": [
//         {
//             "id": 2,
//             "user": {
//                 "id": 5,
//                 "email": "indra720@gmail.com",
//                 "name": "Indrajeet",
//                 "mobile": "6789567899",
//                 "profile_image": null,
//                 "is_admin": false,
//                 "is_team_leader": true,
//                 "is_staff_new": false,
//                 "created_date": "2025-11-18T13:00:05.394903Z",
//                 "user_active": true
//             },
//             "admin": {
//                 "id": 1,
//                 "user": {
//                     "id": 2,
//                     "email": "badal720@gmail.com",
//                     "name": "Badal Kumawat",
//                     "mobile": "7878908765",
//                     "profile_image": null,
//                     "is_admin": true,
//                     "is_team_leader": false,
//                     "is_staff_new": false,
//                     "created_date": "2025-11-18T10:47:09.811328Z",
//                     "user_active": true
//                 },
//                 "admin_id": "09b3bd65-5003-4c6c-9e7b-91ce942573da",
//                 "name": "Badal Kumawat",
//                 "email": "badal720@gmail.com",
//                 "mobile": "7878908765",
//                 "address": "JAIUR",
//                 "city": "jaipur",
//                 "pincode": "678940",
//                 "state": "Rajasthan",
//                 "dob": "2004-07-18",
//                 "pancard": "ABCDE1234F",
//                 "aadharCard": "678956784567",
//                 "account_number": "123345432167",
//                 "upi_id": "badal@123",
//                 "bank_name": "sbi",
//                 "ifsc_code": "SBIN0035",
//                 "salary": "45000",
//                 "achived_slab": "1500",
//                 "created_date": "2025-11-18T10:47:10.591722Z"
//             },
//             "team_leader_id": "0c03d164-9ca3-44ba-a3c7-d1cb550d85a1",
//             "name": "Indrajeet",
//             "email": "indra720@gmail.com",
//             "mobile": "6789567899",
//             "address": "JAIPUR",
//             "city": "jaipur",
//             "pincode": "302019",
//             "state": "Rajasthan",
//             "dob": null,
//             "pancard": "ABCED7890F",
//             "aadharCard": "456378308976",
//             "account_number": "789067890",
//             "upi_id": "indra@123",
//             "bank_name": "SBI",
//             "ifsc_code": "SBIN034560",
//             "salary": "50000",
//             "achived_slab": "1500"
//         },
//         {
//             "id": 3,
//             "user": {
//                 "id": 8,
//                 "email": "rohit720@gmail.com",
//                 "name": "Rohit Mehra",
//                 "mobile": "8907655432",
//                 "profile_image": null,
//                 "is_admin": false,
//                 "is_team_leader": true,
//                 "is_staff_new": false,
//                 "created_date": "2025-11-23T09:09:48.977922Z",
//                 "user_active": false
//             },
//             "admin": {
//                 "id": 1,
//                 "user": {
//                     "id": 2,
//                     "email": "badal720@gmail.com",
//                     "name": "Badal Kumawat",
//                     "mobile": "7878908765",
//                     "profile_image": null,
//                     "is_admin": true,
//                     "is_team_leader": false,
//                     "is_staff_new": false,
//                     "created_date": "2025-11-18T10:47:09.811328Z",
//                     "user_active": true
//                 },
//                 "admin_id": "09b3bd65-5003-4c6c-9e7b-91ce942573da",
//                 "name": "Badal Kumawat",
//                 "email": "badal720@gmail.com",
//                 "mobile": "7878908765",
//                 "address": "JAIUR",
//                 "city": "jaipur",
//                 "pincode": "678940",
//                 "state": "Rajasthan",
//                 "dob": "2004-07-18",
//                 "pancard": "ABCDE1234F",
//                 "aadharCard": "678956784567",
//                 "account_number": "123345432167",
//                 "upi_id": "badal@123",
//                 "bank_name": "sbi",
//                 "ifsc_code": "SBIN0035",
//                 "salary": "45000",
//                 "achived_slab": "1500",
//                 "created_date": "2025-11-18T10:47:10.591722Z"
//             },
//             "team_leader_id": "f1084ca3-2023-4cd9-a075-d251477e9646",
//             "name": "Rohit Mehra",
//             "email": "rohit720@gmail.com",
//             "mobile": "8907655432",
//             "address": "ghgfhfdhg",
//             "city": "Jaipur",
//             "pincode": "456789",
//             "state": "Rajasthan",
//             "dob": "2000-10-23",
//             "pancard": "ADBCE786F",
//             "aadharCard": "234509874536",
//             "account_number": "7896795644",
//             "upi_id": "rohit@123",
//             "bank_name": "sbi",
//             "ifsc_code": "sbin0004rt45",
//             "salary": "89907",
//             "achived_slab": "0"
//         }
//     ],
//     "setting": null
// }