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
    start?: string,
    end?: string
  ) => {
    console.log('Fetching data with params:', { adminId, start, end }); // Log parameters
    const token = localStorage.getItem('authToken');
    setLoading(true);
    setError(null);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/productivity/team-leader-report/`;
      const params = new URLSearchParams();
      if (adminId && adminId !== 'all-admins') {
        params.append('admin', adminId);
      }
      if (start) params.append('start_date', start);
      if (end) params.append('end_date', end);
      
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
  }, [selectedAdmin]);

  const handleAdminChange = (value: string) => {
    setSelectedAdmin(value);
  };
  
  const handleApplyFilter = () => {
      console.log('Apply Filter button clicked'); // Log button click
      fetchTeamLeaderData(selectedAdmin, startDate, endDate);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
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
                      <TableCell className="text-[13px] font-semibold md:font-medium">{row.name}</TableCell>
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







// class TeamLeaderProductivityViewAPIView(APIView):
//     """
//     API endpoint for 'teamleader_productivity_view'.
//     GET: Fetches productivity stats for Team Leaders (Aggregated from their Staff).
//     Accessible by: Superuser, Admin.
//     """
//     permission_classes = [IsAuthenticated]

//     def get(self, request, format=None):
//         # 1. Get Query Params
//         date_filter = request.query_params.get('date')
//         end_date_str = request.query_params.get('endDate')
//         admin_id = request.query_params.get('admin_id')
        
//         # 2. Determine Team Leaders based on User Role
//         team_leaders = Team_Leader.objects.none()
        
//         if request.user.is_superuser:
//             team_leaders = Team_Leader.objects.filter(user__user_active=True)
//             if admin_id:
//                 team_leaders = team_leaders.filter(admin=admin_id)
        
//         elif request.user.is_admin:
//             try:
//                 # Get logged-in Admin
//                 # Assuming 'self_user' link or direct email match
//                 # View logic: Team_Leader.objects.filter(admin__self_user=request.user ...)
//                 team_leaders = Team_Leader.objects.filter(
//                     admin__self_user=request.user, 
//                     user__user_active=True
//                 )
//                 if admin_id:
//                      # If admin tries to filter by another admin ID (should not happen for regular admin, but logic is there)
//                      team_leaders = team_leaders.filter(admin=admin_id)
//             except Exception:
//                 pass
        
//         # If user is neither superuser nor admin, return empty or error
//         elif not (request.user.is_superuser or request.user.is_admin):
//              return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

//         # 3. Date Filter Logic
//         today = timezone.now().date()
//         start_date = timezone.make_aware(datetime.combine(today, datetime.min.time()))
//         end_date = timezone.make_aware(datetime.combine(today, datetime.max.time()))
        
//         if date_filter:
//             try:
//                 s_date = datetime.strptime(date_filter, '%Y-%m-%d')
//                 start_date = timezone.make_aware(datetime.combine(s_date, datetime.min.time()))
                
//                 if end_date_str:
//                     e_date = datetime.strptime(end_date_str, '%Y-%m-%d')
//                     end_date = timezone.make_aware(datetime.combine(e_date, datetime.max.time()))
//                 else:
//                     end_date = timezone.make_aware(datetime.combine(s_date, datetime.max.time()))
//             except ValueError:
//                 pass

//         # Filters
//         activity_filter = {'updated_date__range': [start_date, end_date]}
//         creation_filter = {'created_date__range': [start_date, end_date]}

//         # 4. Aggregation Variables
//         staff_data = [] # Actually team leader data list
//         total_all_leads = 0
//         total_all_interested = 0
//         total_all_not_interested = 0
//         total_all_other_location = 0
//         total_all_not_picked = 0
//         total_all_lost = 0
//         total_all_visit = 0
//         total_all_calls = 0

//         # 5. Loop Team Leaders
//         for tl in team_leaders:
//             # Initialize counters for this Team Leader
//             tl_leads = 0
//             tl_interested = 0
//             tl_not_interested = 0
//             tl_other_location = 0
//             tl_not_picked = 0
//             tl_lost = 0
//             tl_visit = 0
            
//             # Get Staff associated with this Team Leader
//             staff_members = Staff.objects.filter(team_leader=tl)

//             # Aggregate data from all staff under this TL
//             for staff in staff_members:
//                 staff_leads = LeadUser.objects.filter(assigned_to=staff)
                
//                 tl_leads += staff_leads.filter(**creation_filter).count()
//                 tl_interested += staff_leads.filter(status="Intrested", **activity_filter).count()
//                 tl_not_interested += staff_leads.filter(status="Not Interested", **activity_filter).count()
//                 tl_other_location += staff_leads.filter(status="Other Location", **activity_filter).count()
//                 tl_not_picked += staff_leads.filter(status="Not Picked", **activity_filter).count()
//                 tl_lost += staff_leads.filter(status="Lost", **activity_filter).count()
//                 tl_visit += staff_leads.filter(status="Visit", **activity_filter).count()

//             # Also include TL's own direct leads if any (not in your view logic, but good to have?)
//             # Your view logic ONLY iterates staff_members, so we stick to that.
            
//             tl_total_calls = tl_interested + tl_not_interested + tl_other_location + tl_not_picked + tl_lost + tl_visit

//             # Percentages
//             visit_percentage = (tl_visit / tl_leads * 100) if tl_leads > 0 else 0
//             interested_percentage = (tl_interested / tl_leads * 100) if tl_leads > 0 else 0

//             staff_data.append({
//                 'id': tl.id,
//                 'name': tl.name,
//                 'total_leads': tl_leads,
//                 'interested': tl_interested,
//                 'not_interested': tl_not_interested,
//                 'other_location': tl_other_location,
//                 'not_picked': tl_not_picked,
//                 'lost': tl_lost,
//                 'visit': tl_visit,
//                 'visit_percentage': round(visit_percentage, 2),
//                 'interested_percentage': round(interested_percentage, 2),
//                 'total_calls': tl_total_calls,
//             })

//             # Accumulate Grand Totals
//             total_all_leads += tl_leads
//             total_all_interested += tl_interested
//             total_all_not_interested += tl_not_interested
//             total_all_other_location += tl_other_location
//             total_all_not_picked += tl_not_picked
//             total_all_lost += tl_lost
//             total_all_visit += tl_visit
//             total_all_calls += tl_total_calls

//         # 6. Grand Total Percentages
//         total_visit_percentage = (total_all_visit / total_all_leads * 100) if total_all_leads > 0 else 0
//         total_interested_percentage = (total_all_interested / total_all_leads * 100) if total_all_leads > 0 else 0

//         # 7. Final Response
//         response_data = {
//             "counts": {
//                 'total_all_leads': total_all_leads,
//                 'total_all_interested': total_all_interested,
//                 'total_all_not_interested': total_all_not_interested,
//                 'total_all_other_location': total_all_other_location,
//                 'total_all_not_picked': total_all_not_picked,
//                 'total_all_lost': total_all_lost,
//                 'total_all_visit': total_all_visit,
//                 'total_all_calls': total_all_calls,
//                 'total_visit_percentage': round(total_visit_percentage, 2),
//                 'total_interested_percentage': round(total_interested_percentage, 2),
//                 'total_team_leaders_count': team_leaders.count(),
//             },
//             "team_leader_data": staff_data, # Rename to clear confusion
//             "filter_dates": {
//                 "start": str(start_date.date()),
//                 "end": str(end_date.date())
//             }
//         }
        
//         return Response(response_data, status=status.HTTP_200_OK)




// {
//     "counts": {
//         "total_all_leads": 0,
//         "total_all_interested": 0,
//         "total_all_not_interested": 0,
//         "total_all_other_location": 0,
//         "total_all_not_picked": 0,
//         "total_all_lost": 0,
//         "total_all_visit": 0,
//         "total_all_calls": 0,
//         "total_visit_percentage": 0,
//         "total_interested_percentage": 0,
//         "total_team_leaders_count": 0
//     },
//     "team_leader_data": [],
//     "filter_dates": {
//         "start": "2025-11-27",
//         "end": "2025-11-27"
//     }
// }