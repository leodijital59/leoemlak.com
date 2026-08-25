import { Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import ProSidebarContent from "./ProSidebarContent";
import Image from "@/components/common/Image";

/** Force-close the mobile Bootstrap offcanvas (same handlers that opened it). */
function closeMobileMenu() {
  if (typeof document === "undefined") return;

  const el = document.getElementById("mobileMenu");
  if (!el) return;

  const isOpen =
    el.classList.contains("show") || el.classList.contains("showing");

  if (isOpen) {
    // Use Bootstrap's own dismiss control so the same data-api instance hides it
    const closer = el.querySelector(
      '[data-bs-dismiss="offcanvas"]',
    ) as HTMLElement | null;
    closer?.click();
  }

  // Hard cleanup — covers stuck instances / backdrop left behind after SPA nav
  el.classList.remove("show", "showing");
  el.setAttribute("aria-hidden", "true");

  document.querySelectorAll(".offcanvas-backdrop").forEach((node) => {
    node.remove();
  });

  document.body.classList.remove("modal-open", "overflow-hidden");
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("padding-right");
}

const MobileMenu = () => {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  // Close whenever the route changes (SPA navigation)
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  // Also close on any in-menu link click (capture), in case route effect is delayed
  useEffect(() => {
    const el = document.getElementById("mobileMenu");
    if (!el) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      // Ignore non-navigation / hash-only placeholders
      const href = anchor.getAttribute("href");
      if (!href || href === "#" || href.startsWith("javascript:")) return;
      closeMobileMenu();
    };

    el.addEventListener("click", onClick, true);
    return () => el.removeEventListener("click", onClick, true);
  }, []);

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
              <Link className="mobile_logo" to="/" onClick={closeMobileMenu}>
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
              role="button"
            >
              <span className="far fa-times"></span>
            </div>
            <h4 className="title">LeoEmlak Menü</h4>
          </div>
          {/* End header */}

          <div className="hsidebar-content ">
            <div className="hiddenbar_navbar_content">
              <ProSidebarContent onNavigate={closeMobileMenu} />
            </div>
          </div>
          {/* End hsidebar-content */}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
