import {
  LayoutGrid,
  // Settings,
  FileText,
  Building2,
  // Briefcase,
  // UserCog,
  // Wrench,
  Home,
  Phone,
  Package,
  Stethoscope,
  type LucideIcon,
  Image,
  CreditCard,
  Building
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
          href: "/admin/installment-rules",
          label: "Installment Rules",
          icon: CreditCard,
          submenus: []
        },
        {
          href: "/admin/share-manage",
          label: "Share Manage",
          icon: Building2,
          submenus: []
        },
        // {
        //   href: "/admin/hr",
        //   label: "HR",
        //   icon: Briefcase,
        //   submenus: []
        // },
        // {
        //   href: "/admin/staff",
        //   label: "Staff",
        //   icon: UserCog,
        //   submenus: []
        // },
        {
          href: "/admin/doctor",
          label: "Doctor",
          icon: Stethoscope,
          submenus: []
        },
        {
          href: "/admin/directors",
          label: "Directors",
          icon: Building2,
          submenus: []
        },
        {
          href: "/admin/equipment",
          label: "Equipment",
          icon: Package,
          submenus: []
        },
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
          href: "/admin/website/facilities",
          label: "Departments",
          icon: Building,
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
          href: "/admin/website/health-insight",
          label: "Health Insight",
          icon: Package,
          submenus: []
        },
        {
          href: "/admin/future-ventures",
          label: "Future Ventures",
          icon: Building,
          submenus: []
        },
        {
          href: "/admin/health-checkup",
          label: "Health Checkup",
          icon: FileText,
          submenus: []
        },
        // {
        //   href: "/admin/website/inventory-2",
        //   label: "Inventory",
        //   icon: Package,
        //   submenus: []
        // },
        // {
        //   href: "/admin/website/inventory-3",
        //   label: "Inventory",
        //   icon: Package,
        //   submenus: []
        // }
      ]
    }
  ];
}
