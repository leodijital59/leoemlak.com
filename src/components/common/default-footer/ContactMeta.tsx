
const ContactMeta = () => {
  const contactInfoList = [
    {
      title: "Tekirdağ ve Çorlu Danışma Hattı",
      phone: "+90 552 995 00 59",
      phoneLink: "tel:+905529950059",
    },
    {
      title: "Web Sitesi",
      mail: "www.leoemlak.com",
      mailLink: "https://leoemlak.com",
    },
  ];

  return (
    <div className="row mb-4 mb-lg-5">
      {contactInfoList.map((contact, index) => (
        <div className="col-auto" key={index}>
          <div className="contact-info">
            <p className="info-title">{contact.title}</p>
            {contact.phone && (
              <h6 className="info-phone">
                <a href={contact.phoneLink}>{contact.phone}</a>
              </h6>
            )}
            {contact.mail && (
              <h6 className="info-mail">
                <a href={contact.mailLink}>{contact.mail}</a>
              </h6>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactMeta;
