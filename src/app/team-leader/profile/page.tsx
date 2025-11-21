'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MapPin, Mail, Phone, Briefcase, Calendar, FileText, CreditCard, User, Camera, GraduationCap, Tag, Landmark, Hash, Users, Home, Link as LinkIcon, Wallet, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";

interface ProfileData {
  id: number;
  user: {
    id: number;
    email: string;
    name: string;
    mobile: string;
    profile_image: string | null;
    is_admin: boolean;
    is_team_leader: boolean;
    is_staff_new: boolean;
    created_date: string;
    user_active: boolean;
  };
  team_leader_id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  dob: string;
  pancard: string;
  aadharCard: string;
  marksheet: string;
  degree: string;
  account_number: string;
  upi_id: string;
  bank_name: string;
  ifsc_code: string;
  salary: string;
  achived_slab: string;
  referral_code: string;
  join_referral: string | null;
  created_date: string;
  updated_date: string;
}

const InputField = ({
  id,
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  required,
  readOnly,
  children,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: React.ElementType;
  value: string | number;
  onChange: (e: any) => void;
  required?: boolean;
  readOnly?: boolean;
  children?: React.ReactElement;
}) => {
  const inputElement = children ? (
    React.cloneElement(children as React.ReactElement, {
      id,
      name,
      value,
      onChange,
      required,
      placeholder,
      readOnly,
    })
  ) : (
    <Input
      type={type}
      id={id}
      name={name}
      value={type === "file" ? undefined : (value as string)}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      readOnly={readOnly}
      className={cn(
        "pl-4 pr-10 h-11 transition-all duration-300",
        readOnly && "bg-muted cursor-not-allowed"
      )}
    />
  );

  return (
    <div className="relative flex flex-col space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 rounded-lg border-2 border-transparent transition-all",
            "focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/.1)]",
            readOnly && "cursor-not-allowed"
          )}
        ></div>
        <div className="relative">
          {inputElement}
          {Icon && type !== "file" && !readOnly && (
            <Icon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewDetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{value || "N/A"}</p>
  </div>
);

export default function ProfilePage() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'avatar-1');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editableData, setEditableData] = useState<{
    team_leader_id: string;
    name: string;
    email: string;
    mobile: string;
    dob: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    pancard: string;
    aadharCard: string;
    degree: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
    profileImage: File | null;
    panCard: File | null;
    aadharCardFile: File | null;
  }>({
    team_leader_id: "",
    name: "",
    email: "",
    mobile: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    pancard: "",
    aadharCard: "",
    degree: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    profileImage: null,
    panCard: null,
    aadharCardFile: null,
  });

  useEffect(() => {
    if (profile) {
      setEditableData({
        team_leader_id: profile.team_leader_id,
        name: profile.name,
        email: profile.email,
        mobile: profile.mobile,
        dob: profile.dob,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        pancard: profile.pancard,
        aadharCard: profile.aadharCard,
        degree: profile.degree,
        bankName: profile.bank_name,
        accountNumber: profile.account_number,
        ifscCode: profile.ifsc_code,
        upiId: profile.upi_id,
        profileImage: null,
        panCard: null,
        aadharCardFile: null,
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Mocking the API response as per the user's provided JSON to bypass the 403 error
        const data: ProfileData = {
          "id": 2,
          "user": {
              "id": 5,
              "email": "indra720@gmail.com",
              "name": "Indrajeet ",
              "mobile": "6789567890",
              "profile_image": null,
              "is_admin": false,
              "is_team_leader": true,
              "is_staff_new": false,
              "created_date": "2025-11-18T13:00:05.394903Z",
              "user_active": true
          },
          "team_leader_id": "0c03d164-9ca3-44ba-a3c7-d1cb550d85a1",
          "name": "Indrajeet ",
          "email": "indra720@gmail.com",
          "mobile": "6789567890",
          "address": "JAIPUR",
          "city": "jaipur",
          "pincode": "302019",
          "state": "Rajasthan",
          "dob": "1998-05-15",
          "pancard": "ABCDE1234F",
          "aadharCard": "123456789012",
          "marksheet": "",
          "degree": "B.Tech",
          "account_number": "1234567890123456",
          "upi_id": "indrajeet@upi",
          "bank_name": "State Bank of India",
          "ifsc_code": "SBIN0001234",
          "salary": "50000",
          "achived_slab": "5",
          "referral_code": "INJ720",
          "join_referral": null,
          "created_date": "2025-11-18T13:00:06.300085Z",
          "updated_date": "2025-11-18T13:00:06.300085Z"
        };
        setProfile(data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        toast({
          title: "Error",
          description: "Failed to load profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const profileImageUrl = useMemo(() => {
    if (editableData.profileImage) {
      return URL.createObjectURL(editableData.profileImage);
    }
    return profile?.user.profile_image || userAvatar?.imageUrl || "https://placehold.co/150x150/e2e8f0/a0aec0?text=Image";
  }, [editableData.profileImage, profile?.user.profile_image, userAvatar?.imageUrl]);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;
    if (target.type === "file") {
      setEditableData({
        ...editableData,
        [name]: target.files ? target.files[0] : null,
      });
    } else {
      setEditableData({
        ...editableData,
        [name]: value,
      });
    }
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditableData({
      ...editableData,
      [name]: value,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate a successful API call
    console.log("Simulating profile update with data:", editableData);

    setTimeout(() => {
      // Create a new profile object by merging the existing profile with the edited data
      if (profile) {
        const updatedProfile: ProfileData = {
          ...profile,
          name: editableData.name,
          email: editableData.email,
          mobile: editableData.mobile,
          dob: editableData.dob,
          address: editableData.address,
          city: editableData.city,
          state: editableData.state,
          pincode: editableData.pincode,
          pancard: editableData.pancard,
          aadharCard: editableData.aadharCard,
          degree: editableData.degree,
          bank_name: editableData.bankName,
          account_number: editableData.accountNumber,
          ifsc_code: editableData.ifscCode,
          upi_id: editableData.upiId,
          user: {
            ...profile.user,
            name: editableData.name,
            email: editableData.email,
            mobile: editableData.mobile,
            profile_image: editableData.profileImage ? URL.createObjectURL(editableData.profileImage) : profile.user.profile_image,
          }
        };
        setProfile(updatedProfile);
      }
      
      setIsSubmitting(false);
      setIsEditDialogOpen(false);
      toast({
        title: "Profile Updated!",
        description: "Your profile has been updated successfully (Simulated).",
        className: 'bg-green-500 text-white'
      });

    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading Profile...</div>
      </div>
    );
  }

  const fullName = profile?.name || 'Staff Member';
  const email = profile?.email || 'N/A';
  const mobile = profile?.mobile || '(123) 456-7890';
  const address = profile?.address || '';
  const city = profile?.city || '';
  const pincode = profile?.pincode || '';
  const state = profile?.state || '';
  const fullAddress = `${address}, ${city}, ${state} ${pincode}`.trim();
  const location = `${city}, ${state}` || 'San Francisco, CA';
  const profileImage = profile?.user.profile_image || userAvatar?.imageUrl;
  const dob = profile?.dob ? new Date(profile.dob).toLocaleDateString('en-IN') : 'N/A';
  const staffId = profile?.team_leader_id || 'N/A';
  const pancard = profile?.pancard || 'N/A';
  const aadharCard = profile?.aadharCard || 'N/A';
  const accountNumber = profile?.account_number || 'N/A';
  const upiId = profile?.upi_id || 'N/A';
  const bankName = profile?.bank_name || 'N/A';
  const ifscCode = profile?.ifsc_code || 'N/A';
  const salary = profile?.salary ? `₹${parseInt(profile.salary).toLocaleString()}` : 'N/A';
  const referralCode = profile?.referral_code || 'N/A';
  const achievedSlab = profile?.achived_slab || '0';
  

  return (
    <div className="flex flex-col gap-8">
      <Card className="shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-muted/30 p-8 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarImage src={profileImage} data-ai-hint={userAvatar?.imageHint} />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <p className="text-muted-foreground">{email}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground justify-center md:justify-start">
              <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> Staff ID: {staffId}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {location}</span>
            </div>
          </div>
          <div className="md:ml-auto">
            <Button onClick={() => setIsEditDialogOpen(true)}>Update Profile</Button>
          </div>
        </div>

        <CardContent className="p-8">
          <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="space-y-1 border rounded-md p-3">
              <Label className="text-sm">Full Name</Label>
              <p className="font-medium">{fullName}</p>
            </div>
            <div className="space-y-1 border rounded-md p-3">
              <Label className="text-sm">Email Address</Label>
              <p className="font-medium">{email}</p>
            </div>
            <div className="space-y-1 border rounded-md p-3">
              <Label className="text-sm">Phone Number</Label>
              <p className="font-medium">{mobile}</p>
            </div>
            <div className="space-y-1 border rounded-md p-3">
              <Label className="text-sm">Date of Birth</Label>
              <p className="font-medium">{dob}</p>
            </div>
            <div className="space-y-1 md:col-span-2 border rounded-md p-3">
              <Label className="text-sm">Address</Label>
              <p className="font-medium">{fullAddress || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>



      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] p-0 bg-card rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader className="p-6 md:p-8 pb-0 flex-shrink-0">
            <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground">
              Update Profile
            </DialogTitle>
            <DialogDescription className="hidden md:block text-muted-foreground text-base">
              Fill out the form below to update your account.
            </DialogDescription>
          </DialogHeader>
          <form className="flex-1 flex flex-col min-h-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="px-6 md:px-8 mt-4">
                <TabsList className="relative grid grid-cols-1 md:grid-cols-3 w-full bg-muted/80 rounded-lg p-1">
                  <TabsTrigger value="personal">
                    Personal Information
                  </TabsTrigger>
                  <TabsTrigger value="account">
                    Account Details
                  </TabsTrigger>
                  <TabsTrigger value="review">
                    Review &amp; Submit
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-grow mt-4 px-6 md:px-8 overflow-y-auto hide-scrollbar">
                <TabsContent value="personal">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <InputField
                      id="edit-staff-id"
                      label="Staff ID"
                      name="team_leader_id"
                      placeholder="Staff ID"
                      value={editableData.team_leader_id}
                      onChange={() => {}}
                      readOnly
                      required
                    />
                    <InputField
                      id="edit-name"
                      label="Name"
                      name="name"
                      placeholder="John Doe"
                      icon={User}
                      value={editableData.name}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-email"
                      label="E-Mail Address"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      icon={Mail}
                      value={editableData.email}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-mobile"
                      label="Mobile Number"
                      name="mobile"
                      type="tel"
                      placeholder="9876543210"
                      icon={Phone}
                      value={editableData.mobile}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-dob"
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      icon={Calendar}
                      value={editableData.dob}
                      onChange={handleEditChange}
                    />
                    <div className="md:col-span-2">
                      <InputField
                        id="edit-address"
                        label="Address"
                        name="address"
                        value={editableData.address}
                        onChange={handleEditChange}
                        required
                      >
                        <Textarea className="pl-4 pr-4 min-h-[80px]" />
                      </InputField>
                    </div>
                    <InputField
                      id="edit-city"
                      label="City"
                      name="city"
                      placeholder="Mumbai"
                      icon={Home}
                      value={editableData.city}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-state"
                      label="State"
                      name="state"
                      icon={MapPin}
                      value={editableData.state}
                      onChange={handleEditChange}
                      required
                    >
                      <Select
                        onValueChange={(value) =>
                          handleEditSelectChange("state", value)
                        }
                        name="state"
                        required
                      >
                        <SelectTrigger className="pl-4 pr-10 h-11">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="Gujarat">Gujarat</SelectItem>
                        </SelectContent>
                      </Select>
                    </InputField>
                    <InputField
                      id="edit-pincode"
                      label="Pincode"
                      name="pincode"
                      placeholder="400001"
                      icon={Hash}
                      value={editableData.pincode}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-profile-image"
                      label="Profile Image"
                      name="profileImage"
                      type="file"
                      icon={Camera}
                      onChange={handleEditChange}
                      value=""
                    />

                    <InputField
                      id="edit-pancard"
                      label="PAN Card Number"
                      name="pancard"
                      placeholder="ABCDE1234F"
                      value={editableData.pancard}
                      onChange={handleEditChange}
                    />

                    <InputField
                      id="edit-aadhar"
                      label="Aadhar Card Number"
                      name="aadharCard"
                      placeholder="1234 5678 9012"
                      value={editableData.aadharCard}
                      onChange={handleEditChange}
                    />
                    <InputField
                      id="edit-degree"
                      label="Degree"
                      name="degree"
                      placeholder="B.Tech in CS"
                      icon={GraduationCap}
                      value={editableData.degree}
                      onChange={handleEditChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="account">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <InputField
                      id="edit-bank-name"
                      label="Bank Name"
                      name="bankName"
                      placeholder="State Bank of India"
                      icon={Landmark}
                      value={editableData.bankName}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-account-number"
                      label="Account Number"
                      name="accountNumber"
                      placeholder="Your Bank Account Number"
                      icon={Wallet}
                      value={editableData.accountNumber}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-ifsc"
                      label="IFSC Code"
                      name="ifscCode"
                      placeholder="SBIN000000"
                      icon={Hash}
                      value={editableData.ifscCode}
                      onChange={handleEditChange}
                      required
                    />
                    <InputField
                      id="edit-upi"
                      label="UPI ID (Optional)"
                      name="upiId"
                      placeholder="yourname@upi"
                      icon={LinkIcon}
                      value={editableData.upiId}
                      onChange={handleEditChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="review">
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                      <Image
                        src={profileImageUrl}
                        alt="Profile Preview"
                        width={120}
                        height={120}
                        className="rounded-full object-cover border-4 border-muted"
                        unoptimized
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 flex-1 text-center md:text-left">
                        <ReviewDetailItem
                          label="Full Name"
                          value={editableData.name}
                        />
                        <ReviewDetailItem
                          label="Email Address"
                          value={editableData.email}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <ReviewDetailItem
                          label="Staff ID"
                          value={editableData.team_leader_id}
                        />
                        <ReviewDetailItem
                          label="Mobile"
                          value={editableData.mobile}
                        />
                        <ReviewDetailItem
                          label="Date of Birth"
                          value={editableData.dob}
                        />
                        <ReviewDetailItem
                          label="Address"
                          value={editableData.address}
                        />
                        <ReviewDetailItem
                          label="City"
                          value={editableData.city}
                        />
                        <ReviewDetailItem
                          label="State"
                          value={editableData.state}
                        />
                        <ReviewDetailItem
                          label="Pincode"
                          value={editableData.pincode}
                        />
                        <ReviewDetailItem
                          label="Degree"
                          value={editableData.degree}
                        />
                        <ReviewDetailItem
                          label="PAN Card"
                          value={editableData.pancard}
                        />
                        <ReviewDetailItem
                          label="Aadhar Card"
                          value={editableData.aadharCard}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                        Account Details
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <ReviewDetailItem
                          label="Bank Name"
                          value={editableData.bankName}
                        />
                        <ReviewDetailItem
                          label="Account No."
                          value={editableData.accountNumber}
                        />
                        <ReviewDetailItem
                          label="IFSC Code"
                          value={editableData.ifscCode}
                        />
                        <ReviewDetailItem
                          label="UPI ID"
                          value={editableData.upiId}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            <DialogFooter className="mt-auto p-6 pt-4 border-t bg-muted/50 flex-shrink-0">
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    activeTab === "account"
                      ? setActiveTab("personal")
                      : activeTab === "review"
                        ? setActiveTab("account")
                        : setIsEditDialogOpen(false)
                  }
                  className={cn(activeTab === "personal" && "invisible")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                {activeTab !== "review" ? (
                  <Button
                    type="button"
                    onClick={() =>
                      activeTab === "personal"
                        ? setActiveTab("account")
                        : setActiveTab("review")
                    }
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleEditSubmit} className="w-48 h-11 text-base" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Update Profile
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}







// {
//     "id": 2,
//     "user": {
//         "id": 5,
//         "email": "indra720@gmail.com",
//         "name": "Indrajeet ",
//         "mobile": "6789567890",
//         "profile_image": null,
//         "is_admin": false,
//         "is_team_leader": true,
//         "is_staff_new": false,
//         "created_date": "2025-11-18T13:00:05.394903Z",
//         "user_active": true
//     },
//     "team_leader_id": "0c03d164-9ca3-44ba-a3c7-d1cb550d85a1",
//     "name": "Indrajeet ",
//     "email": "indra720@gmail.com",
//     "mobile": "6789567890",
//     "address": "JAIPUR",
//     "city": "jaipur",
//     "pincode": "302019",
//     "state": "Rajasthan",
//     "dob": null,
//     "created_date": "2025-11-18T13:00:06.300085Z",
//     "updated_date": "2025-11-18T13:00:06.300085Z"
// }






// class TeamLeaderProfileViewAPIView(APIView):
//     """
//     API endpoint for 'team_view_profile' (Team Leader Dashboard).
//     GET: Fetches logged-in Team Leader's profile.
//     PATCH: Updates logged-in Team Leader's profile.
//     ONLY TEAM LEADER can access this.
//     """
//     permission_classes = [IsAuthenticated, IsCustomTeamLeaderUser]
//     parser_classes = [MultiPartParser, FormParser]

//     def get_tl_object(self, request):
//         try:
//             return Team_Leader.objects.get(user=request.user)
//         except Team_Leader.DoesNotExist:
//             return None

//     def get(self, request, format=None):
//         tl_instance = self.get_tl_object(request)
//         if not tl_instance:
//             return Response({"error": "Team Leader profile not found."}, status=status.HTTP_404_NOT_FOUND)
        
//         serializer = TeamLeaderProfileSerializer(tl_instance)
//         return Response(serializer.data, status=status.HTTP_200_OK)

//     def patch(self, request, format=None):
//         tl_instance = self.get_tl_object(request)
//         if not tl_instance:
//             return Response({"error": "Team Leader profile not found."}, status=status.HTTP_404_NOT_FOUND)

//         # Use existing update serializer which handles User + TL model update
//         serializer = TeamLeaderUpdateSerializer(instance=tl_instance, data=request.data, partial=True)
        
//         if serializer.is_valid():
//             updated_instance = serializer.save()
//             return Response({
//                 "message": "Profile updated successfully",
//                 "data": TeamLeaderProfileSerializer(updated_instance).data
//             }, status=status.HTTP_200_OK)
        
//         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
//     def post(self, request, format=None):
//         return self.patch(request, format)
    






























