'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MapPin, Mail, Phone, Briefcase } from "lucide-react";
import { useState, useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }).optional().or(z.literal('')),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'avatar-1');
  const [userEmail, setUserEmail] = useState('loading...');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      if (email) {
        setUserEmail(email);
      }
    }
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "Super Admin",
      email: userEmail,
      phoneNumber: "(123) 456-7890",
      address: "123 Market St, San Francisco, CA 94103",
    },
    mode: "onChange",
  });

  // Update default values when userEmail changes
  useEffect(() => {
    form.reset({
      ...form.getValues(),
      email: userEmail,
    });
  }, [userEmail, form]);


  function onSubmit(values: ProfileFormValues) {
    console.log("Profile update form submitted:", values);
    // API integration will go here later
    setIsDialogOpen(false); // Close dialog on submit
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-muted/30 p-8 flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                <AvatarImage src={userAvatar?.imageUrl} data-ai-hint={userAvatar?.imageHint} />
                <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">Super Admin</h2>
                <p className="text-muted-foreground">{userEmail}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground justify-center md:justify-start">
                    <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> Super Administrator</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> San Francisco, CA</span>
                </div>
            </div>
            <div className="md:ml-auto">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Update Profile</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your phone number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1 border rounded-md p-3">
                    <Label className="text-sm">Full Name</Label>
                    <p className="font-medium">Super Admin</p>
                </div>
                 <div className="space-y-1 border rounded-md p-3">
                    <Label className="text-sm">Role</Label>
                    <p className="font-medium">Super Administrator</p>
                </div>
                <div className="space-y-1 border rounded-md p-3">
                    <Label className="text-sm">Email Address</Label>
                    <p className="font-medium">{userEmail}</p>
                </div>
                <div className="space-y-1 border rounded-md p-3">
                    <Label className="text-sm">Phone Number</Label>
                    <p className="font-medium">(123) 456-7890</p>
                </div>
                <div className="space-y-1 md:col-span-2 border rounded-md p-3">
                    <Label className="text-sm">Address</Label>
                    <p className="font-medium">123 Market St, San Francisco, CA 94103</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
