
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
// Remix icons are now imported via CSS in main.tsx

export function AppSidebar() {
  const location = useLocation();
  
  const navItems = [
    {
      title: "Painel",
      path: "/",
      iconClass: "ri-pulse-line",
    },
    {
      title: "Racks", // Mantido, termo técnico comum
      path: "/racks",
      iconClass: "ri-server-line",
    },
    {
      title: "Equipamentos",
      path: "/equipment",
      iconClass: "ri-hard-drive-2-line",
    },
    {
      title: "Mapeamento de Portas",
      path: "/port-mappings",
      iconClass: "ri-route-line",
    },
    {
      title: "Busca",
      path: "/search",
      iconClass: "ri-search-line",
    },
  ];
  
  const toolItems = [
    {
      title: "Banco de Dados",
      path: "/database",
      iconClass: "ri-database-2-line",
    },
    {
      title: "Configurações",
      path: "/settings",
      iconClass: "ri-settings-3-line",
    },
  ];
  
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <i className="ri-router-line w-6 h-6 text-sidebar-primary"></i>
          <span className="font-medium text-lg text-sidebar-foreground">
            Mapeador de Rede Visual
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <i className={`${item.iconClass} w-[18px] h-[18px]`}></i>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <i className={`${item.iconClass} w-[18px] h-[18px]`}></i>
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
          Mapeador de Rede Visual v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
