"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ThemeToggle"
import {
  BarChart3, LayoutDashboard, PieChart, FileText,
  Settings, ChevronLeft, ChevronRight, Briefcase,
  TrendingUp, Menu, X, Star, BookOpen, User, LogOut
} from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/portfolio", icon: Briefcase, label: "Portfolio" },
  { href: "/dashboard/watchlist", icon: Star, label: "Watchlist" },
  { href: "/academy", icon: BookOpen, label: "Academy" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar fixed md:sticky top-0 h-screen z-40 transition-all duration-300 flex flex-col
          ${collapsed ? "w-[72px]" : "w-[240px]"}
          ${mobileOpen ? "left-0" : "-left-[300px] md:left-0"}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 p-4 border-b ${collapsed ? "justify-center" : ""}`}
          style={{ borderColor: "var(--border)" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "var(--gradient-primary)" }}>
            <BarChart3 size={18} color="white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <span className="font-bold text-sm gradient-text">QuantVista</span>
              <span className="text-xs font-light block" style={{ color: "var(--text-muted)" }}>AI Analytics</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`sidebar-link ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t hidden md:block" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-link w-full justify-center mb-2"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          
          <div className={`flex items-center ${collapsed ? "justify-center flex-col gap-4" : "justify-between px-3"} py-2 mt-4`}>
            <ThemeToggle />
            <Link href="/api/auth/signout" className="text-sm font-medium hover:text-red-400" style={{ color: "var(--text-secondary)" }}>
              {!collapsed ? "Sign Out" : "Out"}
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
