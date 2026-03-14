
const MenuWidget = () => {
  const menuSections = [
    {
      title: "Popüler Aramalar",
      links: [
        { label: "Çorlu Satılık Daire", href: "/properties?province=TEKIRDAG&district=CORLU&listingType=sold" },
        { label: "Çorlu Kiralık Daire", href: "/properties?province=TEKIRDAG&district=CORLU&listingType=rented" },
        { label: "Çerkezköy Emlak", href: "/properties?province=TEKIRDAG&district=CERKEZKOY" },
        { label: "Süleymanpaşa İlanları", href: "/properties?province=TEKIRDAG&district=SULEYMANPASA" },
      ],
    },
    {
      title: "Hızlı Erişim",
      links: [
        { label: "Ana Sayfa", href: "/" },
        { label: "Tüm İlanlar", href: "/properties" },
        { label: "Hakkımızda", href: "/about" },
        { label: "İletişim", href: "/contact" },
        { label: "Kapaklı Emlak", href: "/properties?province=TEKIRDAG&district=KAPAKLI" },
        { label: "Ergene İlanları", href: "/properties?province=TEKIRDAG&district=ERGENE" },
        { label: "Marmaraereğlisi İlanları", href: "/properties?province=TEKIRDAG&district=MARMARAEREGLISI" },
      ],
    },
  ];

  return (
    <>
      {menuSections.map((section, index) => (
        <div className="col-auto" key={index}>
          <div className="link-style1 mb-3">
            <h6 className="text-white mb25">{section.title}</h6>
            <ul className="ps-0">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

export default MenuWidget;
