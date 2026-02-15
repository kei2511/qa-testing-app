'use client';

export default function ProductTable({ products, sort, order, onSort, onEdit, onDelete }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const getStockClass = (stock) => {
        if (stock <= 10) return 'stock-low';
        if (stock >= 200) return 'stock-high';
        return 'stock-ok';
    };

    const getSortIndicator = (column) => {
        if (sort !== column) return '';
        return order === 'asc' ? ' ↑' : ' ↓';
    };

    if (!products || products.length === 0) {
        return (
            <div className="table-container">
                <div className="table-empty" id="empty-state">
                    <div className="table-empty-icon">📭</div>
                    <p>No products found</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        Try adjusting your search or add a new product.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="table-container" id="product-table-container">
            <table className="data-table" id="product-table">
                <thead>
                    <tr>
                        <th onClick={() => onSort('name')} className={sort === 'name' ? 'sorted' : ''}>
                            Name{getSortIndicator('name')}
                        </th>
                        <th>Category</th>
                        <th onClick={() => onSort('price')} className={sort === 'price' ? 'sorted' : ''}>
                            Price{getSortIndicator('price')}
                        </th>
                        <th onClick={() => onSort('stock')} className={sort === 'stock' ? 'sorted' : ''}>
                            Stock{getSortIndicator('stock')}
                        </th>
                        <th onClick={() => onSort('created_at')} className={sort === 'created_at' ? 'sorted' : ''}>
                            Created{getSortIndicator('created_at')}
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} id={`product-row-${product.id}`}>
                            <td>
                                <div className="table-product-name">{product.name}</div>
                                {product.description && (
                                    <div className="table-product-desc">{product.description}</div>
                                )}
                            </td>
                            <td>
                                {product.category_name ? (
                                    <span className="table-category">{product.category_name}</span>
                                ) : (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                                )}
                            </td>
                            <td>
                                <span className="table-price">{formatPrice(product.price)}</span>
                            </td>
                            <td>
                                <span className={`table-stock ${getStockClass(product.stock)}`}>
                                    {product.stock}
                                </span>
                            </td>
                            <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                {new Date(product.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </td>
                            <td>
                                <div className="table-actions">
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => onEdit(product)}
                                        id={`edit-product-${product.id}`}
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => onDelete(product)}
                                        id={`delete-product-${product.id}`}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
