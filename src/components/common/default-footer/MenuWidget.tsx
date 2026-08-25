const MenuWidget = () => {
  const pages = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Tüm İlanlar", href: "/properties" },
    { label: "Hakkımızda", href: "/about" },
    { label: "İletişim", href: "/contact" },
  ];

  const popular = [
    { label: "Çorlu Satılık", href: "/properties?province=TEKIRDAG&district=CORLU&listingType=sold" },
    { label: "Çorlu Kiralık", href: "/properties?province=TEKIRDAG&district=CORLU&listingType=rented" },
    { label: "Çerkezköy", href: "/properties?province=TEKIRDAG&district=CERKEZKOY" },
    { label: "Süleymanpaşa", href: "/properties?province=TEKIRDAG&district=SULEYMANPASA" },
    { label: "Kapaklı", href: "/properties?province=TEKIRDAG&district=KAPAKLI" },
    { label: "Ergene", href: "/properties?province=TEKIRDAG&district=ERGENE" },
    { label: "Marmaraereğlisi", href: "/properties?province=TEKIRDAG&district=MARMARAEREGLISI" },
  ];

  return (
    <div className="row g-4 footer-menus">
      <div className="col-6 col-md-5">
        <div className="link-style1 footer-link-block">
          <h6 className="text-white mb20">Hızlı Erişim</h6>
          <ul className="ps-0 mb-0">
            {pages.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="col-6 col-md-7">
        <div className="link-style1 footer-link-block">
          <h6 className="text-white mb20">Popüler Bölgeler</h6>
          <ul className="ps-0 mb-0 footer-region-list">
            {popular.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MenuWidget;
