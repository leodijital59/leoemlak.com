import {Link} from "@tanstack/react-router";
import ProSidebarContent from "./ProSidebarContent";
import Image from "@/components/common/Image";

const MobileMenu = () => {
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
              <Link className="mobile_logo" to="/">
                <img
                  className="site-logo site-logo--mobile"
                  src="/images/header-logo2.svg?v=4"
                  alt="Leo Emlak"
                  width={210}
                  height={120}
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
              <ProSidebarContent />
            </div>
          </div>
          {/* End hsidebar-content */}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
