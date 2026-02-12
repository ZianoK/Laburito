import React from 'react';
import { CATEGORIES } from '../data/mockData';
import './FilterBar.css';

const FilterBar = ({ selectedCategory, onSelectCategory, sortBy, setSortBy }) => {
    return (
        <div className="filter-container">
            <div className="categories-list">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => onSelectCategory(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="sort-controls">
                <label>Ordenar por:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                    <option value="rating">Mejor Valorados</option>
                    <option value="price_asc">Menor Precio</option>
                    <option value="price_desc">Mayor Precio</option>
                    <option value="reviews">Más Trabajos</option>
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
