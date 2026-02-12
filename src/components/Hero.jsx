import React from 'react';
import { Search, MapPin } from 'lucide-react';
import './Hero.css';

const Hero = ({ onSearch }) => {
    return (
        <div className="hero-container">
            <div className="hero-content">
                <h1>Encontrá al profesional ideal<br />para tu hogar</h1>
                <p className="hero-subtitle">Plomeros, electricistas, jardineros y más, cerca tuyo.</p>

                <div className="hero-search-box">
                    <div className="input-group">
                        <Search className="input-icon" size={20} />
                        <input
                            type="text"
                            placeholder="¿Qué servicio buscás?"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                    <div className="divider"></div>
                    <div className="input-group">
                        <MapPin className="input-icon" size={20} />
                        <input type="text" placeholder="Ubicación" defaultValue="Buenos Aires" />
                    </div>
                    <button className="search-btn">Buscar</button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
