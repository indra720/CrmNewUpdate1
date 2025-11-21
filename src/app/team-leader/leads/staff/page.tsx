'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Phone, MessageSquare, Calendar, FileDown, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';


const mockLeads = [
    { id: 1, name: 'Mahesh Sharma', staff: 'chanchal-staff', status: 'Leads', call: '9876543210', updated_date: 'Nov. 19, 2025, 9:12 a.m.'},
    { id: 2, name: 'Qutubuddin', staff: 'chanchal-staff', status: 'Leads', call: '9876543211', updated_date: 'Nov. 19, 2025, 9:12 a.m.' },
    { id: 3, name: 'Ashok Agarwal', staff: 'chanchal-staff', status: 'Leads', call: '9876543212', updated_date: 'Nov. 19, 2025, 9:12 a.m.' },
    { id: 4, name: 'Giriraj Maheshwari', staff: 'chanchal-staff', status: 'Leads', call: '9876543213', updated_date: 'Nov. 19, 2025, 9:12 a.m.' },
    { id: 5, name: 'Laxmi Narayan', staff: 'chanchal-staff', status: 'Leads', call: '9876543214', updated_date: 'Nov. 19, 2025, 9:12 a.m.' },
    { id: 6, name: 'Mahesh Agarwal', staff: 'chanchal-staff', status: 'Leads', call: '9876543215', updated_date: 'Nov. 19, 2025, 9:12 a.m.' },
];

export default function StaffLeadsPage() {
    const router = useRouter();
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

    const toggleRow = (rowId: number) => {
        setExpandedRowId(expandedRowId === rowId ? null : rowId);
    };

    const handleTypeNavChange = (value: string) => {
        if (!value) return;
        router.push(value);
    }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Staff Leads</h1>

       <Card className="shadow-lg  rounded-2xl">
        <CardContent className="p-6">
             <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="start_date" name="start_date" type="date" placeholder="mm/dd/yyyy" className="pl-10" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="end_date" name="end_date" type="date" placeholder="mm/dd/yyyy" className="pl-10" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status" className="sr-only">Status</Label>
                    <Select name="status">
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Open this select menu" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Leads">Leads</SelectItem>
                            <SelectItem value="Intrested">Intrested</SelectItem>
                            <SelectItem value="Not Interested">Not Interested</SelectItem>
                            <SelectItem value="Other Location">Other Location</SelectItem>
                            <SelectItem value="Not Picked">Not Picked</SelectItem>
                            <SelectItem value="Lost">Lost</SelectItem>
                            <SelectItem value="Visit">Visit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit" className="w-full md:w-auto self-end">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </form>
        </CardContent>
      </Card>


      <Card className="shadow-lg rounded-2xl">
         <CardHeader>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Search leads..."
                    className="pl-10"
                    />
                </div>
                 <div className="w-full sm:w-auto">
                     <Select onValueChange={handleTypeNavChange}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="/team-leader/reports/interested">Interested</SelectItem>
                            <SelectItem value="/team-leader/reports/not-interested">Not Interested</SelectItem>
                            <SelectItem value="/team-leader/reports/other-location">Other Location</SelectItem>
                            <SelectItem value="/team-leader/reports/total-leads">Lost</SelectItem>
                            <SelectItem value="/team-leader/reports/visit">Visit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="overflow-x-auto border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">S.N.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Staff</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-center">Call</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Whatsapp</TableHead>
                  <TableHead className="hidden lg:table-cell">Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeads.map((lead, index) => (
                  <React.Fragment key={lead.id}>
                    <TableRow
                      data-state={
                        expandedRowId === lead.id ? "selected" : undefined
                      }
                    >
                      <TableCell className="w-12">
                        <div className="hidden lg:flex justify-center">
                          <span>{index + 1}.</span>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => toggleRow(lead.id)}
                          className="lg:hidden"
                        >
                          {expandedRowId === lead.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{lead.staff}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={lead.status === 'Interested' ? 'default' : 'secondary'}>{lead.status}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                         <Button variant="ghost" size="icon" asChild>
                           <a href={`tel:${lead.call}`}><Phone className="h-4 w-4 text-blue-500" /></a>
                         </Button>
                      </TableCell>
                      <TableCell className="text-center hidden lg:table-cell">
                          <Button variant="ghost" size="icon" asChild>
                              <a href={`https://wa.me/91${lead.call}?text=Hello%20${lead.name}`} target="_blank" rel="noopener noreferrer">
                                  <MessageSquare className="h-5 w-5 text-green-500" />
                              </a>
                          </Button>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{lead.updated_date}</TableCell>
                    </TableRow>
                    {expandedRowId === lead.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="p-0">
                          <div className="p-4">
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                <div className="flex items-center gap-4">
                                  <div className="text-lg font-bold">{lead.name}</div>
                                  <div className="text-sm text-gray-500">
                                    <Badge variant={lead.status === 'Interested' ? 'default' : 'secondary'}>{lead.status}</Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Staff:</span>
                                    <span className="text-sm">{lead.staff || 'N/A'}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <span className="text-sm">
                                      <Badge variant={lead.status === 'Interested' ? 'default' : 'secondary'}>{lead.status || 'N/A'}</Badge>
                                    </span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Call:</span>
                                    <span className="text-sm">
                                      <Button variant="ghost" size="icon" asChild>
                                        <a href={`tel:${lead.call}`}><Phone className="h-4 w-4 text-blue-500" /></a>
                                      </Button>
                                    </span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Whatsapp:</span>
                                    <span className="text-sm">
                                      <Button variant="ghost" size="icon" asChild>
                                          <a href={`https://wa.me/91${lead.call}?text=Hello%20${lead.name}`} target="_blank" rel="noopener noreferrer">
                                              <MessageSquare className="h-5 w-5 text-green-500" />
                                          </a>
                                      </Button>
                                    </span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Updated Date:</span>
                                    <span className="text-sm">{lead.updated_date || 'N/A'}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">S.N.:</span>
                                    <span className="text-sm">{index + 1}</span>
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
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Pagination>
        <PaginationContent>
            <PaginationItem>
            <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
            <PaginationNext href="#" />
            </PaginationItem>
        </PaginationContent>
        </Pagination>
    </div>
  );
}









// class TeamLeaderStaffLeadsListAPIView(APIView):
//     """
//     API endpoint for 'teamleader_perticular_leads'.
//     GET: Fetches list of leads for a specific staff, filtered by status (tag).
//     ONLY TEAM LEADER can access this.
//     """
//     permission_classes = [IsAuthenticated, IsCustomTeamLeaderUser]
//     pagination_class = StandardResultsSetPagination

//     def get(self, request, staff_id, tag, format=None):
//         # 1. Verify Team Leader & Staff Relationship
//         try:
//             tl_instance = Team_Leader.objects.get(user=request.user)
//             staff = Staff.objects.get(id=staff_id)
//             if staff.team_leader != tl_instance:
//                  return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
//         except (Team_Leader.DoesNotExist, Staff.DoesNotExist):
//             return Response({"error": "Invalid Team Leader or Staff."}, status=status.HTTP_404_NOT_FOUND)

//         # 2. Filter Leads based on Tag
//         base_qs = LeadUser.objects.filter(assigned_to=staff)
        
//         if tag == "Intrested":
//             leads = base_qs.filter(status='Intrested')
//         elif tag == "Not Interested":
//             leads = base_qs.filter(status='Not Interested')
//         elif tag == "Other Location":
//             leads = base_qs.filter(status='Other Location')
//         elif tag == "Lost":
//             leads = base_qs.filter(status='Lost')
//         elif tag == "Visit":
//             leads = base_qs.filter(status='Visit')
//         else:
//             leads = base_qs # All leads if tag doesn't match

//         leads = leads.order_by('-updated_date')

//         # 3. Paginate & Serialize
//         paginator = self.pagination_class()
//         page = paginator.paginate_queryset(leads, request, view=self)
//         if page is not None:
//             serializer = ApiLeadUserSerializer(page, many=True)
//             return paginator.get_paginated_response(serializer.data)

//         serializer = ApiLeadUserSerializer(leads, many=True)
//         return Response(serializer.data)