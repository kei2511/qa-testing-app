'use client';

import { useState, useEffect } from 'react';

export default function ProductModal({ product, categories, token, onClose, onSaved }) {
    const isEdit = !!product;

    const [name, setName] = useState(product?.name || '');
    const [description, setDescription] = useState(product?.description || '');
    const [price, setPrice] = useState(product?.price || '');
    const [stock, setStock] = useState(product?.stock ?? '');
    const [categoryId, setCategoryId] = useState(product?.category_id || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payload = {
            name: name.trim(),
            description: description.trim() || null,
            price: parseFloat(price),
            stock: parseInt(stock, 10) || 0,
            category_id: categoryId ? parseInt(categoryId, 10) : null,
        };

        // Client-side validation
        if (!payload.name) {
            setError('Product name is required');
            setLoading(false);
            return;
        }

        if (isNaN(payload.price) || payload.price < 0) {
            setError('Price must be a valid positive number');
            setLoading(false);
            return;
        }

        if (payload.stock < 0) {
            setError('Stock cannot be negative');
            setLoading(false);
            return;
        }

        try {
            const url = isEdit ? `/api/products/${product.id}` : '/api/products';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to save product');
                return;
            }

            onSaved(data.product);
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" id="product-modal">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button className="modal-close" onClick={onClose} id="modal-close">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} id="product-form">
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-error" id="product-modal-error">
                                <span>⚠</span> {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="product-name">Product Name *</label>
                            <input
                                id="product-name"
                                className="form-input"
                                type="text"
                                placeholder="Enter product name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="product-description">Description</label>
                            <textarea
                                id="product-description"
                                className="form-input"
                                placeholder="Enter product description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                style={{ resize: 'vertical', minHeight: '80px' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="product-price">Price ($) *</label>
                                <input
                                    id="product-price"
                                    className="form-input"
                                    type="number"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="product-stock">Stock</label>
                                <input
                                    id="product-stock"
                                    className="form-input"
                                    type="number"
                                    placeholder="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="product-category">Category</label>
                            <select
                                id="product-category"
                                className="form-select"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} id="modal-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading} id="product-submit">
                            {loading ? (
                                <span className="loading-spinner"><span className="spinner"></span></span>
                            ) : isEdit ? (
                                'Update Product'
                            ) : (
                                'Add Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
