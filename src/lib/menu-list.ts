import {
  LayoutGrid,
  // Settings,
  FileText,
  Building2,
  Briefcase,
  // UserCog,
  // Wrench,
  Home,
  Phone,
  Package,
  Stethoscope,
  type LucideIcon,
  Image,
  CreditCard,
  Building,
  Type,
  DollarSign,
  Heart
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
        }
      ]
    },
    {
      groupLabel: "General Administration",
      menus: [
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
        {
          href: "/admin/room-rents",
          label: "Room Rents",
          icon: Building,
          submenus: []
        },
      ]
    },
    {
      groupLabel: "Page Management",
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
          href: "/admin/website/our-values",
          label: "Our Values",
          icon: Heart,
          submenus: []
        },
        {
          href: "/admin/website/contact",
          label: "Contact Enquiry",
          icon: Phone,
          submenus: []
        },
        {
          href: "/admin/future-ventures",
          label: "Future Ventures",
          icon: Building,
          submenus: []
        },
      ]
    },
    {
      groupLabel: "Career & Human Resources",
      menus: [
        {
          href: "/admin/website/careers",
          label: "Careers Page",
          icon: Briefcase,
          submenus: []
        },
        {
          href: "/admin/job-posts",
          label: "Job Postings",
          icon: FileText,
          submenus: []
        },
      ]
    },
    {
      groupLabel: "Clinical & Services",
      menus: [
        {
          href: "/admin/website/facilities",
          label: "Departments",
          icon: Building,
          submenus: []
        },
        {
          href: "/admin/health-checkup",
          label: "Health Checkup",
          icon: FileText,
          submenus: []
        },
        {
          href: "/admin/health-checkup-packages",
          label: "Health Packages",
          icon: Package,
          submenus: []
        },
        {
          href: "/admin/package-pages",
          label: "Package Pages",
          icon: FileText,
          submenus: []
        },
      ]
    },
    {
      groupLabel: "Media & Health Insights",
      menus: [
        {
          href: "/admin/website/news",
          label: "Latest News",
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
          href: "/admin/website/health-insight",
          label: "Health insight",
          icon: Package,
          submenus: []
        },
      ]
    },
    {
      groupLabel: "Pricing & Settings",
      menus: [
        {
          href: "/admin/homepage-pricings",
          label: "Homepage Pricings",
          icon: DollarSign,
          submenus: []
        },
        {
          href: "/admin/headings",
          label: "Headings & Contact",
          icon: Type,
          submenus: []
        },
      ]
    }
  ];
}


