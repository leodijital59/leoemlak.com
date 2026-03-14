import Image from "@/components/common/Image";

const Explore = () => {
  // Array of iconbox data
  const iconboxData = [
    {
      icon: "/images/icon/property-buy-2.svg",
      title: "Gayrimenkul Satın Alın",
      text: "Tekirdağ ve Çorlu'daki satılık daire, villa ve arsa ilanlarını karşılaştırın.",
      linkText: "İlanlara Göz Atın",
    },
    {
      icon: "/images/icon/property-sell-2.svg",
      title: "İlanınızı Yayınlayın",
      text: "Bölgesel görünürlüğü yüksek bir vitrinle gayrimenkulünüzü doğru alıcıyla buluşturun.",
      linkText: "İlan Verin",
    },
    {
      icon: "/images/icon/property-rent-2.svg",
      title: "Kiralık İlan Bulun",
      text: "Çorlu ve çevresinde bütçenize uygun kiralık konut ve işyeri seçeneklerini inceleyin.",
      linkText: "Kiralıkları Görün",
    },
  ];

  return (
    <>
      {iconboxData.map((item, index) => (
        <div
          className="col-sm-6 col-lg-4"
          key={index}
          data-aos="fade-up"
          data-aos-delay={(index + 1) * 100} // Increase delay for each item
        >
          <div className="iconbox-style3 text-center">
            <div className="icon">
              <Image width={316} height={150} src={item.icon} alt="icon" />
            </div>
            <div className="iconbox-content">
              <h4 className="title">{item.title}</h4>
              <p className="text">{item.text}</p>
              <a href="#" className="ud-btn btn-thm3">
                {item.linkText}
                <i className="fal fa-arrow-right-long" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Explore;
