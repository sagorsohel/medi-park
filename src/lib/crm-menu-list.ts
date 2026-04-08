import {
  Users,
  LayoutGrid,
  HandCoins,
  Share2,
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
        }
      ]
    }
  ];
}
