import { createFileRoute } from '@tanstack/react-router'
import PropertyFiltering from '@/components/listing/grid-view/grid-default/PropertyFiltering'

export const Route = createFileRoute('/(app)/listings')({
    component: ListingsPage,
    ssr: "data-only",
})

function ListingsPage() {
    return (
        <>
            <section className="breadcumb-section bgc-f7">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcumb-style1">
                                <h2 className="title">New York Homes for Sale</h2>
                                <div className="breadcumb-list">
                                    <a href="#">Home</a>
                                    <a href="#">For Rent</a>
                                </div>
                                <a
                                    className="filter-btn-left mobile-filter-btn d-block d-lg-none"
                                    data-bs-toggle="offcanvas"
                                    href="#listingSidebarFilter"
                                    role="button"
                                    aria-controls="listingSidebarFilter"
                                >
                                    <span className="flaticon-settings" /> Filter
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <PropertyFiltering />
        </>
    )
}
