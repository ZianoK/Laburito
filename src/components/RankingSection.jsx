import React from 'react';
import { Star, Award } from 'lucide-react';
import './RankingSection.css';

const RankingSection = ({ topServices }) => {
    return (
        <div className="ranking-section">
            <div className="ranking-header">
                <Award className="award-icon" />
                <h2>Mejores del Mes</h2>
            </div>

            <div className="ranking-list">
                {topServices.slice(0, 3).map((service, index) => (
                    <div key={service.id} className="ranking-item">
                        <div className={`rank-number rank-${index + 1}`}>{index + 1}</div>
                        <img src={service.image} alt={service.name} className="rank-avatar" />
                        <div className="rank-info">
                            <h4>{service.name}</h4>
                            <p>{service.category}</p>
                            <div className="rank-rating">
                                <Star size={14} fill="#ffc107" color="#ffc107" />
                                <span>{service.rating}</span>
                            </div>
                        </div>
                        <div className="rank-badge">
                            TOP
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RankingSection;
