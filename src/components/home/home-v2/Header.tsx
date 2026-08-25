import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import MainMenu from "@/components/common/MainMenu";

const LOGO_VERSION = "4";

const Header = () => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <>
      <header
        className={`header-nav nav-homepage-style at-home2  main-menu ${
          navbar ? "sticky slideInDown animated" : ""
        }`}
      >
        <nav className="posr">
          <div className="container maxw1600 posr">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="logos mr40">
                    <Link className="header-logo logo1" to="/">
                      <img
                        className="site-logo"
                        src={`/images/header-logo.svg?v=${LOGO_VERSION}`}
                        alt="Leo Emlak"
                        width={280}
                        height={160}
                      />
                    </Link>
                    <Link className="header-logo logo2" to="/">
                      <img
                        className="site-logo"
                        src={`/images/header-logo2.svg?v=${LOGO_VERSION}`}
                        alt="Leo Emlak"
                        width={280}
                        height={160}
                      />
                    </Link>
                  </div>
                  {/* End Logo */}

                  <MainMenu />
                  {/* End Main Menu */}
                </div>
              </div>
              {/* End .col-auto */}

              <div className="col-auto">
                <div className="d-flex align-items-center">
                  <a
                    className="login-info d-flex align-items-center me-3"
                    href="tel:+905529950059"
                  >
                    <i className="far fa-phone fz16 me-2"></i>{" "}
                    <span className="d-none d-xl-block">0552 995 00 59</span>
                  </a>
                </div>
              </div>
              {/* End .col-auto */}
            </div>
            {/* End .row */}
          </div>
        </nav>
      </header>
      {/* End Header */}
    </>
  );
};

export default Header;
