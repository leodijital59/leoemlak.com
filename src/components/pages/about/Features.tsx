const Features = () => {
  // Define an array of feature objects
  const features = [
    {
      icon: "flaticon-security",
      title: "Doğru Portföy Eşleşmesi",
      description:
        "Çorlu ve Tekirdağ genelindeki güncel ilanları ihtiyacınıza göre filtreleyip öne çıkarıyoruz.",
    },
    {
      icon: "flaticon-keywording",
      title: "Yatırım Odaklı Analiz",
      description:
        "Bölgesel talep, ulaşım ve gelişim akslarını dikkate alarak daha isabetli karar almanıza yardımcı oluyoruz.",
    },
    {
      icon: "flaticon-investment",
      title: "Hızlı İletişim",
      description:
        "İlçe bazlı ihtiyaçlarınız için size en uygun ilanlara ve bilgilere kısa sürede ulaşmanızı sağlıyoruz.",
    },
  ];

  return (
    <>
      {features.map((feature, index) => (
        <div className="list-one d-flex align-items-start mb30" key={index}>
          <span className={`list-icon flex-shrink-0 ${feature.icon}`} />
          <div className="list-content flex-grow-1 ml20">
            <h6 className="mb-1">{feature.title}</h6>
            <p className="text mb-0 fz15">{feature.description}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Features;
