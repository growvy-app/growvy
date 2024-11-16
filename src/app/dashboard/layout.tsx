import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0 w-full">
                <main className="flex-1 w-full">
                    <div className="w-full h-full p-4 md:p-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
