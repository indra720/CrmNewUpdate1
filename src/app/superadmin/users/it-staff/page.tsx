"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { AttendanceDialog } from "./attendance-dialog";
import { toggleUserActiveStatus } from "@/lib/api";
import { toast, useToast } from "@/hooks/use-toast";

export default function ItStaffPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null
  );
  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/it-staff/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.error("Failed to fetch IT staff", response.status);
        return;
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching IT staff:", error);
    }
  };

  useEffect(() => {
    // setUsers(mockUsers);
    fetchUsers();
  }, []);

  const handleToggle = async (id: number, isActive: boolean) => {
    // 1. Optimistic UI Update
    const originalUsers = [...users];
    setUsers(
      users.map((user) =>
        user.staff_id === id ? { ...user, active: isActive } : user
      )
    );

    try {
      await toggleUserActiveStatus(id, "it_staff", isActive);

      // 3. Success: Show toast (assuming useToast is available)
      toast({
        title: "Status Updated",
        description: `User status changed to ${
          isActive ? "Active" : "Inactive"
        }.`,
        className: "bg-blue-500 text-white",
        duration: 3000,
      });

      // Optional: Refetch in the background to ensure consistency
      // fetchUsers();
    } catch (error: any) {
      // 2. Failure: Revert state and show error
      setUsers(originalUsers);
      console.error("Failed to update user status:", error);
      toast({
        title: "Error",
        description: `Failed to update user status: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile.includes(search)
  );

  return (
    <div className="space-y-6 flex flex-col h-full">
      <h1 className="text-2xl font-bold tracking-tight">IT Staff Users</h1>

      <Card className="shadow-lg rounded-2xl flex-1 flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All IT Staff</CardTitle>
              <CardDescription>Manage IT staff members.</CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <div className="overflow-x-auto h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base md:text-sm">SR. NO</TableHead>
                  <TableHead className="text-base md:text-sm">Name</TableHead>
                  <TableHead className="text-base md:text-sm">
                    Mobile No
                  </TableHead>
                  <TableHead className="text-center text-base md:text-sm">
                    Active / Non-Active
                  </TableHead>
                  <TableHead className="text-center text-base md:text-sm">
                    Attendance
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-base md:text-sm">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium text-base md:text-sm">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-base md:text-sm">
                        {user.mobile}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={user.active}
                          onCheckedChange={() => handleToggle(user.staff_id)}
                          aria-label={`Toggle status for ${user.name}`}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setSelectedUserEmail(user.email); // ✅ YE BHI ADD KARO
                            setIsAttendanceDialogOpen(true);
                          }}
                        >
                          Attendance
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-base md:text-sm"
                    >
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AttendanceDialog
        userId={selectedUserId}
        userEmail={selectedUserEmail} // ✅ YE ADD KARO
        isOpen={isAttendanceDialogOpen}
        onClose={() => setIsAttendanceDialogOpen(false)}
      />
    </div>
  );
}
