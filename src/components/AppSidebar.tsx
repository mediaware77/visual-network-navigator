
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  Server, 
  Network, 
  Cable, 
  ServerCog, 
  Search, 
  PanelLeft, 
  Settings,
  Database,
  Activity
} from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  
  const navItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: Activity,
    },
    {
      title: "Racks",
      path: "/racks",
      icon: Server,
    },
    {
      title: "Equipment",
      path: "/equipment",
      icon: ServerCog,
    },
    {
      title: "Port Mappings",
      path: "/port-mappings",
      icon: Cable,
    },
    {
      title: "Search",
      path: "/search",
      icon: Search,
    },
  ];
  
  const toolItems = [
    {
      title: "Database",
      path: "/database",
      icon: Database,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];
  
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Network size={24} className="text-sidebar-primary" />
          <span className="font-medium text-lg text-sidebar-foreground">
            Visual Network Mapper
          </span>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    active={location.pathname === item.path}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    active={location.pathname === item.path}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border px-4 py-2">
        <div className="text-xs text-sidebar-foreground/70">
          Visual Network Mapper v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
