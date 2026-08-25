import { Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import ProSidebarContent from "./ProSidebarContent";
import Image from "@/components/common/Image";

async function closeMobileMenu() {
  if (typeof document === "undefined") return;

  const el = document.getElementById("mobileMenu");
  if (!el?.classList.contains("show")) return;

  try {
    const { default: Offcanvas } = await import(
      "bootstrap/js/dist/offcanvas"
    );
    const instance = Offcanvas.getInstance(el) ?? Offcanvas.getOrCreateInstance(el);
    instance.hide();
    return;
  } catch {
    // Fall through to dismiss-button click
  }

  const closer = el.querySelector(
    '[data-bs-dismiss="offcanvas"]',
  ) as HTMLElement | null;
  closer?.click();
}

const MobileMenu = () => {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  useEffect(() => {
    void closeMobileMenu();
  }, [pathname]);

  return (
    <div className="mobilie_header_nav stylehome1">
      <div className="mobile-menu">
        <div className="header innerpage-style">
          <div className="menu_and_widgets">
            <div className="mobile_menu_bar d-flex justify-content-between align-items-center">
              <a
                className="menubar"
                href="#"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileMenu"
                aria-controls="mobileMenu"
              >
                <Image
                  width={25}
                  height={9}
                  src="/images/mobile-dark-nav-icon.svg"
                  alt="mobile icon"
                />
              </a>
              <Link
                className="mobile_logo"
                to="/"
                onClick={() => {
                  void closeMobileMenu();
                }}
              >
                <img
                  className="site-logo site-logo--mobile"
                  src="/images/header-logo2.svg?v=9"
                  alt="Leo Emlak"
                  width={110}
                  height={48}
                />
              </Link>
              <span />
            </div>
          </div>
        </div>
      </div>
      {/* /.mobile-menu meta */}

      <div
        className="offcanvas offcanvas-start mobile_menu-canvas"
        tabIndex={-1}
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
        data-bs-scroll="true"
      >
        <div className="rightside-hidden-bar">
          <div className="hsidebar-header">
            <div
              className="sidebar-close-icon"
              data-bs-dismiss="offcanvas"
              aria-label="Kapat"
            >
              <span className="far fa-times"></span>
            </div>
            <h4 className="title">LeoEmlak Menü</h4>
          </div>
          {/* End header */}

          <div className="hsidebar-content ">
            <div className="hiddenbar_navbar_content">
              <ProSidebarContent
                onNavigate={() => {
                  void closeMobileMenu();
                }}
              />
            </div>
          </div>
          {/* End hsidebar-content */}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
