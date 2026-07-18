
const Social = () => {
  const socialLinks = [
    { icon: "fab fa-facebook-f", href: "#" },
    { icon: "fab fa-instagram", href: "#" },
    { icon: "fab fa-whatsapp", href: "https://wa.me/905529950059" },
  ];

  return (
    <div className="social-style1">
      {socialLinks.map((social, index) => (
        <a
          key={index}
          href={social.href}
          target={social.href !== "#" ? "_blank" : undefined}
          rel={social.href !== "#" ? "noopener noreferrer" : undefined}
        >
          <i className={social.icon + " list-inline-item"} />
        </a>
      ))}
    </div>
  );
};

export default Social;