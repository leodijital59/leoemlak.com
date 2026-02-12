interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    if (start > 2) pages.push("ellipsis");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("ellipsis");

    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="mbp_pagination text-center">
      <ul className="page_navigation">
        <li className="page-item">
          <span
            className={`page-link pointer${page <= 1 ? " disabled" : ""}`}
            onClick={() => page > 1 && handlePageChange(page - 1)}
          >
            <span className="fas fa-angle-left" />
          </span>
        </li>

        {getPageNumbers().map((item, idx) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${idx}`} className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          ) : (
            <li
              key={item}
              className={`page-item${item === page ? " active" : ""}`}
            >
              <span
                className="page-link pointer"
                onClick={() => handlePageChange(item)}
              >
                {item}
              </span>
            </li>
          )
        )}

        <li className="page-item">
          <span
            className={`page-link pointer${page >= totalPages ? " disabled" : ""}`}
            onClick={() => page < totalPages && handlePageChange(page + 1)}
          >
            <span className="fas fa-angle-right" />
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
