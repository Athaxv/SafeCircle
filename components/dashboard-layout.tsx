"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Home, Map, Calendar, Settings, LogOut, User, Shield, FileText } from "lucide-react"

type UserData = {
  name: string
  email?: string
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem("travelGuardianUser")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setUserData({
        name: parsedData.name || "User",
        email: parsedData.email || "user@example.com",
      })
    }
  }, [])

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">TravelGuardian</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <a href="/dashboard">
                        <Home className="h-5 w-5" />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard/map">
                        <Map className="h-5 w-5" />
                        <span>Safe Zones</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard/itinerary">
                        <Calendar className="h-5 w-5" />
                        <span>Itinerary</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard/reports">
                        <FileText className="h-5 w-5" />
                        <span>Trip Reports</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard/profile">
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard/settings">
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard/notifications">
                        <Bell className="h-5 w-5" />
                        <span>Notifications</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>{userData ? getInitials(userData.name) : "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userData?.name || "User"}</span>
                <span className="text-xs text-muted-foreground">{userData?.email || "user@example.com"}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-4 gap-2">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-6 md:p-8 overflow-auto">{children}</div>
      </div>
    </SidebarProvider>
  )
}
