// src/components/layout/Navigation.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navigation() {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const navigationItems = [
    { name: "Home", href: "/", requiresAuth: false },
    { name: "Polls", href: "/polls", requiresAuth: false },
    { name: "Opinions", href: "/opinions", requiresAuth: false },
    { name: "Forums", href: "/forums", requiresAuth: false },
    { name: "Groups", href: "/groups", requiresAuth: false },
    { name: "Trending", href: "/trending", requiresAuth: false },
    { name: "Dashboard", href: "/dashboard", requiresAuth: true },
  ];

  const filteredItems = navigationItems.filter(
    (item) => !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  return (
    <nav className="flex-1">
      <ul className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
        {filteredItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
