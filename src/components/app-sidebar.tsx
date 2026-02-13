import React from "react";
import { 
  LayoutDashboard, 
  Database, 
  ShieldCheck, 
  FileText, 
  Settings, 
  Activity 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Memory Inspector", icon: Database, href: "/memory" },
  { label: "Checkpoints", icon: ShieldCheck, href: "/checkpoints" },
  { label: "Audit Logs", icon: FileText, href: "/logs" },
  { label: "System Health", icon: Activity, href: "/health" },
];
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">Forensic Nexus</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Edge Console v1.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="px-2 space-y-1">
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.href}
                  className={cn(
                    "transition-all duration-200",
                    location.pathname === item.href ? "bg-accent/50 text-accent-foreground shadow-sm" : "hover:bg-accent/30"
                  )}
                >
                  <Link to={item.href} className="flex items-center gap-3">
                    <item.icon className={cn("h-4 w-4", location.pathname === item.href ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-accent/30">
              <Link to="/settings" className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-4 px-2">
          <div className="rounded-md bg-muted/50 p-2 text-[10px] font-mono text-muted-foreground leading-tight">
            NODE_STATE: CONSISTENT<br />
            KV_SYNC: ACTIVE
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}