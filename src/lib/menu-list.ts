import {
  LayoutGrid,
  Settings,
  FileText,
  Building2,
  Briefcase,
  UserCog,
  Wrench,
  Home,
  Phone,
  Package,
  Stethoscope,
  type LucideIcon,
  Image
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(_pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        },
        {
          href: "/admin/investor",
          label: "Investors",
          icon: Building2,
          submenus: []
        },
        {
          href: "/admin/hr",
          label: "HR",
          icon: Briefcase,
          submenus: []
        },
        {
          href: "/admin/staff",
          label: "Staff",
          icon: UserCog,
          submenus: []
        },
        {
          href: "/admin/doctor",
          label: "Doctor",
          icon: Stethoscope,
          submenus: []
        },
        {
          href: "/admin/equipment",
          label: "Equipment",
          icon: Wrench,
          submenus: []
        },
        {
          href: "/admin/settings",
          label: "Settings",
          icon: Settings,
          submenus: []
        },
        {
          href: "/terms-conditions",
          label: "Terms & Conditions",
          icon: FileText,
          submenus: []
        },
        {
          href: "/privacy-policy",
          label: "Privacy Policy",
          icon: FileText,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Website Manage",
      menus: [
        {
          href: "/admin/website/home",
          label: "Home Page",
          icon: Home,
          submenus: []
        },
        {
          href: "/admin/website/about",
          label: "About Us",
          icon: Phone,
          submenus: []
        },
        {
          href: "/admin/website/news",
          label: "News",
          icon: FileText,
          submenus: []
        },
        {
          href: "/admin/website/gellery",
          label: "Gallery",
          icon: Image,
          submenus: []
        },
        {
          href: "/admin/website/contact",
          label: "Contact",
          icon: Phone,
          submenus: []
        },
        {
          href: "/admin/website/blogs",
          label: "Blogs",
          icon: Package,
          submenus: []
        },
        {
          href: "/admin/website/inventory-2",
          label: "Inventory",
          icon: Package,
          submenus: []
        },
        {
          href: "/admin/website/inventory-3",
          label: "Inventory",
          icon: Package,
          submenus: []
        }
      ]
    }
  ];
}
