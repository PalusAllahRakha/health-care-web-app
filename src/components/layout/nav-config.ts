import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Calendar,
  FlaskConical,
  LayoutDashboard,
  MessageSquare,
  Pill,
  Shield,
  Stethoscope,
  Users,
  Bell,
  UserCircle,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

const patientNav: NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Care",
    items: [
      { label: "Appointments", href: "/appointments", icon: Calendar },
      { label: "Doctors", href: "/doctors", icon: Stethoscope },
      { label: "Prescriptions", href: "/prescriptions", icon: Pill },
    ],
  },
  {
    title: "Records",
    items: [
      { label: "Lab Results", href: "/lab-results", icon: FlaskConical },
      { label: "Insurance", href: "/insurance", icon: Shield },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Messages", href: "/messages", icon: MessageSquare },
      { label: "Notifications", href: "/notifications", icon: Bell, badge: 3 },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Profile", href: "/profile", icon: UserCircle }],
  },
];

const providerNav: NavGroup[] = [
  {
    title: "Work",
    items: [
      { label: "Patient Queue", href: "/provider/patients", icon: Users },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Profile", href: "/provider/profile", icon: UserCircle }],
  },
];

const adminNav: NavGroup[] = [
  {
    title: "Admin",
    items: [
      { label: "Overview", href: "/admin/overview", icon: BarChart3 },
      { label: "Users", href: "/admin/users", icon: Users },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Profile", href: "/admin/profile", icon: UserCircle }],
  },
];

export const navByRole: Record<UserRole, NavGroup[]> = {
  patient: patientNav,
  provider: providerNav,
  admin: adminNav,
};

export interface MobileNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const mobileNavItems: MobileNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/appointments", icon: Calendar },
  { label: "Results", href: "/lab-results", icon: FlaskConical },
  { label: "Meds", href: "/prescriptions", icon: Pill },
  { label: "Messages", href: "/messages", icon: MessageSquare },
];

export function getNavForRole(role: UserRole): NavGroup[] {
  return navByRole[role];
}
