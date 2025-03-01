import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  Users,
  PieChart,
  Shield,
  Settings,
  AlertTriangle,
} from "lucide-react";

const AdminNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <PieChart className="w-5 h-5" />,
    },
    {
      title: "Polls Management",
      href: "/polls-management",
      icon: <BarChart2 className="w-5 h-5" />,
    },
    {
      title: "Users Management",
      href: "/users-management",
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "Moderation",
      href: "/moderation",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart2 className="w-5 h-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        <Shield className="h-6 w-6 text-primary" />
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={`/admin${item.href}`}
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                pathname === `/admin${item.href}`
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
