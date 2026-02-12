import { useEffect, useState } from "react";
import Slider from "rc-slider";

interface PriceRangeProps {
  priceMin?: number;
  priceMax?: number;
  onChange: (values: { priceMin?: number; priceMax?: number }) => void;
}

const MIN = 0;
const MAX = 50_000_000;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("tr-TR").format(value);

const PriceRange = ({ priceMin, priceMax, onChange }: PriceRangeProps) => {
  const [range, setRange] = useState<[number, number]>([
    priceMin ?? MIN,
    priceMax ?? MAX,
  ]);

  useEffect(() => {
    setRange([priceMin ?? MIN, priceMax ?? MAX]);
  }, [priceMin, priceMax]);

  const handleChangeComplete = (value: number | number[]) => {
    const [min, max] = value as [number, number];
    onChange({
      priceMin: min > MIN ? min : undefined,
      priceMax: max < MAX ? max : undefined,
    });
  };

  return (
    <div className="range-wrapper">
      <Slider
        range
        max={MAX}
        min={MIN}
        step={100_000}
        value={range}
        onChange={(value) => setRange(value as [number, number])}
        onChangeComplete={handleChangeComplete}
      />
      <div className="d-flex align-items-center">
        <span>{formatPrice(range[0])} ₺</span>
        <i className="fa-sharp fa-solid fa-minus mx-2 dark-color icon" />
        <span>{formatPrice(range[1])} ₺</span>
      </div>
    </div>
  );
};

export default PriceRange;
