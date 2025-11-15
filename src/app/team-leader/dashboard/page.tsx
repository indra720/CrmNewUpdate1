
'use client';
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Search, Phone, MessageSquare, PlusCircle, User, Flag, Mail } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { STAFF_DASHBOARD_KPI_DATA } from "@/lib/constants";

interface Lead {
  id: number;
  name: string;
  call: string;
  status: string;
  message?: string;
}

interface Project {
  id: number;
  name: string;
  message: string;
  youtube_link: string;
}

const KpiCard = ({ title, value, icon: Icon, color, link }: { title: string, value: number, icon: React.ElementType, color: string, link?: string }) => {
    const cardContent = (
      <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
            <div className={`text-3xl ${color}`}>
                <Icon className="h-8 w-8" />
            </div>
            <div className="font-semibold text-foreground text-sm">{title}</div>
            <div className="text-muted-foreground text-lg font-bold">
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


export default function StaffDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);
  const [kpiCounts, setKpiCounts] = useState({
    pending_followups: 10,
    tomorrow_followups: 10,
    today_followups: 10,
    upload_leads: 10,
    remaining_leads: 2,
    total_lead: 15,
    total_visits: 2,
    interested: 2,
    not_interested: 2,
    other_location: 1,
    not_picked: 2,
  });
  
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    mobile: "",
    email: "",
    description: "",
  });

  const statuses = [
    "Leads",
    "Interested",
    "Not Interested",
    "Other Location",
    "Not Picked",
    "Lost",
    "Visit",
  ];

  const { toast } = useToast();

  useEffect(() => {
    setLeads([
      { id: 1, name: "Ravi Kumar", call: "9876543210", status: "Leads" },
      { id: 2, name: "Amit Sharma", call: "9123456789", status: "Interested" },
    ]);
    setProjects([
      { id: 1, name: "Project A", message: "Luxury Flats", youtube_link: "https://youtube.com" },
      { id: 2, name: "Project B", message: "Premium Villas", youtube_link: "https://youtube.com" },
    ]);
  }, []);

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = (id: number, status: string) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
  };
  
  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const handleModalSave = () => {
    if (selectedLead) {
        handleStatusChange(selectedLead.id, selectedLead.status);
    }
    setModalOpen(false);
    toast({ title: "Status Updated", description: "Lead status has been updated." });
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "mobile" && value.length > 10) return;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFormSelectChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    const newLead = { ...formData, id: Date.now(), call: formData.mobile };
    setLeads(prev => [...prev, newLead]);
    toast({
        title: "Lead Added!",
        description: `${formData.name} has been successfully added.`,
        className: 'bg-green-500 text-white'
    });
    // Reset form
    setFormData({
        name: "",
        status: "",
        mobile: "",
        email: "",
        description: "",
    });
    setAddLeadModalOpen(false);
  };


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {STAFF_DASHBOARD_KPI_DATA.map((card, index) => (
                <KpiCard 
                  key={index} 
                  title={card.title} 
                  value={kpiCounts[card.valueKey as keyof typeof kpiCounts]}
                  icon={card.icon} 
                  color={card.color} 
                  link={card.link} 
                />
            ))}
      </div>

      <Card>
        <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 justify-between items-end">
                <div className="flex flex-wrap gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                        type="date"
                        id="start_date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full sm:w-auto"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                        type="date"
                        id="end_date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full sm:w-auto"
                        />
                    </div>
                </div>
                <Button>Filter</Button>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
                <Button onClick={() => setAddLeadModalOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Lead
                </Button>
                <Button variant="outline">Auto Assign</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SN</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Call</TableHead>
                  <TableHead>Whatsapp</TableHead>
                  <TableHead>Change Status</TableHead>
                  <TableHead>Project</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                  <TableRow key={lead.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>
                      <a href={`tel:+91${lead.call}`} className="text-blue-600">
                        <Phone />
                      </a>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`https://wa.me/+91${lead.call}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600"
                      >
                        <MessageSquare />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => openEditModal(lead)}
                      >
                        {lead.status}
                      </Button>
                    </TableCell>
                    <TableCell>
                       <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {projects.map((p) => (
                                <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                       </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Lead Status</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="status">Status</Label>
                 <Select
                  value={selectedLead.status}
                  onValueChange={(value) =>
                    setSelectedLead({ ...selectedLead, status: value })
                  }
                 >
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Leads">Leads</SelectItem>
                        <SelectItem value="Interested">Interested</SelectItem>
                        <SelectItem value="Not Interested">Not Interested</SelectItem>
                        <SelectItem value="Not Picked">Not Picked</SelectItem>
                        <SelectItem value="Other Location">Other Location</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                        <SelectItem value="Visit">Visit</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter message..."
                  defaultValue={selectedLead.message}
                   onChange={(e) =>
                    setSelectedLead({ ...selectedLead, message: e.target.value })
                  }
                />
              </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleModalSave}>
                    Update
                    </Button>
                </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
       <Dialog open={addLeadModalOpen} onOpenChange={setAddLeadModalOpen}>
        <DialogContent className="sm:max-w-2xl">
           <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Create a New Lead</DialogTitle>
              <DialogDescription>Fill out the form below to add a new lead to the system.</DialogDescription>
            </DialogHeader>
             <form
                onSubmit={handleFormSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium"><User className="w-4 h-4" /> Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    maxLength={30}
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="status" className="flex items-center gap-2 text-sm font-medium"><Flag className="w-4 h-4" /> Status</Label>
                    <Select
                        value={formData.status}
                        onValueChange={handleFormSelectChange}
                        required
                    >
                        <SelectTrigger id="status" className="h-11">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                             {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="flex items-center gap-2 text-sm font-medium"><Phone className="w-4 h-4" /> Mobile</Label>
                  <Input
                    type="number"
                    id="mobile"
                    name="mobile"
                    placeholder="e.g. 9876543210"
                    required
                    value={formData.mobile}
                    onChange={handleFormChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium"><Mail className="w-4 h-4" /> Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="e.g. john.doe@example.com"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="h-11"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium"><MessageSquare className="w-4 h-4" /> Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Add any relevant notes or details here..."
                    rows={4}
                    value={formData.description}
                    onChange={handleFormChange}
                    className="resize-none"
                  />
                </div>
                <DialogFooter className="md:col-span-2">
                    <Button variant="outline" onClick={() => setAddLeadModalOpen(false)}>Cancel</Button>
                    <Button type="submit">Add Lead</Button>
                </DialogFooter>
              </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
