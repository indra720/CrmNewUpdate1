'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
import { fetchAdminStaffLeadsByTag, fetchAdminStaffReport } from '@/lib/api';

function StaffLeadsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const staffIdFromUrl = searchParams.get('id');
    console.log('Staff ID from URL:', staffIdFromUrl);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [leads, setLeads] = useState<any[]>([]);
    const [staffName, setStaffName] = useState('');
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const [selectedTag, setSelectedTag] = useState('Interested');

    const tags = ['Intrested', 'Not Interested', 'Other Location', 'Lost', 'Visit'];

    useEffect(() => {
        async function fetchStaffAndLeads() {
            try {
                setLoading(true);
                setError(null);

                let staffIdToUse = staffIdFromUrl;
                
                const staffReport = await fetchAdminStaffReport();
                if (!staffIdToUse) {
                    if (staffReport.staff_list && staffReport.staff_list.length > 0) {
                        const firstStaff = staffReport.staff_list[0];
                        staffIdToUse = firstStaff.id;
                        setStaffName(firstStaff.name);
                    }
                } else {
                    const currentStaff = staffReport.staff_list.find((staff: any) => staff.id === Number(staffIdToUse));
                    if(currentStaff) {
                        setStaffName(currentStaff.name);
                    }
                }

                if (!staffIdToUse) {
                    setError("Staff ID is missing." as any);
                    setLoading(false);
                    return;
                }

                const data = await fetchAdminStaffLeadsByTag(Number(staffIdToUse), selectedTag);
                setLeads(data.results || data || []);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch leads.');
            } finally {
                setLoading(false);
            }
        }
        fetchStaffAndLeads();
    }, [staffIdFromUrl, selectedTag]);


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
                            <Select name="status">
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
                            <Select value={selectedTag} onValueChange={setSelectedTag}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tags.map(tag => (
                                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                    ))}
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
                                    <TableHead className="w-12 p-4">S.N.</TableHead>
                                    <TableHead className="p-4">Name</TableHead>
                                    <TableHead className="hidden md:table-cell p-4">Staff</TableHead>
                                    <TableHead className="hidden md:table-cell p-4">Status</TableHead>
                                    <TableHead className="text-center p-4">Call</TableHead>
                                    <TableHead className="text-center hidden lg:table-cell p-4">Whatsapp</TableHead>
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
                                                <TableCell className="w-12 p-4">
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
                                                <TableCell className="font-medium p-4">{lead.name}</TableCell>
                                                <TableCell className="hidden md:table-cell p-4">{staffName}</TableCell>
                                                <TableCell className="hidden md:table-cell p-4">
                                                    <Badge variant={lead.status === 'Interested' ? 'default' : 'secondary'}>{lead.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-center p-4">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <a href={`tel:${lead.call}`}><Phone className="h-4 w-4 text-blue-500" /></a>
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="text-center hidden lg:table-cell p-4">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <a href={`https://wa.me/91${lead.call}?text=Hello%20${lead.name}`} target="_blank" rel="noopener noreferrer">
                                                            <MessageSquare className="h-5 w-5 text-green-500" />
                                                        </a>
                                                    </Button>
                                                </TableCell>
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
                                                                            <span className="text-sm">{staffName || 'N/A'}</span>
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
const StaffLeadsPageWrapper = () => (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <StaffLeadsPage />
    </Suspense>
);

export default StaffLeadsPageWrapper;








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








// {
//     "lead_counts": {
//         "total_leads": 0,
//         "total_interested_leads": 0,
//         "total_not_interested_leads": 1,
//         "total_other_location_leads": 0,
//         "total_not_picked_leads": 1,
//         "total_lost_leads": 1,
//         "total_visits_leads": 0
//     },
//     "staff_list": [
//         {
//             "id": 5,
//             "name": "Piyush Rathor",
//             "staff_id": "VRI318",
//             "email": "piyush720@gmail.com",
//             "mobile": "6789009878"
//         }
//     ],
//     "productivity_report": {
//         "total_salary_all_staff": 0,
//         "staff_productivity_details": {
//             "5": {
//                 "name": "Piyush Rathor",
//                 "productivity_data": {
//                     "1": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "2": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "3": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "4": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "5": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "6": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "7": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "8": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "9": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "10": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "11": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "12": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "13": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "14": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "15": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "16": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "17": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "18": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "19": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "20": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "21": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "22": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "23": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "24": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "25": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "26": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "27": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "28": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "29": {
//                         "leads": 0,
//                         "salary": 0
//                     },
//                     "30": {
//                         "leads": 0,
//                         "salary": 0
//                     }
//                 },
//                 "total_salary": 0
//             }
//         }
//     },
//     "calendar_structure": [
//         [
//             {
//                 "day": 0,
//                 "day_name": "Monday"
//             },
//             {
//                 "day": 0,
//                 "day_name": "Tuesday"
//             },
//             {
//                 "day": 0,
//                 "day_name": "Wednesday"
//             },
//             {
//                 "day": 0,
//                 "day_name": "Thursday"
//             },
//             {
//                 "day": 0,
//                 "day_name": "Friday"
//             },
//             {
//                 "day": 1,
//                 "day_name": "Saturday"
//             },
//             {
//                 "day": 2,
//                 "day_name": "Sunday"
//             }
//         ],
//         [
//             {
//                 "day": 3,
//                 "day_name": "Monday"
//             },
//             {
//                 "day": 4,
//                 "day_name": "Tuesday"
//             },
//             {
//                 "day": 5,
//                 "day_name": "Wednesday"
//             },
//             {
//                 "day": 6,
//                 "day_name": "Thursday"
//             },
//             {
//                 "day": 7,
//                 "day_name": "Friday"
//             },
//             {
//                 "day": 8,
//                 "day_name": "Saturday"
//             },
//             {
//                 "day": 9,
//                 "day_name": "Sunday"
//             }
//         ],
//         [
//             {
//                 "day": 10,
//                 "day_name": "Monday"
//             },
//             {
//                 "day": 11,
//                 "day_name": "Tuesday"
//             },
//             {
//                 "day": 12,
//                 "day_name": "Wednesday"
//             },
//             {
//                 "day": 13,
//                 "day_name": "Thursday"
//             },
//             {
//                 "day": 14,
//                 "day_name": "Friday"
//             },
//             {
//                 "day": 15,
//                 "day_name": "Saturday"
//             },
//             {
//                 "day": 16,
//                 "day_name": "Sunday"
//             }
//         ],
//         [
//             {
//                 "day": 17,
//                 "day_name": "Monday"
//             },
//             {
//                 "day": 18,
//                 "day_name": "Tuesday"
//             },
//             {
//                 "day": 19,
//                 "day_name": "Wednesday"
//             },
//             {
//                 "day": 20,
//                 "day_name": "Thursday"
//             },
//             {
//                 "day": 21,
//                 "day_name": "Friday"
//             },
//             {
//                 "day": 22,
//                 "day_name": "Saturday"
//             },
//             {
//                 "day": 23,
//                 "day_name": "Sunday"
//             }
//         ],
//         [
//             {
//                 "day": 24,
//                 "day_name": "Monday"
//             },
//             {
//                 "day": 25,
//                 "day_name": "Tuesday"
//             },
//             {
//                 "day": 26,
//                 "day_name": "Wednesday"
//             },
//             {
//                 "day": 27,
//                 "day_name": "Thursday"
//             },
//             {
//                 "day": 28,
//                 "day_name": "Friday"
//             },
//             {
//                 "day": 29,
//                 "day_name": "Saturday"
//             },
//             {
//                 "day": 30,
//                 "day_name": "Sunday"
//             }
//         ]
//     ],
//     "dropdown_data": {
//         "months": [
//             {
//                 "id": 1,
//                 "name": "January"
//             },
//             {
//                 "id": 2,
//                 "name": "February"
//             },
//             {
//                 "id": 3,
//                 "name": "March"
//             },
//             {
//                 "id": 4,
//                 "name": "April"
//             },
//             {
//                 "id": 5,
//                 "name": "May"
//             },
//             {
//                 "id": 6,
//                 "name": "June"
//             },
//             {
//                 "id": 7,
//                 "name": "July"
//             },
//             {
//                 "id": 8,
//                 "name": "August"
//             },
//             {
//                 "id": 9,
//                 "name": "September"
//             },
//             {
//                 "id": 10,
//                 "name": "October"
//             },
//             {
//                 "id": 11,
//                 "name": "November"
//             },
//             {
//                 "id": 12,
//                 "name": "December"
//             }
//         ]
//     }
// }










// {
//     "count": 6,
//     "next": null,
//     "previous": null,
//     "results": [
//         {
//             "id": 10,
//             "name": "Kamlesh sharma",
//             "email": "kamlesh720@gmail.com",
//             "call": "8906543123",
//             "send": null,
//             "status": "Lost",
//             "message": "hello,Kamlesh",
//             "team_leader": "Rohit Panchvani",
//             "follow_up_date": null,
//             "follow_up_time": null,
//             "created_date": "2025-11-25T12:32:19.426069Z",
//             "assigned_to": {
//                 "id": 5,
//                 "name": "Piyush Rathor",
//                 "staff_id": "VRI318",
//                 "email": "piyush720@gmail.com",
//                 "mobile": "6789009878"
//             },
//             "project_id": null,
//             "project": null
//         },
//         {
//             "id": 9,
//             "name": "Aditya Kumawat",
//             "email": "adi720@gmail.com",
//             "call": "8990789067",
//             "send": null,
//             "status": "Not Picked",
//             "message": "hello,Aditya",
//             "team_leader": "Rohit Panchvani",
//             "follow_up_date": null,
//             "follow_up_time": null,
//             "created_date": "2025-11-21T12:29:26.784878Z",
//             "assigned_to": {
//                 "id": 5,
//                 "name": "Piyush Rathor",
//                 "staff_id": "VRI318",
//                 "email": "piyush720@gmail.com",
//                 "mobile": "6789009878"
//             },
//             "project_id": null,
//             "project": null
//         },
//         {
//             "id": 14,
//             "name": "Rahul",
//             "email": "fbl@gmail.com",
//             "call": "5678098675",
//             "send": null,
//             "status": "Interested",
//             "message": "",
//             "team_leader": "Rohit Panchvani",
//             "follow_up_date": null,
//             "follow_up_time": null,
//             "created_date": "2025-11-27T12:28:28.812889Z",
//             "assigned_to": {
//                 "id": 5,
//                 "name": "Piyush Rathor",
//                 "staff_id": "VRI318",
//                 "email": "piyush720@gmail.com",
//                 "mobile": "6789009878"
//             },
//             "project_id": null,
//             "project": null
//         },
//         {
//             "id": 12,
//             "name": "Sameer sharma",
//             "email": "sam720@gmail.com",
//             "call": "3456776545",
//             "send": null,
//             "status": "Not Interested",
//             "message": "",
//             "team_leader": "Rohit Panchvani",
//             "follow_up_date": null,
//             "follow_up_time": null,
//             "created_date": "2025-11-26T12:27:30.410587Z",
//             "assigned_to": {
//                 "id": 5,
//                 "name": "Piyush Rathor",
//                 "staff_id": "VRI318",
//                 "email": "piyush720@gmail.com",
//                 "mobile": "6789009878"
//             },
//             "project_id": null,
//             "project": null
//         },
//         {
//             "id": 11,
//             "name": "Ravi kumar",
//             "email": "ravi720@gmail.com",
//             "call": "4546576879",
//             "send": null,
//             "status": "Interested",
//             "message": "erhyjmu;p",
//             "team_leader": "Rohit Panchvani",
//             "follow_up_date": null,
//             "follow_up_time": null,
//             "created_date": "2025-11-25T12:34:24.851480Z",
//             "assigned_to": {
//                 "id": 5,
//                 "name": "Piyush Rathor",
//                 "staff_id": "VRI318",
//                 "email": "piyush720@gmail.com",
//                 "mobile": "6789009878"
//             },
//             "project_id": null,
//             "project": null
//         },
//         {
//             "id": 13,
//             "name": "fgyu",
//             "email": "khjbgmaikn@gamil.com",
//             "call": "5467890987",
//             "send": null,
//             "status": "Interested",
//             "message": ";ouycfhbnjojh",
//             "team_leader": "Rohit Panchvani",
//             "follow_up_date": "2025-11-27",
//             "follow_up_time": "12:33:29",
//             "created_date": "2025-11-27T12:27:36.051358Z",
//             "assigned_to": {
//                 "id": 5,
//                 "name": "Piyush Rathor",
//                 "staff_id": "VRI318",
//                 "email": "piyush720@gmail.com",
//                 "mobile": "6789009878"
//             },
//             "project_id": 1,
//             "project": {
//                 "id": 1,
//                 "name": "Hotel Booking",
//                 "message": "<p>Hello,hotel stasff</p>",
//                 "youtube_link": null,
//                 "media_file": "/media/project/2bedrooms.jpg",
//                 "created_date": "2025-11-19T05:07:38.615989Z",
//                 "updated_date": "2025-11-19T05:07:38.615989Z",
//                 "user": 6,
//                 "admin": 1,
//                 "team_leader": 2,
//                 "staff": 2
//             }
//         }
//     ],
//     "staff_id": 5,
//     "tag": "Interested"
// }