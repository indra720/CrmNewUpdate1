'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Minus, User, Mail, User as UserIcon, Calendar, MapPin } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface ActivityLog {
  id: number;
  name: string | null;
  description: string;
  email: string;
  user_type: string;
  activity_type: string;
  ip_address: string;
  created_date: string;
  updated_date: string;
  user: number | null;
  admin: number | null;
  team_leader: number | null;
  staff: number | null;
}

const TimeSheetPage = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const itemsPerPage = 8;

  // Fetch activity logs from API with pagination
  const fetchActivityLogs = async (page: number = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/activitylogs/?page=${page}`, {
        headers: {
          'Authorization': ` Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.results || []);
        setTotalCount(data.count || 0);
        setTotalPages(Math.ceil((data.count || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs(currentPage);
  }, [currentPage]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const filteredLogs = search 
    ? logs.filter((log) =>
        Object.values(log)
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : logs;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Time Sheet</h1>
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-8 text-center">
            <p>Loading activity logs...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Time Sheet</h1>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex flex-row items-center justify-between gap-2 px-2 md:px-0 md:gap-4">
            <div className="relative flex-1 md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-lg rounded-2xl">
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">S.N.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Activity Type</TableHead>
                  <TableHead className="hidden sm:table-cell">User Type</TableHead>
                  <TableHead className="hidden md:table-cell">IP Address</TableHead>
                  <TableHead className="w-32 text-center">Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <React.Fragment key={log.id}>
                      <TableRow className="hover:bg-muted/50 transition-colors">
                        <TableCell className="text-center">
                          <div className="sm:hidden">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-green-600 h-8 w-8"
                              onClick={() => toggleRow(log.id)}
                            >
                              {expandedRowId === log.id ? (
                                <Minus className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="hidden sm:block">
                            {((currentPage - 1) * itemsPerPage) + index + 1}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium max-w-md truncate">
                          {log.name || 'N/A'}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell max-w-md truncate">
                          {log.email}
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-md truncate">
                          {log.activity_type}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell max-w-md truncate">
                          {log.user_type}
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-md truncate">
                          {log.ip_address}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatDate(log.created_date)}
                        </TableCell>
                      </TableRow>

                      {expandedRowId === log.id && (
                        <TableRow className="sm:hidden">
                          <TableCell colSpan={7} className="p-0">
                            <div className="p-4">
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    <UserIcon className="h-6 w-6 text-gray-500" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-base">{log.name || 'N/A'}</h3>
                                  </div>
                                </div>
                                <div className="p-4 space-y-3">
                                  <div className="flex items-start gap-3">
                                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm text-foreground">{log.email}</span>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <UserIcon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm text-foreground">{log.user_type}</span>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm text-foreground">{log.ip_address}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-foreground">{formatDate(log.created_date)}</span>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <UserIcon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                    <p className="text-sm text-foreground leading-relaxed">{log.description}</p>
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
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => goToPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default TimeSheetPage;