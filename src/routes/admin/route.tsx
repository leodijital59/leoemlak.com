import { Outlet, createFileRoute } from '@tanstack/react-router'
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";

export const Route = createFileRoute('/admin')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="wrapper ovh">
            <div className="dashboard_content_wrapper">
                <div className="dashboard dashboard_wrapper">
                    <SidebarDashboard />

                    <div className="dashboard__main pl0-md">
                        <div className="dashboard__content bgc-f7">
                            <DboardMobileNavigation />

                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
