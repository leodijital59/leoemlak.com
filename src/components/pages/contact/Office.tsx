import Image from "@/components/common/Image";

const Office = () => {
  const offices = [
    {
      id: 1,
      city: "Çorlu",
      icon: "/images/icon/paris.svg",
      address: "Çorlu merkez ve yakın çevre mahallelerde aktif portföy desteği",
      phoneNumber: "+(0) 123 050 945 02",
      mapLink: "/properties?province=TEKIRDAG&district=CORLU",
    },
    {
      id: 2,
      city: "Süleymanpaşa",
      icon: "/images/icon/london.svg",
      address: "Merkez ve sahil hattında konut ile ticari ilan danışmanlığı",
      phoneNumber: "+(0) 123 050 945 02",
      mapLink: "/properties?province=TEKIRDAG&district=SULEYMANPASA",
    },
    {
      id: 3,
      city: "Çerkezköy",
      icon: "/images/icon/new-york.svg",
      address: "Yatırım ve yaşam odaklı gelişen bölgelerde ilan takibi",
      phoneNumber: "+(0) 123 050 945 02",
      mapLink: "/properties?province=TEKIRDAG&district=CERKEZKOY",
    },
  ];

  return (
    <>
      {offices.map((office) => (
        <div className="col-sm-6 col-lg-4" key={office.id}>
          <div className="iconbox-style8 text-center">
            <div className="icon">
              <Image width={120} height={120} src={office.icon} alt="icon" />
            </div>
            <div className="iconbox-content">
              <h4 className="title">{office.city}</h4>
              <p className="text mb-1">{office.address}</p>
              <h6 className="mb10">{office.phoneNumber}</h6>
              <a className="text-decoration-underline" href={office.mapLink}>
                Bölge ilanlarını aç
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Office;
