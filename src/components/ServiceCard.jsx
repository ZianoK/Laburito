import React, { useState, useRef, useEffect } from 'react';
import { Heart, Star, MapPin, MessageCircle, Phone, Mail, UserCheck, ShoppingCart } from 'lucide-react';
import { PRESTIGE_LEVELS } from '../data/mockData';
import './ServiceCard.css';

const ServiceCard = ({ service, isFavorite, onToggleFavorite, onHire, onAddToCart, isInCart }) => {
    const prestige = PRESTIGE_LEVELS[service.prestige] || PRESTIGE_LEVELS.BRONZE;
    const [showContact, setShowContact] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setShowContact(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="service-card" ref={cardRef}>
            <div className="card-image-container">
                <img src={service.image} alt={service.serviceTitle} className="card-image" />
                <button
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(service.id);
                    }}
                >
                    <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>
            </div>

            <div className="card-content">
                <div className="provider-info">
                    <span className="provider-name">{service.name}</span>
                    <span
                        className="prestige-badge"
                        style={{ backgroundColor: prestige.color }}
                    >
                        {prestige.label}
                    </span>
                </div>

                <h3 className="service-title">{service.serviceTitle}</h3>

                <div className="rating-row">
                    <Star className="star-icon" fill="currentColor" />
                    <span>{service.rating}</span>
                    <span style={{ color: '#999' }}>({service.reviews} trabajos)</span>
                </div>

                <div className="card-footer">
                    <div className="price-tag">${service.price}</div>
                    <div className="location-tag">
                        <MapPin size={14} />
                        <span>{service.location.address}</span>
                    </div>
                </div>

                <div className="card-actions">
                    <button
                        className="action-btn btn-contact"
                        onClick={() => setShowContact(!showContact)}
                    >
                        <MessageCircle size={18} />
                        Contactar
                        {showContact && (
                            <div className="contact-popover">
                                {service.contact?.whatsapp && (
                                    <a href={`https://wa.me/${service.contact.whatsapp}`} target="_blank" rel="noreferrer" className="contact-item">
                                        <MessageCircle size={16} color="#25D366" /> WhatsApp
                                    </a>
                                )}
                                {service.contact?.phone && (
                                    <a href={`tel:${service.contact.phone}`} className="contact-item">
                                        <Phone size={16} color="#007bff" /> Llamar
                                    </a>
                                )}
                                {service.contact?.email && (
                                    <a href={`mailto:${service.contact.email}`} className="contact-item">
                                        <Mail size={16} color="#dc3545" /> Email
                                    </a>
                                )}
                            </div>
                        )}
                    </button>

                    <button
                        className={`action-btn btn-cart ${isInCart ? 'in-cart' : ''}`}
                        onClick={() => onAddToCart && onAddToCart(service)}
                        disabled={isInCart}
                        title={isInCart ? "Ya en carrito" : "Agregar al carrito"}
                    >
                        <ShoppingCart size={18} />
                    </button>

                    <button className="action-btn btn-hire" onClick={() => onHire && onHire(service)}>
                        <UserCheck size={18} />
                        Contratar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
