'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Search, Phone, MessageSquare, Calendar, FileDown, Plus, Minus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { fetchAdminStaffLeadsByTag } from '@/lib/api';

export default function StaffLeadsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const staffId = searchParams.get('id');

    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const [selectedTag, setSelectedTag] = useState('Intrested');
    
    const tags = ['Intrested', 'Not Interested', 'Other Location', 'Lost', 'Visit'];

    useEffect(() => {
      async function fetchLeads() {
        if (!staffId) {
          setError("Staff ID is missing.");
          setLoading(false);
          return;
        }
  
        try {
          setLoading(true);
          setError(null);
          const data = await fetchAdminStaffLeadsByTag(Number(staffId), selectedTag);
          setLeads(data.results || data || []);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch leads.');
        } finally {
          setLoading(false);
        }
      }
      fetchLeads();
    }, [staffId, selectedTag]);

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
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" value={selectedTag} onValueChange={setSelectedTag}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Open this select menu" />
                        </SelectTrigger>
                        <SelectContent>
                            {tags.map(tag => (
                                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                            ))}
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
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                        </TableCell>
                    </TableRow>
                ) : error ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-red-500">
                            {error}
                        </TableCell>
                    </TableRow>
                ) : leads.length > 0 ? (
                    leads.map((lead, index) => (
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
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            No leads found.
                        </TableCell>
                    </TableRow>
                )}
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







// class AdminStaffParticularLeadsAPIView(APIView):
//     """
//     API endpoint: 'teamleader_perticular_leads' function ke liye (Admin Dashboard).
//     GET: Fetches all leads of a specific staff (id) filtered by status (tag).
//     Only Admins can access this.
//     """
    
//     permission_classes = [IsAuthenticated, IsCustomAdminUser]
//     pagination_class = StandardResultsSetPagination

//     def get(self, request, id, tag, format=None):
//         paginator = self.pagination_class()
//         admin_profile = None  # Prevent UnboundLocalError
//         staff_instance = None

//         # --- Step 1: Resolve Staff safely ---
//         try:
//             staff_instance = get_object_or_404(Staff, id=id)
//         except Exception:
//             return Response(
//                 {"error": f"Staff with ID {id} not found."},
//                 status=status.HTTP_404_NOT_FOUND,
//             )

//         # --- Step 2: Resolve Admin safely ---
//         try:
//             admin_profile = Admin.objects.get(self_user=request.user)
//         except Admin.DoesNotExist:
//             try:
//                 admin_profile = Admin.objects.get(email=request.user.username)
//             except Admin.DoesNotExist:
//                 return Response(
//                     {"error": "Admin profile not found."},
//                     status=status.HTTP_404_NOT_FOUND,
//                 )

//         if not admin_profile:
//             return Response(
//                 {"error": "Could not determine admin profile."},
//                 status=status.HTTP_400_BAD_REQUEST,
//             )

//         # --- Step 3: Security check ---
//         if not hasattr(staff_instance, "team_leader") or not staff_instance.team_leader:
//             return Response(
//                 {"error": "This staff member is not assigned to any Team Leader."},
//                 status=status.HTTP_400_BAD_REQUEST,
//             )

//         if staff_instance.team_leader.admin != admin_profile:
//             return Response(
//                 {"error": "You do not have permission to view this staff's leads."},
//                 status=status.HTTP_403_FORBIDDEN,
//             )

//         # --- Step 4: Filter leads by tag ---
//         valid_status = [
//             "Intrested",
//             "Not Interested",
//             "Other Location",
//             "Lost",
//             "Visit",
//         ]

//         if tag in valid_status:
//             staff_leads = LeadUser.objects.filter(
//                 assigned_to=staff_instance, status=tag
//             )
//         else:
//             staff_leads = LeadUser.objects.filter(assigned_to=staff_instance)

//         # --- Step 5: Order and paginate ---
//         staff_leads = staff_leads.order_by("-updated_date")
//         page = paginator.paginate_queryset(staff_leads, request, view=self)

//         serializer = ApiLeadUserSerializer(page, many=True)
//         response = paginator.get_paginated_response(serializer.data)
//         response.data["staff_id"] = id
//         response.data["tag"] = tag
//         response.data["count"] = staff_leads.count()

//         return response




