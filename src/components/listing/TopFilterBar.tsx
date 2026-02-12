import { sortOptions } from "@/lib/validations/property-search";

interface TopFilterBarProps {
  total: number;
  sort?: string;
  onSortChange: (sort: string | undefined) => void;
}

const TopFilterBar = ({ total, sort, onSortChange }: TopFilterBarProps) => {
  return (
    <div className="row align-items-center mb20">
      <div className="col-sm-6">
        <div className="text-center text-sm-start">
          <p className="pagination_page_count mb-0">
            Toplam <strong>{total}</strong> ilan bulundu
          </p>
        </div>
      </div>
      <div className="col-sm-6">
        <div className="page_control_shorting d-flex align-items-center justify-content-center justify-content-sm-end">
          <div className="pcs_dropdown">
            <span>Sırala:</span>
            <select
              className="form-select"
              value={sort ?? "newest"}
              onChange={(e) =>
                onSortChange(
                  e.target.value === "newest" ? undefined : e.target.value
                )
              }
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopFilterBar;
