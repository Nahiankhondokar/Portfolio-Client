"use client"

import React, { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  AppWindowIcon,
  ChevronUp,
  Home,
  LayersIcon,
  LibraryBig,
  MonitorCogIcon,
  NewspaperIcon,
  User2Icon,
  BookOpenCheck, 
  MessageCircle,
  BookOpen,
  Settings,
  LogOut,
  LayoutDashboard,
  Palette
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Me from "@/public/assets/me/me.jpg";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfileStore } from "@/stores/useProfileStore";
import { usePermission } from "@/hooks/usePermission";
import { cn } from "@/lib/utils";

// All navigation items
const ALL_ITEMS = [
  { title: "Dashboard",  url: "/dashboard",            icon: LayoutDashboard, adminOnly: false },
  { title: "Users",      url: "/dashboard/user",        icon: User2Icon,       adminOnly: true  },
  { title: "Blogs",      url: "/dashboard/blog",        icon: NewspaperIcon,   adminOnly: false },
  { title: "Services",   url: "/dashboard/service",     icon: MonitorCogIcon,  adminOnly: false },
  { title: "Projects",   url: "/dashboard/project",     icon: AppWindowIcon,   adminOnly: false },
  { title: "Experience", url: "/dashboard/experience",  icon: LayersIcon,      adminOnly: false },
  { title: "Expertise",  url: "/dashboard/expertise",   icon: LibraryBig,      adminOnly: false },
  { title: "Portfolio",  url: "/dashboard/portfolio",   icon: BookOpenCheck,   adminOnly: false },
  { title: "Education",  url: "/dashboard/education",   icon: BookOpen,        adminOnly: false },
  { title: "Chatbot",    url: "/dashboard/chatbot",     icon: MessageCircle,   adminOnly: false },
  { title: "Theme Settings", url: "/dashboard/theme",   icon: Palette,         adminOnly: false },
];

const SideBar = () => {
  const pathname = usePathname();
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const { canManageUsers } = usePermission();

  // Filter nav items based on role
  const items = ALL_ITEMS.filter((item) => !item.adminOnly || canManageUsers);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-900 bg-black">
      {/* HEADER */}
      <SidebarHeader className="p-4 pt-6">
        <Link href="/dashboard" className="flex items-center gap-3 group px-2">
            <div className="w-8 h-8 rounded-xl bg-yellow-500 flex items-center justify-center font-black text-black group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                A
            </div>
            <div className="flex flex-col">
                <span className="text-white font-black text-sm uppercase tracking-tighter leading-none">Antigravity</span>
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">Control Panel</span>
            </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="bg-zinc-900 opacity-50 my-4 mx-4" />

      {/* CONTENT */}
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-600 text-[10px] font-black uppercase tracking-[3px] px-4 mb-4">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const isActive = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url));
                return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title}
                        className={cn(
                            "h-11 rounded-xl transition-all duration-300 px-4 group",
                            isActive 
                            ? "bg-zinc-900 text-yellow-500 shadow-sm" 
                            : "text-zinc-500 hover:bg-zinc-900/50 hover:text-white"
                        )}
                      >
                        <Link href={item.url} className="flex items-center gap-3">
                          <item.icon className={cn(
                              "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                              isActive ? "text-yellow-500" : "text-zinc-500"
                          )} />
                          <span className={cn(
                              "text-sm font-bold tracking-tight",
                              isActive ? "text-white" : ""
                          )}>{item.title}</span>
                          {isActive && (
                              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="p-2 pt-4 border-t border-zinc-900 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-14 rounded-xl hover:bg-zinc-900/50 transition-all px-3">
                  <div className="relative">
                    <Image
                      src={profile?.image || Me}
                      alt="User"
                      width={32}
                      height={32}
                      className="rounded-lg border border-zinc-800 object-cover"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full" />
                  </div>
                  <div className="flex flex-col items-start ml-3 overflow-hidden">
                    <span className="text-white font-bold text-sm truncate w-full text-left">
                        {profile?.name || "Logged User"}
                    </span>
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest truncate w-full">
                        Administrator
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                side="top"
                className="w-56 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-2 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex flex-col">
                        <span className="text-white text-xs font-black uppercase tracking-widest">My Account</span>
                        <span className="text-zinc-500 text-[10px] font-medium">{profile?.email}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-900 mx-1 my-1" />

                <DropdownMenuItem className="rounded-xl px-3 py-2 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 focus:bg-zinc-900 focus:text-white transition-all cursor-pointer gap-2">
                  <Settings size={14} />
                  Settings
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-zinc-900 mx-1 my-1" />

                <DropdownMenuItem 
                    className="rounded-xl px-3 py-2 text-sm font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 transition-all cursor-pointer gap-2"
                >
                  <LogOut size={14} />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
