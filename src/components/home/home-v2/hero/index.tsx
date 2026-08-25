import { ClientOnly } from "@tanstack/react-router";
import { useState } from "react";


import HeroContent from "./HeroContent";

import AdvanceFilterModal from "@/components/common/advance-filter";

interface HeroProps {
  categories: { id: string; name: string; parentId: string | null }[];
  locations: {
    provinces: string[];
    districts: { province: string; district: string }[];
    neighborhoods: {
      province: string;
      district: string;
      neighborhood: string;
    }[];
  };
  features: { id: string; name: string }[];
}

const Hero = ({ categories, locations, features }: HeroProps) => {
  const [listingType, setListingType] = useState<"sold" | "rented">("sold");
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();

  return (
    <ClientOnly>
      <div className="inner-banner-style2 text-center position-relative">
        <HeroContent
          categories={categories}
          listingType={listingType}
          onListingTypeChange={setListingType}
          q={q}
          onQChange={setQ}
          categoryId={categoryId}
          onCategoryIdChange={setCategoryId}
        />

        <h1 className="hero-title" data-aos="fade-up" data-aos-delay="150">
          Tekirdağ Çorlu Emlak — Satılık ve Kiralık İlanlar
        </h1>

        <p className="hero-text fz15" data-aos="fade-up" data-aos-delay="250">
          Leo Emlak ile Tekirdağ ve Çorlu'da satılık daire, kiralık konut, villa,
          arsa ve işyeri ilanlarını ilçeye göre filtreleyin
        </p>

        {/* Geçici test alanı */}
      
      </div>

      <div className="advance-feature-modal">
        <div
          className="modal fade"
          id="advanceSeachModal"
          tabIndex={-1}
          aria-labelledby="advanceSeachModalLabel"
          aria-hidden="true"
        >
          <AdvanceFilterModal
            locations={locations}
            features={features}
            listingType={listingType}
            q={q}
            categoryId={categoryId}
          />
        </div>
      </div>
    </ClientOnly>
  );
};

export default Hero;