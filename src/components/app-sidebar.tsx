'use client'

import { Home, Settings, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"

const menuItems = [
    {
        title: "Dashboard",
        icon: Home,
        href: "/dashboard"
    }
]

function SidebarContent() {
    return (
        <div className="flex flex-col h-full">
            <div className="h-16 flex items-center px-6">
                <h2 className="font-semibold text-xl">Growvy</h2>
            </div>

            <div className="flex-1 p-4 pt-0">
                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent"
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>
            </div>
        </div>
    )
}

export function AppSidebar() {
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-0 left-0 p-4 z-50">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 border-r bg-background shrink-0">
                <SidebarContent />
            </aside>
        </>
    )
}