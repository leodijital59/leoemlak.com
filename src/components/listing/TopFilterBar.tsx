import { sortOptions } from "@/lib/validations/property-search";
import {cn} from "@udecode/cn";

type ViewMode = "grid" | "map";

interface TopFilterBarProps {
  total: number;
  sort?: string;
  onSortChange: (sort: string | undefined) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const TopFilterBar = ({
  total,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
}: TopFilterBarProps) => {
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
        <div className="page_control_shorting d-flex align-items-center justify-content-center justify-content-sm-end gap-2">
          <div className="pcs_dropdown d-flex align-items-center gap-2">
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
          <div className="btn-group" role="group" aria-label="Görünüm modu">
            <button
              type="button"
              className={cn("btn", viewMode === "grid" ? "btn-apple" : "btn-outline-dark")}
              onClick={() => onViewModeChange("grid")}
              title="Liste görünümü"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              type="button"
              className={cn("btn", viewMode === "map" ? "btn-apple" : "btn-outline-dark")}
              onClick={() => onViewModeChange("map")}
              title="Harita görünümü"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopFilterBar;
export type { ViewMode };
