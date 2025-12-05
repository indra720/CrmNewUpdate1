'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pencil,
  PlusCircle,
  Users,
  Check,
  Phone,
  MapPin,
  Eye,
  Mail,
  Lock,
  Calendar,
  Filter,
  MoreVertical,
  ArrowLeft,
  XCircle,
  Clock,
  Briefcase,
  User,
  CreditCard,
  Fingerprint,
  FileText,
  GraduationCap,
  Landmark,
  Hash,
  Wallet,
  Building2,
  ArrowRight,
  FileUp,
  DollarSign,
  Minus,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { fetchSuperuserStaffLeadsByTag, toggleUserActiveStatus, fetchTeamLeaders, fetchAdminsForSelection } from "@/lib/api";




const kpiData = [
  { title: "Total Leads", valueKey: "total_leads", icon: Users, color: "text-rose-500", link: "/superadmin/reports/total-leads?source=staff" },
  { title: "Total Visit", valueKey: "total_visits_leads", icon: Eye, color: "text-green-500", link: "/superadmin/reports/visit?source=staff" },
  { title: "Interested", valueKey: "total_interested_leads", icon: Check, color: "text-teal-500", link: "/superadmin/reports/interested?source=staff" },
  { title: "Not Interested", valueKey: "total_not_interested_leads", icon: XCircle, color: "text-red-500", link: "/superadmin/reports/not-interested?source=staff" },
  { title: "Other Location", valueKey: "total_other_location_leads", icon: MapPin, color: "text-orange-500", link: "/superadmin/reports/other-location?source=staff" },
  { title: "Not Picked", valueKey: "total_not_picked_leads", icon: Phone, color: "text-slate-500", link: "/superadmin/reports/not-picked?source=staff" },
  { title: "Total Earning", valueKey: "total_earning", icon: DollarSign, color: "text-yellow-500", link: "/superadmin/reports/total-earning?source=staff" },
];

const initialFormData = {
  id: null,
  name: "",
  email: "",
  password: "",
  mobile: "",
  dob: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  degree: "",
  pancard: "",
  aadharCard: "",
  bank_name: "",
  account_number: "",
  ifsc_code: "",
  upi_id: "",
  salary: "",
  referralCode: "",
  teamLeader: "",
  admin: "",
};

const InputField = ({ id, label, name, type = 'text', placeholder, icon: Icon, value, onChange, required, children, disabled }: {
  id: string;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: React.ElementType;
  value: string | number;
  onChange: (e: any) => void;
  required?: boolean;
  children?: React.ReactElement;
  disabled?: boolean;
}) => {
  const inputElement = children ?
    React.cloneElement(children, { id, name, value, onChange, required, placeholder, disabled }) :
    <Input type={type} id={id} name={name} value={value as string} onChange={onChange} required={required} placeholder={placeholder} className="pl-10 pr-4 h-11" disabled={disabled} />;

  return (
    <div className="relative flex flex-col space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">{label}</Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />}
        {inputElement}
      </div>
    </div>
  );
};

const ReviewDetailItem = ({ label, value }: { label: string, value: string | undefined | null }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{value || 'N/A'}</p>
  </div>
);



export default function StaffManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const { toast } = useToast();
  const [admins, setAdmins] = useState<any[]>([]);
  const [teamLeaders, setTeamLeaders] = useState<any[]>([]);

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  // staff teamleader card data 
  const [cardData, setcardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/api/superuser/staff-report/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Staff Report API Response:", data);

      // Set card data from lead_counts
      setcardData(data.lead_counts);

      // Set users from staff_list with proper structure
      const staffUsers = data.staff_list.map((staff: any) => ({
        id: staff.id,
        name: staff.name,
        email: staff.email,
        mobile: staff.mobile,
        staff_id: staff.staff_id,
        teamLeader: "N/A",
        created_date: new Date().toISOString(),
        self_user: { user_active: true },
      }));

      setUsers(staffUsers);
    } catch (err: any) {
      setError(err.message);
      setUsers([]);
      setcardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchPageData();
      try {
        const [adminsData, teamLeadersData] = await Promise.all([
          fetchAdminsForSelection(),
          fetchTeamLeaders(),
        ]);
        setAdmins(adminsData);
        setTeamLeaders(teamLeadersData);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
        setAdmins([]);
        setTeamLeaders([]);
        toast({
          title: "Warning",
          description: "Could not load admin and team leader data.",
          variant: "destructive",
        });
      }
    };
    fetchInitialData();
  }, [toast]);


  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.files ? target.files[0] : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddFormSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenAddForm = () => {
    setFormData(initialFormData);
    setActiveTab("personal");
    setIsAddFormOpen(true);
  }

  const handleOpenEditForm = async (user: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found.",
          variant: "destructive",
        });
        return;
      }

      // Fetch staff details from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/staff/edit/${user.id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const staffData = await response.json();
      console.log("Staff Edit Data:", staffData);

      // Populate edit form with fetched data
      setEditingUser({
        id: staffData.id,
        name: staffData.name || '',
        email: staffData.email || '',
        mobile: staffData.mobile || '',
        dob: staffData.dob || '',
        address: staffData.address || '',
        city: staffData.city || '',
        state: staffData.state || '',
        pincode: staffData.pincode || '',
        degree: staffData.degree || '',
        pancard: staffData.pancard || '',
        aadharCard: staffData.aadharCard || '',
        bank_name: staffData.bank_name || '',
        account_number: staffData.account_number || '',
        ifsc_code: staffData.ifsc_code || '',
        upi_id: staffData.upi_id || '',
        salary: staffData.salary || '',
        teamLeader: staffData.team_leader || '',
        admin: staffData.admin || '',
      });

      setIsEditFormOpen(true);
    } catch (error: any) {
      console.error("Error fetching staff data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch staff data for editing.",
        variant: "destructive",
      });
    }
  };



  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    setFormData(initialFormData);
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("=== FORM SUBMISSION START ===");
    console.log("Form Data:", formData);

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token not found.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    if (!formData.email || !formData.password || !formData.teamLeader || !formData.admin) {
      toast({
        title: "Validation Error",
        description: "Email, Password, Team Leader, and Admin are required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('team_leader', formData.teamLeader);
    data.append('admin', formData.admin);

    // Optional fields
    if (formData.name) data.append('name', formData.name);
    if (formData.mobile) data.append('mobile', formData.mobile);
    if (formData.dob) data.append('dob', formData.dob);
    if (formData.address) data.append('address', formData.address);
    if (formData.city) data.append('city', formData.city);
    if (formData.state) data.append('state', formData.state);
    if (formData.pincode) data.append('pincode', formData.pincode);
    if (formData.degree) data.append('degree', formData.degree);
    if (formData.pancard) data.append('pancard', formData.pancard);
    if (formData.aadharCard) data.append('aadharCard', formData.aadharCard);
    if (formData.bank_name) data.append('bank_name', formData.bank_name);
    if (formData.account_number) data.append('account_number', formData.account_number);
    if (formData.ifsc_code) data.append('ifsc_code', formData.ifsc_code);
    if (formData.upi_id) data.append('upi_id', formData.upi_id);
    if (formData.salary) data.append('salary', formData.salary);

    console.log("=== API CALL DATA ===");
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      console.log("Making API call to:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/staff/add/`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/staff/add/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: data,
      });

      console.log("API Response Status:", response.status);
      console.log("API Response OK:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("API Error Data:", errorData);

        let errorMessage = "Failed to add staff.";

        if (errorData) {
          const errors = [];
          if (errorData.team_leader) errors.push(`Team Leader: ${errorData.team_leader.join(', ')}`);
          if (errorData.email) errors.push(`Email: ${errorData.email.join(', ')}`);
          if (errorData.password) errors.push(`Password: ${errorData.password.join(', ')}`);
          if (errorData.admin) errors.push(`Admin: ${errorData.admin.join(', ')}`);

          if (errors.length > 0) {
            errorMessage = errors.join('\n');
          }
        }

        throw new Error(errorMessage);
      }

      const newUser = await response.json();
      console.log("API Success Response:", newUser);

      setUsers([...users, newUser]);
      toast({
        title: "Staff Added!",
        description: `Staff has been added successfully.`,
        className: "bg-green-500 text-white",
      });
      handleCloseAddForm();
      fetchPageData(); // Refresh the data
    } catch (error: any) {
      console.error("=== API ERROR ===");
      console.error("Error:", error);
      console.error("Error Message:", error.message);

      toast({
        title: "Error",
        description: error.message || "Failed to add staff.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      console.log("=== FORM SUBMISSION END ===");
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    console.log("=== EDIT FORM SUBMISSION START ===");
    console.log("Edit Form Data:", editingUser);

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token not found.",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();

    // Add all fields to FormData
    if (editingUser.name) data.append('name', editingUser.name);
    if (editingUser.email) data.append('email', editingUser.email);
    if (editingUser.mobile) data.append('mobile', editingUser.mobile);
    if (editingUser.dob) data.append('dob', editingUser.dob);
    if (editingUser.address) data.append('address', editingUser.address);
    if (editingUser.city) data.append('city', editingUser.city);
    if (editingUser.state) data.append('state', editingUser.state);
    if (editingUser.pincode) data.append('pincode', editingUser.pincode);
    if (editingUser.degree) data.append('degree', editingUser.degree);
    if (editingUser.pancard) data.append('pancard', editingUser.pancard);
    if (editingUser.aadharCard) data.append('aadharCard', editingUser.aadharCard);
    if (editingUser.bank_name) data.append('bank_name', editingUser.bank_name);
    if (editingUser.account_number) data.append('account_number', editingUser.account_number);
    if (editingUser.ifsc_code) data.append('ifsc_code', editingUser.ifsc_code);
    if (editingUser.upi_id) data.append('upi_id', editingUser.upi_id);
    if (editingUser.salary) data.append('salary', editingUser.salary);
    if (editingUser.teamLeader) data.append('team_leader', editingUser.teamLeader);
    if (editingUser.admin) data.append('admin', editingUser.admin);

    console.log("=== EDIT API CALL DATA ===");
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      console.log("Making PATCH API call to:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/staff/edit/${editingUser.id}/`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/users/staff/edit/${editingUser.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: data,
      });

      console.log("Edit API Response Status:", response.status);
      console.log("Edit API Response OK:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Edit API Error Data:", errorData);

        let errorMessage = "Failed to update staff.";
        if (errorData) {
          const errors: string[] = [];
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              errors.push(`${key}: ${errorData[key].join(', ')}`);
            }
          });
          if (errors.length > 0) {
            errorMessage = errors.join('\n');
          }
        }
        throw new Error(errorMessage);
      }

      const updatedUser = await response.json();
      console.log("Edit API Success Response:", updatedUser);

      // Update users list
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...updatedUser } : u));

      toast({
        title: "Staff Updated!",
        description: `${editingUser.name} has been updated successfully.`,
        className: 'bg-green-500 text-white'
      });

      setIsEditFormOpen(false);
      setEditingUser(null);
      fetchPageData(); // Refresh the data
    } catch (error: any) {
      console.error("=== EDIT API ERROR ===");
      console.error("Error:", error);
      console.error("Error Message:", error.message);

      toast({
        title: "Error",
        description: error.message || "Failed to update staff.",
        variant: "destructive",
      });
    } finally {
      console.log("=== EDIT FORM SUBMISSION END ===");
    }
  };


  useEffect(() => {
    // setUsers(mockUsers);
  }, []);

  const handleToggle = async (id: number, isActive: boolean) => {
    // 1. Optimistic UI Update
    const originalUsers = [...users];
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, self_user: { ...u.self_user, user_active: isActive } }
          : u
      )
    );

    try {
      await toggleUserActiveStatus(id, "staff", isActive);

      // 3. Success: Show toast
      toast({
        title: "Status Updated",
        description: `User status changed to ${isActive ? "Active" : "Inactive"
          }.`,
        className: "bg-blue-500 text-white",
        duration: 3000,
      });

      // Optional: Refetch in the background to ensure consistency
      // fetchData(); // Use fetchData for this component
    } catch (error: any) {
      // 2. Failure: Revert state and show error
      setUsers(originalUsers);
      console.error("Failed to update user status:", error);
      toast({
        title: "Error",
        description: `Failed to update user status: ${error.message || "Unknown error"
          }`,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter((u) =>
    Object.values(u).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(search.trim().toLowerCase())
    )
  );

  const KpiCard = ({ title, value, icon, color, link }: { title: string, value: string | number, icon: React.ElementType, color: string, link?: string }) => {
    const cardContent = (
      <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-3 flex flex-col items-center justify-center text-center">
          <div className={`text-3xl ${color} mb-1`}>
            {React.createElement(icon, { className: "h-6 w-6" })}
          </div>
          <div className="font-semibold text-foreground text-sm">{title}</div>
          <div className="text-muted-foreground text-xs mt-1">{value}</div>
        </CardContent>
      </Card>
    );

    if (link) {
      return <Link href={link}>{cardContent}</Link>;
    }

    return cardContent;
  };

  const tabAnimation = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Staff Users</h1>
      {!loading && cardData ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {kpiData.map((card, index) => (
            <KpiCard
              key={index}
              title={card.title}
              value={cardData?.[card.valueKey] ?? 0}
              icon={card.icon}
              color={card.color}
              link={card.link}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          Loading dashboard...
        </p>
      )}

      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Staff List</CardTitle>
            <CardDescription className="hidden sm:block">View and manage staff users.</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 sm:flex-initial sm:max-w-xs pl-10"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button size="icon" className="sm:hidden" onClick={handleOpenAddForm}>
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Add Staff</span>
            </Button>
            <Button className="hidden sm:flex" onClick={handleOpenAddForm}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add new staff
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.N.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Staff ID</TableHead>
                  <TableHead className="hidden md:table-cell">Mobile No</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Leads</TableHead>
                  <TableHead className="hidden lg:table-cell">Active/Non-Active</TableHead>
                  <TableHead className="hidden lg:table-cell">Earn</TableHead>
                  <TableHead className="hidden lg:table-cell">Incentives</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <React.Fragment key={user.id}>
                    <TableRow data-state={expandedRowId === user.id && 'selected'}>
                      <TableCell>
                        <div className="lg:hidden">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-green-600"
                            onClick={() => toggleRow(user.id)}
                          >
                            {expandedRowId === user.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="hidden lg:block">{index + 1}.</div>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.staff_id}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.mobile}</TableCell>
                      <TableCell className="hidden lg:table-cell">{user.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Link href={`/superadmin/users/staff/leads`}>
                          <Button variant="link" size="sm" className="p-0 h-auto text-green-600">View</Button>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Switch
                          checked={user.self_user?.user_active}
                          onCheckedChange={(checked) => handleToggle(user.id, checked)}
                        />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Link href={`/superadmin/users/staff/earn`}>
                          <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">Earn</Button>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Link href={`/superadmin/users/staff/incentives`}>
                          <Button variant="link" size="sm" className="p-0 h-auto text-yellow-600">Incentives</Button>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="hidden lg:flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleOpenEditForm(user)}
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Edit</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="hidden md:flex lg:hidden items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleOpenEditForm(user)}
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Edit</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="md:hidden">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenEditForm(user)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRowId === user.id && (
                      <TableRow className="lg:hidden">
                        <TableCell colSpan={10} className="p-0">
                          <div className="p-4">
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                <div className="flex items-center gap-4">
                                  <div className="text-lg font-bold">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.self_user?.user_active ? 'Active' : 'Inactive'}</div>
                                </div>
                              </div>
                              <div className="overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Staff ID:</span>
                                    <span className="text-sm">{user.staff_id || 'N/A'}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Mobile:</span>
                                    <span className="text-sm">{user.mobile || 'N/A'}</span>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Email:</span>
                                    <span className="text-sm">{user.email || 'N/A'}</span>
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Leads:</span>
                                    <Link href={`/superadmin/users/staff/leads`}>
                                      <Button variant="link" size="sm" className="p-0 h-auto text-green-600">View</Button>
                                    </Link>
                                  </div>
                                  <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Active Status:</span>
                                    <Switch
                                      checked={user.self_user?.user_active}
                                      onCheckedChange={(checked) => handleToggle(user.id, checked)}
                                    />
                                  </div>
                                  <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium">Earn:</span>
                                    <Link href={`/superadmin/users/staff/earn`}>
                                      <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">Earn</Button>
                                    </Link>
                                  </div>
                                  <div className="p-3 flex items-center justify-between">
                                    <span className="text-sm font-medium">Incentives:</span>
                                    <Link href={`/superadmin/users/staff/incentives`}>
                                      <Button variant="link" size="sm" className="p-0 h-auto text-yellow-600">Incentives</Button>
                                    </Link>
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
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No matching records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="sm:max-w-3xl w-[90vw] max-h-[90vh] p-0 rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl font-bold">Add New Staff</DialogTitle>
            <DialogDescription>
              Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <form className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-4 flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <Label className="text-sm font-medium text-muted-foreground">Admin *</Label>
                <Select onValueChange={(value) => handleAddFormSelectChange("admin", value)} name="admin" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {admins.map((admin) => (
                      <SelectItem key={admin.id} value={String(admin.id)}>
                        {admin.name || admin.user?.first_name || admin.user?.email || `Admin ${admin.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <Label className="text-sm font-medium text-muted-foreground">Team Leader *</Label>
                <Select onValueChange={(value) => handleAddFormSelectChange("teamLeader", value)} name="teamLeader" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Team-Leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamLeaders.map((leader) => (
                      <SelectItem key={leader.id} value={String(leader.id)}>
                        {leader.name || leader.user?.first_name || leader.user?.email || `Team Leader ${leader.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
              <div className="px-6 pt-4 flex-shrink-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal">Personal Details</TabsTrigger>
                  <TabsTrigger value="account">Account Details</TabsTrigger>
                </TabsList>
              </div>
              <div className="p-6 overflow-y-auto flex-1 relative hide-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={tabAnimation.initial}
                    animate={tabAnimation.animate}
                    exit={tabAnimation.exit}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    {activeTab === 'personal' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <InputField id="name" label="Name" name="name" placeholder="John Doe" icon={User} value={formData.name} onChange={handleAddFormChange} />
                        <InputField id="email" label="E-Mail Address *" name="email" type="email" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleAddFormChange} required />
                        <InputField id="password" label="Password *" name="password" type="password" placeholder="••••••••" icon={Lock} value={formData.password} onChange={handleAddFormChange} required />
                        <InputField id="dob" label="Date of Birth" name="dob" type="date" icon={Calendar} value={formData.dob} onChange={handleAddFormChange} />
                        <InputField id="pancard" label="Pan Card" name="pancard" placeholder="ABCDE1234F" icon={CreditCard} value={formData.pancard} onChange={handleAddFormChange} />
                        <InputField id="aadharCard" label="Aadhar Card" name="aadharCard" placeholder="1234 5678 9012" icon={Fingerprint} value={formData.aadharCard} onChange={handleAddFormChange} />
                        <InputField id="degree" label="Degree" name="degree" placeholder="B.Tech, M.Sc" icon={GraduationCap} value={formData.degree} onChange={handleAddFormChange} />
                        <InputField id="city" label="City" name="city" placeholder="e.g. Mumbai" icon={Building2} value={formData.city} onChange={handleAddFormChange} />
                        <InputField id="state" label="State" name="state" value={formData.state} onChange={handleAddFormChange}>
                          <Select onValueChange={(value) => handleAddFormSelectChange("state", value)} name="state" defaultValue={formData.state}>
                            <SelectTrigger className="pl-10 pr-4 h-11">
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                              <SelectItem value="Gujarat">Gujarat</SelectItem>
                            </SelectContent>
                          </Select>
                        </InputField>
                        <InputField id="mobile" label="Mobile" name="mobile" type="tel" placeholder="9876543210" icon={Phone} value={formData.mobile} onChange={handleAddFormChange} />
                        <InputField id="salary" label="Salary" name="salary" placeholder="e.g. 50000" icon={Wallet} value={formData.salary} onChange={handleAddFormChange} />
                      </div>
                    )}
                    {activeTab === 'account' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <InputField id="account_number" label="Account Number" name="account_number" placeholder="Your account number" icon={Wallet} value={formData.account_number} onChange={handleAddFormChange} />
                        <InputField id="upi_id" label="Add UPI" name="upi_id" placeholder="yourname@upi" icon={Briefcase} value={formData.upi_id} onChange={handleAddFormChange} />
                        <InputField id="bank_name" label="Bank Name" name="bank_name" placeholder="e.g. State Bank of India" icon={Landmark} value={formData.bank_name} onChange={handleAddFormChange} />
                        <InputField id="ifsc_code" label="IFSC Code" name="ifsc_code" placeholder="SBIN0001234" icon={Hash} value={formData.ifsc_code} onChange={handleAddFormChange} />
                        <InputField id="pincode" label="Pincode" name="pincode" placeholder="e.g. 110001" icon={MapPin} value={formData.pincode} onChange={handleAddFormChange} />
                        <div className="md:col-span-2">
                          <InputField id="address" label="Address" name="address" value={formData.address} onChange={handleAddFormChange}>
                            <Textarea className="pl-10 pr-4 min-h-[80px]" placeholder="Enter full address" />
                          </InputField>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <DialogFooter className="p-6 pt-4 border-t bg-muted/50 flex justify-between w-full flex-shrink-0">
                {activeTab === 'personal' ? (
                  <div></div>
                ) : (
                  <Button type="button" variant="outline" onClick={() => setActiveTab('personal')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                {activeTab === 'personal' ? (
                  <Button type="button" onClick={() => setActiveTab('account')}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleAddSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Save Staff"
                    )}
                  </Button>
                )}
              </DialogFooter>
            </Tabs>
          </form>
        </DialogContent>
      </Dialog>

      {editingUser && (
        <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
          <DialogContent className="w-[95vw] sm:max-w-md max-h-[80vh] overflow-y-auto hide-scrollbar">
            <DialogHeader>
              <DialogTitle>Edit Staff</DialogTitle>
              <DialogDescription>
                Update the details for {editingUser.name}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" name="name" value={editingUser.name} onChange={handleEditFormChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" value={editingUser.email} onChange={handleEditFormChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mobile">Mobile</Label>
                <Input id="edit-mobile" name="mobile" value={editingUser.mobile} onChange={handleEditFormChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-teamLeader">Team Leader</Label>
                <Select onValueChange={(value) => handleEditSelectChange("teamLeader", value)} name="teamLeader" defaultValue={editingUser.teamLeader}>
                  <SelectTrigger id="edit-teamLeader">
                    <SelectValue placeholder="Select Team Leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamLeaders.map((leader) => (
                      <SelectItem key={leader.id} value={String(leader.id)}>
                        {leader.name || leader.user?.first_name || leader.user?.email || `Team Leader ${leader.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">New Password (optional)</Label>
                <Input id="edit-password" name="password" type="password" placeholder="Leave blank to keep current password" onChange={handleEditFormChange} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditFormOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}


    </div>
  );
};
