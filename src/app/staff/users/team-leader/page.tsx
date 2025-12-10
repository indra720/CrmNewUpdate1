
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

