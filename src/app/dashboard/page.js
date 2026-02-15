'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import ProductTable from '@/components/ProductTable';
import ProductModal from '@/components/ProductModal';
import Pagination from '@/components/Pagination';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');

    // Product state
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters & pagination
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(10);
    const [sort, setSort] = useState('created_at');
    const [order, setOrder] = useState('desc');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    // Delete confirm
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Success message
    const [successMsg, setSuccessMsg] = useState('');

    // Auth check
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (!storedToken) {
            router.push('/');
            return;
        }
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
    }, [router]);

    // Fetch products
    const fetchProducts = useCallback(async () => {
        if (!token) return;
        setLoading(true);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                sort,
                order,
            });

            if (search) params.append('search', search);
            if (categoryFilter) params.append('category', categoryFilter);

            const res = await fetch(`/api/products?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) {
                handleLogout();
                return;
            }

            const data = await res.json();
            setProducts(data.products || []);
            setTotal(data.pagination?.total || 0);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    }, [token, page, limit, sort, order, search, categoryFilter]);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        if (!token) return;

        try {
            const res = await fetch('/api/categories', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setCategories(data.categories || []);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    }, [token]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Clear success after 3s
    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => setSuccessMsg(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMsg]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    const handleSort = (column) => {
        if (sort === column) {
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            setSort(column);
            setOrder('asc');
        }
        setPage(1);
    };

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleCategoryChange = (value) => {
        setCategoryFilter(value);
        setPage(1);
    };

    const handleAddProduct = () => {
        setEditProduct(null);
        setShowModal(true);
    };

    const handleEditProduct = (product) => {
        setEditProduct(product);
        setShowModal(true);
    };

    const handleProductSaved = () => {
        setShowModal(false);
        setEditProduct(null);
        setSuccessMsg(editProduct ? 'Product updated successfully!' : 'Product added successfully!');
        fetchProducts();
        fetchCategories();
    };

    const handleDeleteClick = (product) => {
        setDeleteTarget(product);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);

        try {
            const res = await fetch(`/api/products/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                setSuccessMsg('Product deleted successfully!');
                setDeleteTarget(null);
                fetchProducts();
                fetchCategories();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete');
            }
        } catch {
            alert('Network error');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Stats
    const totalProducts = total;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockCount = products.filter((p) => p.stock <= 10).length;
    const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * (p.stock || 0)), 0);

    if (!user) {
        return (
            <div className="page-loading">
                <div className="spinner spinner-lg"></div>
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <>
            <Navbar user={user} onLogout={handleLogout} />

            <div className="page-container">
                {/* Success Alert */}
                {successMsg && (
                    <div className="alert alert-success" id="success-alert" style={{ marginBottom: '1rem' }}>
                        <span>✓</span> {successMsg}
                    </div>
                )}

                {/* Header */}
                <div className="dashboard-header">
                    <h1 className="dashboard-title" id="dashboard-title">
                        <span>Product</span> Inventory
                    </h1>
                    <button className="btn btn-primary" onClick={handleAddProduct} id="add-product-btn">
                        + Add Product
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-row" id="stats-row">
                    <div className="stat-card">
                        <div className="stat-label">Total Products</div>
                        <div className="stat-value" id="stat-total-products">{totalProducts}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Stock</div>
                        <div className="stat-value" id="stat-total-stock">{totalStock.toLocaleString()}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Low Stock</div>
                        <div className="stat-value" id="stat-low-stock">{lowStockCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Inventory Value</div>
                        <div className="stat-value" id="stat-total-value">
                            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <SearchBar
                    search={search}
                    onSearchChange={handleSearch}
                    category={categoryFilter}
                    onCategoryChange={handleCategoryChange}
                    categories={categories}
                />

                {/* Table */}
                {loading ? (
                    <div className="page-loading" style={{ minHeight: '40vh' }}>
                        <div className="spinner spinner-lg"></div>
                        <span>Loading products...</span>
                    </div>
                ) : (
                    <>
                        <ProductTable
                            products={products}
                            sort={sort}
                            order={order}
                            onSort={handleSort}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteClick}
                        />

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            total={total}
                            limit={limit}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>

            {/* Product Modal */}
            {showModal && (
                <ProductModal
                    product={editProduct}
                    categories={categories}
                    token={token}
                    onClose={() => {
                        setShowModal(false);
                        setEditProduct(null);
                    }}
                    onSaved={handleProductSaved}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
                    <div className="modal" id="delete-modal" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete Product</h2>
                            <button className="modal-close" onClick={() => setDeleteTarget(null)} id="delete-cancel-x">
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="confirm-dialog">
                                <div className="confirm-icon">⚠️</div>
                                <p className="confirm-message">Are you sure you want to delete this product?</p>
                                <p className="confirm-name" id="delete-product-name">{deleteTarget.name}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ justifyContent: 'center' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setDeleteTarget(null)}
                                id="delete-cancel-btn"
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteConfirm}
                                disabled={deleteLoading}
                                id="delete-confirm-btn"
                            >
                                {deleteLoading ? (
                                    <span className="loading-spinner"><span className="spinner"></span></span>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
