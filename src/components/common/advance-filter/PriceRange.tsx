import { useState} from "react";
import Slider from "rc-slider";

const PriceRange = () => {
  const [price, setPrice] = useState([20, 709]);

  return (
    <div className="range-wrapper">
      <Slider
        range={{
          editable: true,
          minCount: 0,
          maxCount: 10000
        }}
        defaultValue={price}
        onChange={(value: any) => setPrice(value)}
        id="slider"
      />
      <div className="d-flex align-items-center">
        <span id="slider-range-value1">${price[0]}</span>
        <i className="fa-sharp fa-solid fa-minus mx-2 dark-color icon" />
        <span id="slider-range-value2">${price[1]}</span>
      </div>
    </div>
  );
};

export default PriceRange;
