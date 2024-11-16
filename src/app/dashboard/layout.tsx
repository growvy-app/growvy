import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                {/* <header className="h-16 border-b bg-background flex items-center px-4 md:px-8">
                    <h1 className="font-semibold">Dashboard</h1>
                </header> */}
                <main className="flex-1">
                    <div className="max-w-7xl mx-auto p-4 md:p-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
