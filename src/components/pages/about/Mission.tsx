const Mission = () => {
  const missionData = [
    {
      icon: "flaticon-garden",
      title: "Yerel Bölge Uzmanlığı",
      description: "Tekirdağ ilçelerindeki fiyat ve lokasyon dinamiklerine hakim bir yaklaşım sunuyoruz.",
    },
    {
      icon: "flaticon-secure-payment",
      title: "Güvenilir Süreç",
      description: "İlan incelemeden danışmanlık aşamasına kadar şeffaf ve güven odaklı ilerliyoruz.",
    },
  ];

  return (
    <>
      {missionData.map((item, index) => (
        <div className="col-sm-6" key={index}>
          <div className="why-chose-list style3">
            <div className="list-one mb30">
              <span className={`list-icon flex-shrink-0 ${item.icon} mb20`} />
              <div className="list-content flex-grow-1">
                <h6 className="mb-1">{item.title}</h6>
                <p className="text mb-0 fz14">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Mission;
