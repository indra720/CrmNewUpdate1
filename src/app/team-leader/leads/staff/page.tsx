
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
import { Search, Phone, MessageSquare, Calendar, FileDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

const mockLeads = [
    { id: 1, name: 'Aarav Sharma', staff: 'Rohan', status: 'New', call: '9876543210', updated_date: 'Oct. 16, 2025, 7:07 a.m.'},
    { id: 2, name: 'Saanvi Patel', staff: 'Anjali', status: 'Contacted', call: '9876543211', updated_date: 'Oct. 16, 2025, 7:03 a.m.' },
    { id: 3, name: 'Vihaan Singh', staff: 'Rohan', status: 'Interested', call: '9876543212', updated_date: 'Oct. 11, 2025, 8:57 a.m.' },
    { id: 4, name: 'Myra Reddy', staff: 'Anjali', status: 'Lost', call: '9876543213', updated_date: 'Oct. 11, 2025, 7:06 a.m.' },
];

export default function StaffLeadsPage() {
    const router = useRouter();

    const handleTypeNavChange = (value: string) => {
        if (!value) return;
        router.push(value);
    }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Staff Leads</h1>

       <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
             <div className="flex items-center gap-4">
                <p className="text-sm font-medium">Filter</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Select>
                        <SelectTrigger><SelectValue placeholder="Assigned" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user1">User 1</SelectItem>
                            <SelectItem value="user2">User 2</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger><SelectValue placeholder="Interested" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger><SelectValue placeholder="IT-Team" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="team-a">Team A</SelectItem>
                            <SelectItem value="team-b">Team B</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select>
                        <SelectTrigger><SelectValue placeholder="Lost" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
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
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.N.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Call</TableHead>
                  <TableHead className="text-center">Whatsapp</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeads.map((lead, index) => (
                  <TableRow key={lead.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.staff}</TableCell>
                    <TableCell>
                      <Badge variant={lead.status === 'Interested' ? 'default' : 'secondary'}>{lead.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                       <Button variant="ghost" size="icon" asChild>
                         <a href={`tel:${lead.call}`}><Phone className="h-4 w-4 text-blue-500" /></a>
                       </Button>
                    </TableCell>
                    <TableCell className="text-center">
                        <Button variant="ghost" size="icon" asChild>
                            <a href={`https://wa.me/91${lead.call}?text=Hello%20${lead.name}`} target="_blank" rel="noopener noreferrer">
                                <MessageSquare className="h-5 w-5 text-green-500" />
                            </a>
                        </Button>
                    </TableCell>
                    <TableCell>{lead.updated_date}</TableCell>
                  </TableRow>
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
