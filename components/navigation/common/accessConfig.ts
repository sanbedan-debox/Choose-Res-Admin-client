import { PermissionTypeEnum } from "@/generated/graphql";

export const modules = [
  {
    name: "Dashboard",
    access: PermissionTypeEnum.Dashboard,
    route: "/dashboard",
    icon: "dashboard",
  },
  {
    name: "Menu Management",
    access: PermissionTypeEnum.Menu,
    route: "/menu",
    icon: "menu",
  },
  {
    name: "Aggregator Integrations",
    access: PermissionTypeEnum.Integrations,
    route: "/aggregator",
    icon: "aggregator",
  },
  {
    name: "CMS",
    access: PermissionTypeEnum.Cms,
    route: "/cms",
    icon: "cms",
  },
  {
    name: "Marketing",
    access: PermissionTypeEnum.Marketing,
    route: "/marketing",
    icon: "marketing",
  },
  {
    name: "Reports",
    access: PermissionTypeEnum.Reports,
    route: "/reports",
    icon: "reports",
  },
  {
    name: "Customers",
    access: PermissionTypeEnum.Customers,
    route: "/customers",
    icon: "customers",
  },
  {
    name: "Rewards & Loyalty",
    access: PermissionTypeEnum.Rewards,
    route: "/rewards",
    icon: "rewards",
  },
  {
    name: "Team Management",
    access: PermissionTypeEnum.UserManagement,
    route: "/teams",
    icon: "user",
  },
  {
    name: "Inventory",
    access: PermissionTypeEnum.Menu,
    route: "/inventory",
    icon: "inventory",
  },
  {
    name: "Operations (Shifts)",
    access: PermissionTypeEnum.Menu,
    route: "/operations",
    icon: "operations",
  },
  {
    name: "Market Insights",
    access: PermissionTypeEnum.Marketing,
    route: "/marketinginsights",
    icon: "marketinginsights",
  },
  {
    name: "Tips Management",
    access: PermissionTypeEnum.Menu,
    route: "/tips",
    icon: "tips",
  },
  {
    name: "Staff Leaderboards",
    access: PermissionTypeEnum.UserManagement,
    route: "/staff",
    icon: "staff",
  },
  {
    name: "Payment Integrations",
    access: PermissionTypeEnum.PaymentManagement,
    route: "/payment",
    icon: "payment",
  },
  {
    name: "Table Reservations",
    access: PermissionTypeEnum.Menu,
    route: "/table",
    icon: "table",
  },
  {
    name: "Banquet Reservations",
    access: PermissionTypeEnum.Menu,
    route: "/banquet",
    icon: "banquet",
  },
  {
    name: "Catering",
    access: PermissionTypeEnum.Menu,
    route: "/catering",
    icon: "catering",
  },
];
