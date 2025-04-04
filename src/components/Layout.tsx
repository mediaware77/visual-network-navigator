
import React from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"; // Import SidebarTrigger and useSidebar
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Define isMobile here for SidebarProvider
  const isMobile = useIsMobile();
  // Constants for sidebar widths (consider exporting from ui/sidebar if needed elsewhere)
  const SIDEBAR_WIDTH = "16rem";
  const SIDEBAR_WIDTH_ICON = "3rem";
  
  // Inner component to access sidebar context
  function LayoutContent({ children }: LayoutProps) {
    const { state, isMobile } = useSidebar(); // Get sidebar state (isMobile is also available here)

    // Calculate dynamic left position for desktop trigger
    const desktopTriggerLeft = state === 'expanded' ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON;

    return (
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        {/* Mobile Trigger (fixed top-left) */}
        {!isMobile && ( // Only show trigger if sidebar is potentially collapsible
          <div className="md:hidden fixed top-4 left-4 z-50">
            <SidebarTrigger />
          </div>
        )}

        {/* Desktop Trigger (fixed top, dynamic left) */}
        {!isMobile && ( // Only show trigger if sidebar is potentially collapsible
          <div
            className="hidden md:block fixed top-4 z-50 transition-all duration-200 ease-linear"
            // Adjust left based on sidebar state, add small offset for spacing
            style={{ left: `calc(${desktopTriggerLeft} + 0.5rem)` }}
          >
            <SidebarTrigger />
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {/* Add padding-left on desktop to avoid overlap with fixed trigger */}
          {/* Adjust padding based on collapsed width + offset + desired gap */}
          <main className={`p-4 md:p-8 ${!isMobile ? 'md:pl-[calc(3rem+0.5rem+1rem)]' : ''}`}>
             {children}
          </main>
        </div>
      </div>
    );
  }

  // Main Layout component wraps content with Provider
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
