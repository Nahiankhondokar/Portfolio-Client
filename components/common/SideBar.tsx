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
  SidebarMenuBadge,
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
  User2,
  User2Icon,
  BookOpenCheck, MessageCircle,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Me from "@/public/assets/me/me.jpg";

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

// All navigation items
const ALL_ITEMS = [
  { title: "Home",       url: "/dashboard",            icon: Home,           adminOnly: false },
  { title: "User",       url: "/dashboard/user",        icon: User2Icon,       adminOnly: true  }, // Super Admin only
  { title: "Blog",       url: "/dashboard/blog",        icon: NewspaperIcon,   adminOnly: false },
  { title: "Services",   url: "/dashboard/service",     icon: MonitorCogIcon,  adminOnly: false },
  { title: "Projects",   url: "/dashboard/project",     icon: AppWindowIcon,   adminOnly: false },
  { title: "Experience", url: "/dashboard/experience",  icon: LayersIcon,      adminOnly: false },
  { title: "Expertise",  url: "/dashboard/expertise",   icon: LibraryBig,      adminOnly: false },
  { title: "Portfolio",  url: "/dashboard/portfolio",   icon: BookOpenCheck,   adminOnly: false },
  { title: "Education",  url: "/dashboard/education",   icon: BookOpen,        adminOnly: false },
  { title: "Chatbot",    url: "/dashboard/chatbot",     icon: MessageCircle,   adminOnly: false },
];

const SideBar = () => {
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const { isSuperAdmin, canManageUsers } = usePermission();

  // Filter nav items based on role
  const items = ALL_ITEMS.filter((item) => !item.adminOnly || canManageUsers);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard" className="flex align-middle">
                <Image
                  src={profile?.image || Me}
                  alt="User"
                  width={24}
                  height={24}
                  priority
                  className="rounded-full"
                  unoptimized={process.env.NODE_ENV === 'development'}
                />
                <span className="ml-2 font-medium">{profile?.name || "Logged-in User"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />

      {/* CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.title === "Inbox" && (
                    <SidebarMenuBadge>50</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="">
                    <Projector /> See All Projects
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="">
                    <Plus /> Add Project
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        {/* Collapsable Menu */}
        {/* <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Collapsable Menu
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="">
                        <Projector /> See All Projects
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="">
                        <Plus /> Add Project
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible> */}
      </SidebarContent>

      {/* FOOTER WITH DROPDOWN */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 className="h-4 w-4" />
                  <span>{profile?.name || profile?.username || "My Account"}</span>
                  <ChevronUp className="ml-auto h-4 w-4 opacity-70" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-40 rounded-md shadow-md"
              >
                <DropdownMenuLabel className="font-semibold">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer">
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-red-600 cursor-pointer">
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
