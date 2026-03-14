const Subscribe = () => {
  return (
    <div className="mailchimp-widget mb-4 mb-lg-5">
      <h6 className="title text-white mb20">Güncel ilanlardan haberdar olun</h6>
      <div className="mailchimp-style1">
        <input type="email" className="form-control" placeholder="E-posta adresiniz" />
        <button type="submit">Abone Ol</button>
      </div>
    </div>
  );
};

export default Subscribe;
