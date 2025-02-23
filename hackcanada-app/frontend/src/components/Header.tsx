// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Coins,
  Leaf,
  Search,
  Bell,
  User,
  ChevronDown,
  LogIn,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeviceType } from "@/hooks/useDeviceType";
import { ModeToggle } from "@/components/darkmode-toggle";
import icon from "@/components/icon.svg";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const deviceType = useDeviceType();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 w-full z-50 shadow-md">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:mr-4"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center">
            <Image
              src={icon}
              alt="NutriMind Icon"
              className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-gray-800 dark:text-gray-100">
                NutriMind
              </span>
              <span className="text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
                Your personalized meal planner
              </span>
            </div>
          </Link>
        </div>
        <div>
          <ModeToggle />
        </div>
        {/* {deviceType !== 'mobile' && (
					<div className="flex-1 max-w-xl mx-4">
						<div className="relative">
							<input
								type="text"
								placeholder="Search..."
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
							<Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
						</div>
					</div>
				)} */}
      </div>
    </header>
  );
}
