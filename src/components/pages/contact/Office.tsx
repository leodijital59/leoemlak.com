import { SITE_PHONE_DISPLAY } from "@/lib/seo";

const Office = () => {
  const offices = [
    {
      id: 1,
      city: "Çorlu",
      address: "Çorlu merkez ve yakın çevre mahallelerde aktif portföy desteği",
      phoneNumber: SITE_PHONE_DISPLAY,
      phoneHref: "tel:+905529950059",
      mapLink: "/properties?province=TEKIRDAG&district=CORLU",
    },
    {
      id: 2,
      city: "Süleymanpaşa",
      address: "Merkez ve sahil hattında konut ile ticari ilan danışmanlığı",
      phoneNumber: SITE_PHONE_DISPLAY,
      phoneHref: "tel:+905529950059",
      mapLink: "/properties?province=TEKIRDAG&district=SULEYMANPASA",
    },
    {
      id: 3,
      city: "Çerkezköy",
      address: "Yatırım ve yaşam odaklı gelişen bölgelerde ilan takibi",
      phoneNumber: SITE_PHONE_DISPLAY,
      phoneHref: "tel:+905529950059",
      mapLink: "/properties?province=TEKIRDAG&district=CERKEZKOY",
    },
  ];

  return (
    <>
      {offices.map((office) => (
        <div className="col-sm-6 col-lg-4" key={office.id}>
          <div className="iconbox-style8 text-center">
            <div className="iconbox-content">
              <h3 className="title">{office.city} Emlak</h3>
              <p className="text mb-1">{office.address}</p>
              <h6 className="mb10">
                <a href={office.phoneHref}>{office.phoneNumber}</a>
              </h6>
              <a className="text-decoration-underline" href={office.mapLink}>
                {office.city} ilanlarını aç
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Office;
