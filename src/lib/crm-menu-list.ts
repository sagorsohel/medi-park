import {
  Users,
  LayoutGrid,
  HandCoins,
  Share2,
  Receipt,
  Truck,
  ShoppingCart,
  UserCheck,
  Search,
  type LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getCRMMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/accounting/software/dashboard",
          label: "Dashboard",
          active: pathname.includes("/accounting/software/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Management",
      menus: [
        {
          href: "/accounting/software/investor",
          label: "Investors",
          active: pathname.includes("/accounting/software/investor"),
          icon: Users,
          submenus: []
        },
        {
          href: "/accounting/software/installment-rules",
          label: "Installment Rules",
          active: pathname.includes("/accounting/software/installment-rules"),
          icon: HandCoins,
          submenus: []
        },
        {
          href: "/accounting/software/share-manage",
          label: "Share Manage",
          active: pathname.includes("/accounting/software/share-manage"),
          icon: Share2,
          submenus: []
        },
        {
          href: "/accounting/software/expenses",
          label: "Expenses",
          active: pathname.includes("/accounting/software/expenses"),
          icon: Receipt,
          submenus: []
        },
        {
          href: "/accounting/software/vendors",
          label: "Vendors",
          active: pathname.includes("/accounting/software/vendors"),
          icon: Truck,
          submenus: []
        },
        {
          href: "/accounting/software/equipment-pages",
          label: "Equipment Purchases",
          active: pathname.includes("/accounting/software/equipment-pages"),
          icon: ShoppingCart,
          submenus: []
        },
        {
          href: "/accounting/software/employees",
          label: "Employees",
          active: pathname.includes("/accounting/software/employees"),
          icon: UserCheck,
          submenus: []
        },
        {
          href: "/accounting/software/investor-inquiry",
          label: "Investor Inquiry",
          active: pathname.includes("/accounting/software/investor-inquiry"),
          icon: Search,
          submenus: []
        }
      ]
    }
  ];
}
