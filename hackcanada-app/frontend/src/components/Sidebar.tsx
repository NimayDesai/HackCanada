"use client";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Apple,
  LayoutDashboard,
  User,
  Settings,
  Home,
  LogOut,
} from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
import { useQuery, useMutation } from "@apollo/client";
import { ME_QUERY } from "@/graphql/queries/me";
import { LOGOUT_MUTATION } from "@/graphql/mutations/logout";

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();
  const { data, loading, refetch } = useQuery(ME_QUERY);

  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      // Refetch ME query after logout
      refetch();
    },
  });

  const accountItem = loading
    ? { href: "/#", icon: User, label: "Loading..." }
    : data?.me
    ? null
    : { href: "/account", icon: User, label: "Account" };

  const sidebarItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/mealplan", icon: Apple, label: "Meal Plan" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    accountItem,
  ];

  return (
    <aside
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-20 text-gray-800 dark:text-gray-100 w-64 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <nav className="h-full flex flex-col justify-between">
        <div className="px-4 py-6 space-y-8">
          {sidebarItems
            .filter((item) => item !== null)
            .map((item) => (
              <TransitionLink key={item.href} href={item.href} passHref>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={`w-full justify-start py-3 ${
                    pathname === item.href
                      ? "bg-lime-100 dark:bg-lime-700 text-lime-800 dark:text-lime-200"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 hover:dark:bg-gray-700"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span className="text-base">{item.label}</span>
                </Button>
              </TransitionLink>
            ))}
        </div>
        <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
          {!loading && data?.me && (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              Signed in as: {data.me.email}
            </div>
          )}
          <TransitionLink href="/settings" passHref>
            <Button
              variant={pathname === "/settings" ? "secondary" : "outline"}
              className={`w-full py-3 ${
                pathname === "/settings"
                  ? "bg-green-100 dark:bg-lime-700 text-lime-800 dark:text-lime-200"
                  : "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              <span className="text-base">Settings</span>
            </Button>
          </TransitionLink>
          {!loading && data?.me && (
            <Button
              variant="outline"
              className="w-full py-3 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => logout()}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span className="text-base">Logout</span>
            </Button>
          )}
        </div>
      </nav>
    </aside>
  );
}
