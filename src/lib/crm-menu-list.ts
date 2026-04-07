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
          href: "/crm/dashboard",
          label: "Dashboard",
          active: pathname.includes("/crm/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Management",
      menus: [
        {
          href: "/crm/investor",
          label: "Investors",
          active: pathname.includes("/crm/investor"),
          icon: Users,
          submenus: []
        },
        {
          href: "/crm/installment-rules",
          label: "Installment Rules",
          active: pathname.includes("/crm/installment-rules"),
          icon: HandCoins,
          submenus: []
        },
        {
          href: "/crm/share-manage",
          label: "Share Manage",
          active: pathname.includes("/crm/share-manage"),
          icon: Share2,
          submenus: []
        }
      ]
    }
  ];
}
