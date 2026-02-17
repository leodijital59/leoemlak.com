import { useNavigate } from "@tanstack/react-router";
import SelectDropdown from "./SelectDropdown";

interface HeroContentProps {
  categories: { id: string; name: string; parentId: string | null }[];
  listingType: "sold" | "rented";
  onListingTypeChange: (value: "sold" | "rented") => void;
  q: string;
  onQChange: (value: string) => void;
  categoryId: string | undefined;
  onCategoryIdChange: (value: string | undefined) => void;
}

const HeroContent = ({
  categories,
  listingType,
  onListingTypeChange,
  q,
  onQChange,
  categoryId,
  onCategoryIdChange,
}: HeroContentProps) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate({
      to: "/properties",
      search: {
        listingType,
        q: q.trim() || undefined,
        categoryId,
      },
    });
  };

  const tabs = [
    { id: "sold" as const, label: "Satılık" },
    { id: "rented" as const, label: "Kiralık" },
  ];

  return (
    <div className="advance-style2 mt80 mt0-md mb60 mx-auto" data-aos="fade-up">
      <ul className="nav nav-tabs p-0">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${listingType === tab.id ? "active" : ""}`}
              onClick={() => onListingTypeChange(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            className={`${listingType === tab.id ? "active" : ""} tab-pane`}
            key={tab.id}
          >
            <div className="advance-content-style2">
              <div className="row align-items-center justify-content-start justify-content-md-center">
                <div className="col-md-5 col-lg-5">
                  <div className="advance-search-field position-relative text-start bdrr1 bdrrn-sm bb1-sm">
                    <form className="form-search position-relative" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                      <div className="box-search">
                        <span className="icon flaticon-home-1" />
                        <input
                          className="form-control "
                          type="text"
                          name="search"
                          placeholder={`${tab.label} için anahtar kelime girin`}
                          value={q}
                          onChange={(e) => onQChange(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                {/* End .col-md-6 */}

                <div className="col-md-3 col-lg-3 ps-md-0">
                  <div className="bdrr1 bdrrn-sm pe-0 pe-lg-3 bb1-sm">
                    <div className="bootselect-multiselect">
                      <SelectDropdown
                        categories={categories}
                        value={categoryId}
                        onChange={onCategoryIdChange}
                      />
                    </div>
                  </div>
                </div>
                {/* End .col-md-3 */}

                <div className="col-md-4 col-lg-4">
                  <div className="d-flex align-items-center justify-content-start justify-content-md-between mt-3 mt-md-0">
                    <button
                      className="advance-search-btn"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#advanceSeachModal"
                    >
                      <span className="flaticon-settings" /> Diğer Seçenekler
                    </button>
                    <button
                      className="advance-search-icon ud-btn btn-thm"
                      type="button"
                      onClick={handleSearch}
                    >
                      <span className="flaticon-search" />
                    </button>
                  </div>
                </div>
                {/* End .col-md-64 */}
              </div>
            </div>
          </div>
        ))}
      </div>{" "}
      {/* End tab-content */}
    </div>
  );
};

export default HeroContent;
