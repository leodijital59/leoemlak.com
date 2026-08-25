const ContactMeta = () => {
  const contactInfoList = [
    {
      title: "Danışma Hattı",
      phone: "+90 552 995 00 59",
      phoneLink: "tel:+905529950059",
    },
    {
      title: "Web",
      mail: "www.leoemlak.com",
      mailLink: "https://leoemlak.com",
    },
  ];

  return (
    <div className="footer-contact-meta mb-4 mb-lg-5">
      {contactInfoList.map((contact) => (
        <div className="contact-info" key={contact.title}>
          <p className="info-title">{contact.title}</p>
          {contact.phone && (
            <h6 className="info-phone mb-0">
              <a href={contact.phoneLink}>{contact.phone}</a>
            </h6>
          )}
          {contact.mail && (
            <h6 className="info-mail mb-0">
              <a href={contact.mailLink}>{contact.mail}</a>
            </h6>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactMeta;
