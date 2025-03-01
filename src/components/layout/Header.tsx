// src/components/layout/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Navigation from "./Navigation";
import SearchBar from "./SearchBar";
import NotificationBell from "@/components/shared/NotificationBell";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm dark:bg-gray-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="mr-4 flex items-center">
            <Image
              src="/logo.svg"
              alt="PollingSocial Logo"
              width={40}
              height={40}
            />
            <span className="ml-2 text-xl font-bold">PollingSocial</span>
          </Link>
          {!isMobile && <Navigation />}
        </div>

        <div className="flex items-center gap-4">
          {!isMobile && <SearchBar />}

          {isAuthenticated ? (
            <>
              <NotificationBell />
              <Dropdown
                trigger={
                  <Avatar
                    src={session.user?.image || ""}
                    alt={session.user?.name || "User"}
                    fallback={session.user?.name?.[0] || "U"}
                  />
                }
                items={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Profile", href: "/profile" },
                  { label: "Settings", href: "/settings" },
                  { label: "Logout", href: "/api/auth/signout" },
                ]}
              />
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </Button>
          )}
        </div>
      </div>

      {isMobile && isMenuOpen && (
        <div className="container mx-auto px-4 pb-4">
          <Navigation />
          <div className="mt-4">
            <SearchBar />
          </div>
        </div>
      )}
    </header>
  );
}
