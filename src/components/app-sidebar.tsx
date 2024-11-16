'use client'

import { Home, Settings, Menu, HomeIcon as HomeFilled, Settings as SettingsFilled, ShoppingCart, ShoppingCartIcon as ShoppingCartFilled, Book, BookIcon as BookFilled } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"
import { cn } from "@/lib/utils"

const menuItems = [
    {
        title: "Dashboard",
        icon: Home,
        filledIcon: HomeFilled,
        href: "/dashboard"
    },
    {
        title: "Shop",
        icon: ShoppingCart,
        filledIcon: ShoppingCartFilled,
        href: "/dashboard/shop"
    },
    {
        title: "Courses",
        icon: Book,
        filledIcon: BookFilled,
        href: "/dashboard/courses"
    }
]

function SidebarContent() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full">
            <div className="h-16 flex items-center px-6">
                <Link href="/dashboard" className="font-semibold text-xl">
                    Growvy
                </Link>
            </div>

            <div className="flex-1 p-4">
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = isActive ? item.filledIcon : item.icon
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                prefetch={true}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700",
                                    isActive
                                        ? "bg-gray-100 text-black font-bold"
                                        : "hover:bg-accent"
                                )}
                            >
                                <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="p-4">
                <Link
                    href="/dashboard/settings"
                    prefetch={true}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700",
                        pathname === "/dashboard/settings"
                            ? "bg-gray-100 text-black font-bold"
                            : "hover:bg-accent"
                    )}
                >
                    {pathname === "/dashboard/settings" ? (
                        <SettingsFilled className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                        <Settings className="h-4 w-4" strokeWidth={2} />
                    )}
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