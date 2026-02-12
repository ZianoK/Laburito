import React, { useMemo, useState } from 'react';
import FilterBar from './FilterBar';
import ServiceCard from './ServiceCard';
import './FavoritesPage.css';

const FavoritesPage = ({ favorites, services, onToggleFavorite, onHire }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('rating');

    const favoriteServices = useMemo(() => {
        return services.filter(service => favorites.includes(service.id));
    }, [favorites, services]);

    const filteredFavorites = useMemo(() => {
        let result = [...favoriteServices];

        // Filter by Category
        if (selectedCategory !== 'all') {
            result = result.filter(s => s.category === selectedCategory);
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'price_asc') return a.price - b.price;
            if (sortBy === 'price_desc') return b.price - a.price;
            if (sortBy === 'reviews') return b.reviews - a.reviews;
            return 0;
        });

        return result;
    }, [favoriteServices, selectedCategory, sortBy]);

    return (
        <div className="favorites-page">
            <div className="favorites-header">
                <h2>Mis Favoritos</h2>
                <p>Gestioná los servicios que más te gustaron.</p>
            </div>

            <FilterBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            <div className="favorites-grid">
                {filteredFavorites.length > 0 ? (
                    filteredFavorites.map(service => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            isFavorite={true}
                            onToggleFavorite={onToggleFavorite}
                            onHire={onHire}
                        />
                    ))
                ) : (
                    <div className="no-favorites">
                        {favoriteServices.length === 0
                            ? "Aún no tenés servicios guardados en favoritos."
                            : "No hay favoritos en esta categoría."}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
