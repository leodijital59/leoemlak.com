const WHATSAPP_URL =
  "https://wa.me/905529950059?text=" +
  encodeURIComponent("Merhaba, Leo Emlak hakkında bilgi almak istiyorum.");

export default function WhatsAppBalloon() {
  return (
    <a
      href={WHATSAPP_URL}
      className="whatsapp-balloon"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      title="WhatsApp ile yazın"
    >
      <span className="whatsapp-balloon__pulse" aria-hidden="true" />
      <i className="fab fa-whatsapp" aria-hidden="true" />
    </a>
  );
}
