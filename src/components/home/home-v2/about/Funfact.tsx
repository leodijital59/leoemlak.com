import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { Link } from "@tanstack/react-router";

const Funfact = () => {
  const funFacts = [
    { number: 400, text: 'Tekirdağ genelinde aktif ilan' },
    { number: 200, text: 'Çorlu odaklı güncel portföy' },
    { number: 1000, text: 'Aylık ilan görüntüleme' },
  ];

  return (
    <div className="funfact_one">
      {funFacts.map((fact, index) => (
        <div className="details mb25" key={index}>
          <ul className="ps-0 mb-0">
            <li>
              <div className="timer">
                <CounterWithAnimation end={fact.number} />
              </div>
            </li>
          </ul>
          <p className="text mb-0">{fact.text}</p>
        </div>
      ))}
      <Link to="/properties" className="ud-btn btn-thm">
        Daha Fazla İncele
        <i className="fal fa-arrow-right-long" />
      </Link>
    </div>
  );
};

const CounterWithAnimation = ({ end }: { end: number }) => {
  const countRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
      }
    }, options);

    const currentRef = countRef.current; // Create a local variable

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const formatNumber = (value: number) => {
    if (value >= 1000) {
      return `${Math.floor(value / 1000)}k+`;
    } else if (value === 400) {
      return `${value}`;
    } else {
      return `${value}+`;
    }
  };

  return (
    <span ref={countRef}>
      {inView ? (
        <CountUp
          end={end}
          duration={2}
          separator=","
          formattingFn={formatNumber}
        />
      ) : (
        "0"
      )}
    </span>
  );
};

export default Funfact;
