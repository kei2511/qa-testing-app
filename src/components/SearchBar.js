'use client';

export default function SearchBar({ search, onSearchChange, category, onCategoryChange, categories }) {
    return (
        <div className="toolbar" id="toolbar">
            <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    id="search-input"
                />
            </div>

            <select
                className="filter-select"
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                id="category-filter"
            >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
