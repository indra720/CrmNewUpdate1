
'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { 
    Users,
    Clock,
    Eye,
    CheckCircle,
    XCircle,
    MapPin,
    PhoneOff,
    Calendar,
    Search,
    PlusCircle,
    LogIn,
    LogOut,
    UserCheck,
    FileUp,
    Percent,
    Pencil,
    Mail,
    Lock,
    Filter,
    MoreVertical,
    ArrowLeft,
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
    Phone,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const kpiData = [
    { title: 'Total Lead', value: 0, icon: Users, color: 'text-rose-500', link: '/team-leader/reports/total-leads' },
    { title: 'Total Visits', value: 0, icon: Eye, color: 'text-green-500', link: '/team-leader/reports/visit' },
    { title: 'Interested', value: 0, icon: CheckCircle, color: 'text-teal-500', link: '/team-leader/reports/interested' },
    { title: 'Not Interested', value: 0, icon: XCircle, color: 'text-red-500', link: '/team-leader/reports/not-interested' },
    { title: 'Other Location', value: 0, icon: MapPin, color: 'text-orange-500', link: '/team-leader/reports/other-location' },
    { title: 'Not Picked', value: 0, icon: PhoneOff, color: 'text-slate-500', link: '/team-leader/reports/not-picked' },
];

const staffData = [
  {
    id: 1,
    name: 'staff',
    email: 'staff@gmail.com',
    mobile: '9632587410',
    createdDate: '11-Oct-2025',
    status: 'Inactive',
    duration: '1:26:10',
  },
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

const KpiCard = ({ title, value, icon: Icon, color, link }: { title: string, value: number, icon: React.ElementType, color: string, link?: string }) => {
    const cardContent = (
      <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 h-full bg-card">
        <CardContent className="p-3 flex flex-col items-center justify-center text-center gap-1">
            <div className={cn("text-primary", color)}>
                <Icon className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-lg font-bold text-muted-foreground">{value}</p>
        </CardContent>
      </Card>
    );

    if (link) {
        return <Link href={link}>{cardContent}</Link>;
    }

    return cardContent;
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

export default function TeamLeaderDashboardPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const { toast } = useToast();
  const [users, setUsers] = useState(staffData);

  const filteredStaff = users.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
    setActiveTab("personal");
    setIsEditFormOpen(true);
  }
  
  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    setFormData(initialFormData);
  }
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {...formData, id: Date.now(), createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'), status: 'Inactive', duration: '0:00:00' };
    setUsers([...users, newUser]);
    toast({
        title: "Staff Added!",
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
        title: "Staff Updated!",
        description: `${editingUser.name} has been updated successfully.`,
        className: 'bg-green-500 text-white'
    });
    setIsEditFormOpen(false);
    setEditingUser(null);
  };
  
    const tabAnimation = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight">Staff Users</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
        {kpiData.map(item => (
          <KpiCard key={item.title} {...item} />
        ))}
      </div>
      
      <Card>
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10"
                    />
                </div>
                <div className="relative w-full">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10"
                    />
                </div>
                <Button className="w-full md:w-auto flex-shrink-0">Filter</Button>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
             <div>
                <CardTitle>Staff List</CardTitle>
                <CardDescription className="hidden sm:block">View and manage staff users.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button className="w-full sm:w-auto" onClick={handleOpenAddForm}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add new staff
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SR. NO</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email id</TableHead>
                  <TableHead>Mobile No</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Incentives</TableHead>
                  <TableHead>Earn</TableHead>
                  <TableHead>Add Sell</TableHead>
                  <TableHead>Edit Now</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff, index) => (
                  <TableRow key={staff.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.mobile}</TableCell>
                    <TableCell>{staff.createdDate}</TableCell>
                    <TableCell>{staff.status}</TableCell>
                    <TableCell>{staff.duration}</TableCell>
                    <TableCell>
                      <Link href="/team-leader/leads/staff">
                        <Button variant="link" className="text-green-600 p-0 h-auto">
                           <span className="sm:hidden"><Eye className="h-4 w-4" /></span>
                           <span className="hidden sm:inline">View</span>
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                       <Link href="/team-leader/incentives">
                            <Button variant="link" className="p-0 h-auto">Incentives</Button>
                       </Link>
                    </TableCell>
                    <TableCell>
                       <Link href="/team-leader/earn">
                            <Button variant="link" className="text-green-600 p-0 h-auto">Earn</Button>
                       </Link>
                    </TableCell>
                    <TableCell>
                       <Link href="/team-leader/add-sell">
                            <Button variant="link" className="text-purple-600 p-0 h-auto">Add Sell</Button>
                       </Link>
                    </TableCell>
                    <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEditForm(staff)}>
                           <Pencil className="h-4 w-4" />
                           <span className="sr-only">Edit</span>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {filteredStaff.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center">
                      No staff found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
    <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0 rounded-2xl shadow-2xl flex flex-col">
            <DialogHeader>
                <DialogTitle>Add New Staff</DialogTitle>
                <DialogDescription>
                    Fill in the details below.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="flex-1 flex flex-col min-h-0">
                <div className="px-6 pt-4 flex gap-4">
                    <Select onValueChange={(value) => handleAddFormSelectChange("admin", value)} name="admin" defaultValue={formData.admin}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Admin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin1">Admin User 1</SelectItem>
                            <SelectItem value="admin2">Admin User 2</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => handleAddFormSelectChange("teamLeader", value)} name="teamLeader" defaultValue={formData.teamLeader}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Team-Leader" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="teamlead">teamlead</SelectItem>
                            <SelectItem value="teamlead2">teamlead2</SelectItem>
                        </SelectContent>
                    </Select>
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
                              <InputField id="name" label="Name" name="name" placeholder="John Doe" icon={User} value={formData.name} onChange={handleAddFormChange} required />
                              <InputField id="email" label="E-Mail Address" name="email" type="email" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleAddFormChange} required />
                              <InputField id="password" label="Password" name="password" type="password" placeholder="••••••••" icon={Lock} value={formData.password} onChange={handleAddFormChange} required />
                               <InputField id="teamLeader" label="Team Leader" name="teamLeader" value={formData.teamLeader} onChange={handleAddFormChange}>
                                <Select onValueChange={(value) => handleAddFormSelectChange("teamLeader", value)} name="teamLeader" defaultValue={formData.teamLeader}>
                                    <SelectTrigger className="pl-10 pr-4 h-11">
                                    <SelectValue placeholder="Select Team Leader" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="teamlead">teamlead</SelectItem>
                                    <SelectItem value="teamlead2">teamlead2</SelectItem>
                                    </SelectContent>
                                </Select>
                              </InputField>
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
                      <Button type="submit">Save Staff</Button>
                    )}
                </DialogFooter>
              </Tabs>
            </form>
        </DialogContent>
    </Dialog>

    {editingUser && (
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0 rounded-2xl shadow-2xl flex flex-col">
            <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
                <DialogTitle className="text-xl font-bold">Edit Staff</DialogTitle>
                <DialogDescription>
                    Update the details for {editingUser.name}.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="flex-1 flex flex-col min-h-0">
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
                              <InputField id="name" label="Name" name="name" placeholder="John Doe" icon={User} value={editingUser.name} onChange={handleEditFormChange} required />
                              <InputField id="email" label="E-Mail Address" name="email" type="email" placeholder="you@example.com" icon={Mail} value={editingUser.email} onChange={handleEditFormChange} required />
                              <InputField id="password" label="Password" name="password" type="password" placeholder="Leave unchanged" icon={Lock} value={editingUser.password} onChange={handleEditFormChange} />
                               <InputField id="teamLeader" label="Team Leader" name="teamLeader" value={editingUser.teamLeader} onChange={handleEditFormChange}>
                                <Select onValueChange={(value) => handleEditSelectChange("teamLeader", value)} name="teamLeader" defaultValue={editingUser.teamLeader}>
                                    <SelectTrigger className="pl-10 pr-4 h-11">
                                    <SelectValue placeholder="Select Team Leader" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="teamlead">teamlead</SelectItem>
                                    <SelectItem value="teamlead2">teamlead2</SelectItem>
                                    </SelectContent>
                                </Select>
                              </InputField>
                              <InputField id="dob" label="Date of Birth" name="dob" type="date" icon={Calendar} value={editingUser.dob} onChange={handleEditFormChange} />
                              <InputField id="pancard" label="Pan Card" name="pancard" placeholder="ABCDE1234F" icon={CreditCard} value={editingUser.pancard} onChange={handleEditFormChange} />
                              <InputField id="aadharCard" label="Aadhar Card" name="aadharCard" placeholder="1234 5678 9012" icon={Fingerprint} value={editingUser.aadharCard} onChange={handleEditFormChange} />
                              <InputField id="degree" label="Degree" name="degree" placeholder="B.Tech, M.Sc" icon={GraduationCap} value={editingUser.degree} onChange={handleEditFormChange} />
                              <InputField id="city" label="City" name="city" placeholder="e.g. Mumbai" icon={Building2} value={editingUser.city} onChange={handleEditFormChange} />
                              <InputField id="state" label="State" name="state" value={editingUser.state} onChange={handleEditFormChange}>
                                <Select onValueChange={(value) => handleEditSelectChange("state", value)} name="state" defaultValue={editingUser.state}>
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
                              <InputField id="mobile" label="Mobile" name="mobile" type="tel" placeholder="9876543210" icon={Phone} value={editingUser.mobile} onChange={handleEditFormChange} required />
                              <InputField id="salary" label="Salary" name="salary" placeholder="e.g. 50000" icon={Wallet} value={editingUser.salary} onChange={handleEditFormChange} />
                          </div>
                        )}
                        {activeTab === 'account' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                              <InputField id="account_number" label="Account Number" name="account_number" placeholder="Your account number" icon={Wallet} value={editingUser.account_number} onChange={handleEditFormChange} />
                              <InputField id="upi_id" label="Add UPI" name="upi_id" placeholder="yourname@upi" icon={Briefcase} value={editingUser.upi_id} onChange={handleEditFormChange} />
                              <InputField id="bank_name" label="Bank Name" name="bank_name" placeholder="e.g. State Bank of India" icon={Landmark} value={editingUser.bank_name} onChange={handleEditFormChange} />
                              <InputField id="ifsc_code" label="IFSC Code" name="ifsc_code" placeholder="SBIN0001234" icon={Hash} value={editingUser.ifsc_code} onChange={handleEditFormChange} />
                              <InputField id="pincode" label="Pincode" name="pincode" placeholder="e.g. 110001" icon={MapPin} value={editingUser.pincode} onChange={handleEditFormChange} />
                              <div className="md:col-span-2">
                                <InputField id="address" label="Address" name="address" value={editingUser.address} onChange={handleEditFormChange}>
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
                      <Button type="submit">Save Changes</Button>
                    )}
                </DialogFooter>
              </Tabs>
            </form>
        </DialogContent>
    </Dialog>
    )}
    </div>
  );
}



    
