

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const users = [
  { name: "Liam Johnson", email: "liam@example.com", role: "Admin", status: "Active", avatar: "https://picsum.photos/seed/1/40/40" },
  { name: "Olivia Smith", email: "olivia@example.com", role: "Team Leader", status: "Active", avatar: "https://picsum.photos/seed/2/40/40" },
  { name: "Noah Williams", email: "noah@example.com", role: "Staff", status: "Inactive", avatar: "https://picsum.photos/seed/3/40/40" },
  { name: "Emma Brown", email: "emma@example.com", role: "Staff", status: "Active", avatar: "https://picsum.photos/seed/4/40/40" },
  { name: "Oliver Jones", email: "oliver@example.com", role: "SuperAdmin", status: "Active", avatar: "https://picsum.photos/seed/5/40/40" },
  { name: "Sophia Garcia", email: "sophia@example.com", role: "Staff", status: "Active", avatar: "https://picsum.photos/seed/6/40/40" },
];

const roleColors: { [key: string]: string } = {
    SuperAdmin: "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    Admin: "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    "Team Leader": "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
    Staff: "bg-gray-500/20 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
}

export default function ManageUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Link href="/superadmin/manage-users/add">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
            </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View, edit, or delete users from the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]}>
                        {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"} className={user.status === 'Active' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
