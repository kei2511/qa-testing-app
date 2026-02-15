'use client';

export default function Pagination({ page, totalPages, total, limit, onPageChange }) {
    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination" id="pagination">
            <div className="pagination-info">
                Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
                <strong>{total}</strong> products
            </div>

            <div className="pagination-controls">
                <button
                    className="pagination-btn"
                    onClick={() => onPageChange(1)}
                    disabled={page === 1}
                    id="page-first"
                    title="First page"
                >
                    «
                </button>
                <button
                    className="pagination-btn"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    id="page-prev"
                    title="Previous page"
                >
                    ‹
                </button>

                {getPageNumbers().map((p) => (
                    <button
                        key={p}
                        className={`pagination-btn ${p === page ? 'active' : ''}`}
                        onClick={() => onPageChange(p)}
                        id={`page-${p}`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    className="pagination-btn"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    id="page-next"
                    title="Next page"
                >
                    ›
                </button>
                <button
                    className="pagination-btn"
                    onClick={() => onPageChange(totalPages)}
                    disabled={page === totalPages}
                    id="page-last"
                    title="Last page"
                >
                    »
                </button>
            </div>
        </div>
    );
}
