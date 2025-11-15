"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Minus } from "lucide-react";

const ProductivityAssociatesPage = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const [AssociateData, setAssociateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssociateData = async () => {
    const token = localStorage.getItem("authToken");
    setLoading(true);
    setError(null);
    const adminResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/dashboard/super-admin/`,
      {
        headers: { Authorization: ` Token ${token}` },
      }
    );
    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      setAdmins(adminData.users || []);
    } else {
      console.error("filed to fetching admin failed");
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/productivity/freelancer/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAssociateData(data);
      // setAdmins(data.admins_filter_list || []);
      console.log("Data fetched successfully", data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociateData();
  }, [selectedAdmin, startDate, endDate]);

  const handleAdminChange = (value: string) => {
    setSelectedAdmin(value);
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
  if (!AssociateData) {
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
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">SN</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">
                    <span className="sm:hidden">Calls</span>
                    <span className="hidden sm:inline">Total Calls</span>
                  </TableHead>
                  <TableHead className="text-center hidden sm:table-cell">
                    Interested
                  </TableHead>
                  <TableHead className="text-center hidden sm:table-cell">
                    Not Interested
                  </TableHead>
                  <TableHead className="text-center hidden sm:table-cell">
                    Other Location
                  </TableHead>
                  <TableHead className="text-center hidden sm:table-cell">
                    Lost
                  </TableHead>
                  <TableHead className="text-center hidden sm:table-cell">
                    Visit
                  </TableHead>
                  <TableHead className="text-center hidden sm:table-cell">
                    Interested %
                  </TableHead>
                  <TableHead className="text-center hidden sm:table-cell">
                    Visit %
                  </TableHead>
                  <TableHead className="text-center sm:hidden">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AssociateData.staff_data &&
                  AssociateData.staff_data.map((row: any, i: number) => (
                    <React.Fragment key={row.id}>
                      <TableRow>
                        <TableCell className="text-center">{i + 1}</TableCell>
                        <TableCell className="font-medium">
                          {row.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.total_calls}
                        </TableCell>
                        <TableCell className="text-center text-blue-600 hidden sm:table-cell">
                          {row.interested}
                        </TableCell>
                        <TableCell className="text-center text-red-500 hidden sm:table-cell">
                          {row.not_interested}
                        </TableCell>
                        <TableCell className="text-center hidden sm:table-cell">
                          {row.other_location}
                        </TableCell>
                        <TableCell className="text-center hidden sm:table-cell">
                          {row.lost}
                        </TableCell>
                        <TableCell className="text-center text-green-600 hidden sm:table-cell">
                          {row.visit}
                        </TableCell>
                        <TableCell className="text-center font-medium hidden sm:table-cell">
                          {row.interested_percentage}%
                        </TableCell>
                        <TableCell className="text-center font-medium hidden sm:table-cell">
                          {row.visit_percentage}%
                        </TableCell>
                        <TableCell className="text-center sm:hidden">
                          <button
                            onClick={() => toggleRow(row.id)}
                            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            {expandedRowId === row.id ? (
                              <Minus className="h-4 w-4 text-green-500" />
                            ) : (
                              <Plus className="h-4 w-4 text-green-500" />
                            )}
                          </button>
                        </TableCell>
                      </TableRow>
                      {expandedRowId === row.id && (
                        <TableRow className="sm:hidden">
                          <TableCell colSpan={4} className="p-0">
                            <div className="p-4 bg-gray-50">
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="grid grid-cols-2 divide-x divide-gray-200">
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="text-sm text-gray-600">
                                      Total Leads
                                    </div>
                                    <div className="text-lg font-semibold mt-1">
                                      {row.total_leads}
                                    </div>
                                  </div>
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="text-sm text-gray-600">
                                      Interested
                                    </div>
                                    <div className="text-lg font-semibold mt-1">
                                      {row.interested}
                                    </div>
                                  </div>
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="text-sm text-gray-600">
                                      Not Interested
                                    </div>
                                    <div className="text-lg font-semibold mt-1">
                                      {row.not_interested}
                                    </div>
                                  </div>
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="text-sm text-gray-600">
                                      Other Location
                                    </div>
                                    <div className="text-lg font-semibold mt-1">
                                      {row.other_location}
                                    </div>
                                  </div>
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="text-sm text-gray-600">
                                      Not Picked
                                    </div>
                                    <div className="text-lg font-semibold mt-1">
                                      {row.not_picked}
                                    </div>
                                  </div>
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="text-sm text-gray-600">
                                      Lost
                                    </div>
                                    <div className="text-lg font-semibold mt-1">
                                      {row.lost}
                                    </div>
                                  </div>
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="text-sm text-gray-600">
                                      Visit
                                    </div>
                                    <div className="text-lg font-semibold mt-1">
                                      {row.visit}
                                    </div>
                                  </div>
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="text-sm text-gray-600">
                                      Total Calls
                                    </div>
                                    <div className="text-lg font-semibold mt-1">
                                      {row.total_calls}
                                    </div>
                                  </div>
                                  <div className="p-3">
                                    <div className="text-sm text-gray-600">
                                      Interested %
                                    </div>
                                    <div className="text-lg font-semibold mt-1">
                                      {row.interested_percentage}%
                                    </div>
                                  </div>
                                  <div className="p-3">
                                    <div className="text-sm text-gray-600">
                                      Visit %
                                    </div>
                                    <div className="text-lg font-semibold mt-1">
                                      {row.visit_percentage}%
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
              <TableFooter>
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-center">
                    {AssociateData.staff_data
                      ? AssociateData.staff_data.length
                      : 0}
                  </TableCell>
                  <TableCell className="text-center">
                    {AssociateData.total_all_calls}
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    {AssociateData.total_all_interested}
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    {AssociateData.total_all_not_interested}
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    {AssociateData.total_all_other_location}
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    {AssociateData.total_all_lost}
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    {AssociateData.total_all_visit}
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    {AssociateData.total_all_calls > 0
                      ? Math.round(
                          (AssociateData.total_all_interested /
                            AssociateData.total_all_calls) *
                            100
                        )
                      : 0}
                    %
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    {AssociateData.total_all_calls > 0
                      ? Math.round(
                          (AssociateData.total_all_visit /
                            AssociateData.total_all_calls) *
                            100
                        )
                      : 0}
                    %
                  </TableCell>
                  <TableCell className="sm:hidden"></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductivityAssociatesPage;
