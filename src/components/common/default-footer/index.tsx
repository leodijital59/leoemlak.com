import {Link} from "@tanstack/react-router";
import ContactMeta from "./ContactMeta";
import Social from "./Social";
import MenuWidget from "./MenuWidget";
import Copyright from "./Copyright";

const Footer = () => {
  return (
    <>
      <div className="container site-footer">
        <div className="row gy-4 gy-lg-0">
          <div className="col-lg-5">
            <div className="footer-widget mb-2 mb-lg-0">
              <Link className="footer-logo d-inline-block" to="/">
                <img
                  className="mb30 footer-logo-img site-logo site-logo--footer"
                  src="/images/header-logo2.svg?v=8"
                  alt="Leo Emlak"
                  width={150}
                  height={64}
                />
              </Link>
              <p className="footer-lead text-white mb25">
                Tekirdağ ve Çorlu’da satılık &amp; kiralık gayrimenkul danışmanlığı.
              </p>
              <ContactMeta />
              <div className="social-widget">
                <h6 className="text-white mb15">Bizi takip edin</h6>
                <Social />
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="footer-widget">
              <MenuWidget />
            </div>
          </div>
        </div>
      </div>

      <Copyright />
    </>
  );
};

export default Footer;
