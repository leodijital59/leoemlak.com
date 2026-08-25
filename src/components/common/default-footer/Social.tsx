
const Social = () => {
  const socialLinks = [
    { icon: "fab fa-facebook-f", href: "#", label: "Facebook" },
    { icon: "fab fa-instagram", href: "#", label: "Instagram" },
    { icon: "fab fa-whatsapp", href: "https://wa.me/905529950059", label: "WhatsApp" },
  ];

  return (
    <div className="social-style1 footer-social">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          target={social.href !== "#" ? "_blank" : undefined}
          rel={social.href !== "#" ? "noopener noreferrer" : undefined}
        >
          <i className={social.icon} />
        </a>
      ))}
    </div>
  );
};

export default Social;
