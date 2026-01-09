import {Link} from "@tanstack/react-router";
import ContactMeta from "./ContactMeta";
import AppWidget from "./AppWidget";
import Social from "./Social";
import Subscribe from "./Subscribe";
import MenuWidget from "./MenuWidget";
import Copyright from "./Copyright";
import Image from "@/components/common/Image";

const Footer = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <div className="footer-widget mb-4 mb-lg-5">
              <Link className="footer-logo" to="/">
                <Image
                  width={138}
                  height={44}
                  className="mb40"
                  src="/images/header-logo.svg"
                  alt=""
                />
              </Link>
              <ContactMeta />
              <AppWidget />
              <div className="social-widget">
                <h6 className="text-white mb20">Follow us on social media</h6>
                <Social />
              </div>
            </div>
          </div>
          {/* End .col-lg-5 */}

          <div className="col-lg-7">
            <div className="footer-widget mb-4 mb-lg-5">
              <Subscribe />
              <div className="row justify-content-between">
                <MenuWidget />
              </div>
            </div>
          </div>
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}

      <Copyright />
      {/* End copyright */}
    </>
  );
};

export default Footer;
