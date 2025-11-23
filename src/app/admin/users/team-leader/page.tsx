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
  Plus,
  Minus,
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
  Search,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock User Data for Team Leader view
const mockUsers = [
  {
    id: 1,
    name: 'teamlead',
    mobile: '3216549870',
    email: 'leader1@example.com',
    admin: { name: 'admin' },
    created_date: '2025-10-11T12:00:00.000Z',
    self_user: { user_active: true },
    dob: '1990-01-01',
    address: '123 Leader St, Anytown',
    city: 'Anytown',
    state: 'Rajasthan',
    pincode: '123456',
    degree: 'B.Eng',
    pancard: 'LEADR1234F',
    aadharCard: '123456789012',
    bank_name: 'State Bank of India',
    account_number: '1234567890',
    ifsc_code: 'SBIN000000',
    upi_id: 'leader1@upi',
    salary: '80000',
    referralCode: 'LEAD123',
    marksheets: null,
  },
  {
    id: 2,
    name: 'teamlead2',
    mobile: '3216549871',
    email: 'leader2@example.com',
    admin: { name: 'admin' },
    created_date: '2025-10-12T12:00:00.000Z',
    self_user: { user_active: false },
    dob: '1992-05-15',
    address: '456 Oak Ave, Othertown',
    city: 'Othertown',
    state: 'Maharashtra',
    pincode: '654321',
    degree: 'M.B.A',
    pancard: 'LEADR5678K',
    aadharCard: '987654321098',
    bank_name: 'HDFC Bank',
    account_number: '0987654321',
    ifsc_code: 'HDFC000000',
    upi_id: 'leader2@upi',
    salary: '95000',
    referralCode: 'LEAD456',
    marksheets: null,
  },
];

const mockLeadsData = {
  results: [
    { id: 1, name: 'Aarav Sharma', status: 'New' },
    { id: 2, name: 'Saanvi Patel', status: 'Contacted' },
    { id: 3, name: 'Vihaan Singh', status: 'Interested' },
    { id: 4, name: 'Myra Reddy', status: 'Not Interested' },
    { id: 5, name: 'Kabir Verma', status: 'New' },
    { id: 6, name: 'Diya Gupta', status: 'Remaining' },
    { id: 7, name: 'Ishaan Kumar', status: 'New' },
    { id: 8, name: 'Advika Joshi', status: 'Not Interested' },
    { id: 9, name: 'Reyansh Mehra', status: 'Interested' },
    { id: 10, name: 'Ananya Desai', status: 'New' },
    { id: 11, name: 'Aryan Mehta', status: 'Visit' },
    { id: 12, name: 'Kiara Sen', status: 'Visit' },
    { id: 13, name: 'Arjun Rao', status: 'Not Picked' },
    { id: 14, name: 'Zara Khan', status: 'Not Picked' },
    { id: 15, name: 'Samaira Iyer', status: 'Other Location' },
  ],
};

const kpiCounts = {
  total_leads: mockLeadsData.results.length,
  total_visit: mockLeadsData.results.filter(l => l.status === 'Visit').length,
  total_interested: mockLeadsData.results.filter(l => l.status === 'Interested').length,
  total_not_interested: mockLeadsData.results.filter(l => l.status === 'Not Interested').length,
  total_other_location: mockLeadsData.results.filter(l => l.status === 'Other Location').length,
  total_not_picked: mockLeadsData.results.filter(l => l.status === 'Not Picked').length,
};

const kpiData = [
  { title: "Total Leads", valueKey: "total_leads", icon: Users, color: "text-rose-500", link: "/admin/reports/total-leads" },
  { title: "Total Visit", valueKey: "total_visit", icon: Eye, color: "text-green-500", link: "/admin/reports/visit" },
  { title: "Interested", valueKey: "total_interested", icon: Check, color: "text-teal-500", link: "/admin/reports/interested" },
  { title: "Not Interested", valueKey: "total_not_interested", icon: XCircle, color: "text-red-500", link: "/admin/reports/not-interested" },
  { title: "Other Location", valueKey: "total_other_location", icon: MapPin, color: "text-orange-500", link: "/admin/reports/other-location" },
  { title: "Not Picked", valueKey: "total_not_picked", icon: Phone, color: "text-slate-500", link: "/admin/reports/not-picked" },
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
  marksheets: null,
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

export default function TeamLeaderManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState("personal");
  const [editActiveTab, setEditActiveTab] = useState("personal");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { toast } = useToast();

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

  const handleOpenEditForm = (user: any) => {
    setEditingUser({ ...user });
    setEditActiveTab("personal");
    setIsEditFormOpen(true);
  }

  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    setFormData(initialFormData);
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = { ...formData, id: Date.now(), admin: { name: 'Super Admin' }, created_date: new Date().toISOString(), self_user: { user_active: true } };
    setUsers([...users, newUser]);
    toast({
      title: "Team Leader Added!",
      description: `${formData.name} has been added successfully.`,
      className: 'bg-green-500 text-white'
    });
    handleCloseAddForm();
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    toast({
      title: "Team Leader Updated!",
      description: `${editingUser.name} has been updated successfully.`,
      className: 'bg-green-500 text-white'
    });
    setIsEditFormOpen(false);
    setEditingUser(null);
  };

  const toggleRow = (rowId: number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const handleToggle = async (id: number, isActive: boolean) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUsers(users.map(u => u.id === id ? { ...u, self_user: { ...u.self_user, user_active: isActive } } : u));
      toast({
        title: 'Status Updated',
        description: `User status changed to ${isActive ? 'Active' : 'Inactive'}.`,
        className: 'bg-blue-500 text-white'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to update user status.',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter((u) =>
    Object.values(u).some(
      (val: any) =>
        val &&
        (typeof val === 'string' || typeof val === 'number' || (typeof val === 'object' && val.name)) &&
        (val.name || val).toString().toLowerCase().includes(search.trim().toLowerCase())
    )
  );

  const KpiCard = ({ title, value, icon, color, link }: { title: string, value: number, icon: React.ElementType, color: string, link?: string }) => {
    const cardContent = (
      <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-3 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className={`text-3xl ${color} mb-1`}>
            {React.createElement(icon, { className: "h-6 w-6" })}
          </motion.div>
          <div className="font-semibold text-foreground text-sm">{title}</div>
          <div className="text-muted-foreground text-xs mt-1">
            {value}
          </div>
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
    <>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Team Leader List</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {kpiData.map((card, index) => (
            <KpiCard
              key={index}
              title={card.title}
              value={kpiCounts[card.valueKey as keyof typeof kpiCounts]}
              icon={card.icon}
              color={card.color}
              link={card.link} />
          ))}
        </div>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="start-date" className="sr-only">Start Date</Label>
                  <div className="relative">
                    <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="pl-10" />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="end-date" className="sr-only">End Date</Label>
                  <div className="relative">
                    <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="pl-10" />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 sm:w-auto lg:w-64"
                />
              </div>
              <Button>
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button onClick={handleOpenAddForm}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Team Leader
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
                    <TableHead className="hidden md:table-cell">Admin</TableHead>
                    <TableHead className="hidden md:table-cell">Mobile No</TableHead>
                    <TableHead className="hidden lg:table-cell">Created Date</TableHead>
                    <TableHead className="hidden lg:table-cell">Leads Report</TableHead>
                    <TableHead className="text-center hidden lg:table-cell">Active/Non-Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <React.Fragment key={user.id}>
                      <TableRow data-state={expandedRowId === user.id && 'selected'}>
                        <TableCell>
                          <>
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
                            {/* lg+: only number */}
                            <div className="hidden lg:block">
                              {index + 1}.
                            </div>
                          </>
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.admin?.name || 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.mobile}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(user.created_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <select className="form-select form-select-sm w-full bg-background border border-input rounded-md px-2 py-1 text-sm" onChange={(e) => e.target.value && window.location.assign(e.target.value)}>
                              <option value="">Select Type</option>
                              <option value={`/admin/reports/interested`}>Interested</option>
                              <option value={`/admin/reports/not-interested`}>Not Interested</option>
                              <option value={`/admin/reports/other-location`}>Other Location</option>
                              <option value={`/admin/reports/total-leads`}>Lost</option>
                              <option value={`/admin/reports/visit`}>Visit</option>
                          </select>
                        </TableCell>
                        <TableCell className="text-center hidden lg:table-cell">
                          <Switch
                            checked={user.self_user?.user_active}
                            onCheckedChange={(checked) =>
                              handleToggle(user.id, checked)
                            }
                          />
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
                                  <TooltipContent>
                                    <p>Edit</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                          </div>
                          {/* MD screen: Edit button only */}
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
                                  <TooltipContent>
                                    <p>Edit</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                          </div>
                           <div className="md:hidden">
                               <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">More</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleOpenEditForm(user)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRowId === user.id && (
                        <TableRow className="lg:hidden">
                          <TableCell colSpan={8} className="p-0">
                            <div className="p-4">
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="p-4 flex items-center gap-4 border-b border-gray-200">
                                  <div className="flex items-center gap-4">
                                    <div className="text-lg font-bold">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.self_user?.user_active ? 'Active' : 'Inactive'}</div>
                                  </div>
                                </div>
                                {/* Table-like grid for details: 2 cols on md+, 1 on mobile */}
                                <div className="overflow-hidden">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
                                    {/* Row 1: Admin | Mobile */}
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Admin:</span>
                                      </div>
                                      <span className="text-sm capitalize ml-auto md:ml-0">{user.admin?.name || 'N/A'}</span>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Mobile:</span>
                                      </div>
                                      <span className="text-sm ml-auto md:ml-0">{user.mobile || 'N/A'}</span>
                                    </div>
                                    {/* Row 2: Created Date | Leads Report */}
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Created Date:</span>
                                      </div>
                                      <span className="text-sm ml-auto md:ml-0">{user.created_date ? new Date(user.created_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-') : 'N/A'}</span>
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Leads Report:</span>
                                      </div>
                                      <select className="text-sm w-full bg-background border border-input rounded-md px-2 py-1" onChange={(e) => e.target.value && window.location.assign(e.target.value)}>
                                          <option value="">Select Type</option>
                                          <option value={`/admin/reports/interested`}>Interested</option>
                                          <option value={`/admin/reports/not-interested`}>Not Interested</option>
                                          <option value={`/admin/reports/other-location`}>Other Location</option>
                                          <option value={`/admin/reports/total-leads`}>Lost</option>
                                          <option value={`/admin/reports/visit`}>Visit</option>
                                      </select>
                                    </div>
                                    {/* Row 3: Active Status | Edit Button */}
                                    <div className="p-3 border-b border-r md:border-r-0 border-gray-200 flex items-center justify-between md:justify-start md:gap-4">
                                      <div className="flex items-center">
                                        <Check className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm font-medium">Active Status:</span>
                                      </div>
                                      <Switch
                                        checked={user.self_user?.user_active}
                                        onCheckedChange={(checked) =>
                                          handleToggle(user.id, checked)
                                        }
                                        className="ml-auto md:ml-0"
                                      />
                                    </div>
                                    <div className="p-3 border-b border-l md:border-l-0 border-gray-200 flex items-center justify-center md:justify-end">
                                      <Button size="sm" onClick={() => handleOpenEditForm(user)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                      </Button>
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
                      <TableCell colSpan={8} className="h-24 text-center">
                        No matching records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0 rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl font-bold">Add New Team Leader</DialogTitle>
            <DialogDescription>
              Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="flex-1 flex flex-col min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
              <div className="px-6 flex-shrink-0">
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
                        <InputField id="name" label="Name" name="name" placeholder="John Doe" icon={User} value={formData.name} onChange={handleAddFormChange} required />
                        <InputField id="email" label="E-Mail Address" name="email" type="email" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleAddFormChange} required />
                        <InputField id="password" label="Password" name="password" type="password" placeholder="••••••••" icon={Lock} value={formData.password} onChange={handleAddFormChange} required />
                        <InputField id="dob" label="Date of Birth" name="dob" type="date" icon={Calendar} value={formData.dob} onChange={handleAddFormChange} />
                        <InputField id="pancard" label="Pan Card" name="pancard" placeholder="ABCDE1234F" icon={CreditCard} value={formData.pancard} onChange={handleAddFormChange} />
                        <InputField id="aadharCard" label="Aadhar Card" name="aadharCard" placeholder="1234 5678 9012" icon={Fingerprint} value={formData.aadharCard} onChange={handleAddFormChange} />
                        <InputField id="marksheets" label="MarkSheets" name="marksheets" type="file" icon={FileText} onChange={handleAddFormChange} value={''} />
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
                        <InputField id="mobile" label="Mobile" name="mobile" type="tel" placeholder="9876543210" icon={Phone} value={formData.mobile} onChange={handleAddFormChange} required />
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
                  <Button type="submit">Save Team Leader</Button>
                )}
              </DialogFooter>
            </Tabs>
          </form>
        </DialogContent>
      </Dialog>

      {editingUser && (
        <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Team Leader</DialogTitle>
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
    </>
  );
}; 




