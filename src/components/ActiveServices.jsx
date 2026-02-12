import React from 'react';
import { Calendar, Clock, DollarSign, CheckCircle } from 'lucide-react';

const ActiveServices = ({ orders, onComplete, onNavigate }) => {
    const activeOrders = orders.filter(o => o.status === 'active');

    const containerStyle = {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        borderLeft: '4px solid var(--primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const infoGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px'
    };

    if (activeOrders.length === 0) {
        return (
            <div style={{ ...containerStyle, textAlign: 'center', marginTop: '50px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛠️</div>
                <h2>No tenés servicios activos</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>Cuando contrates un servicio, aparecerá acá para que puedas ver su estado.</p>
                <button
                    onClick={() => onNavigate('home')}
                    style={{
                        padding: '12px 24px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    Buscar Servicios
                </button>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h2 style={{ marginBottom: '20px' }}>Servicios Activos ({activeOrders.length})</h2>

            {activeOrders.map(order => (
                <div key={order.id} style={cardStyle}>
                    <div style={headerStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <img
                                src={order.service.image}
                                alt={order.service.name}
                                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                                <h3 style={{ margin: 0 }}>{order.service.serviceTitle}</h3>
                                <p style={{ margin: '4px 0 0', color: '#666', fontSize: '0.9rem' }}>{order.service.name}</p>
                            </div>
                        </div>
                        <span style={{
                            background: '#e3f2fd',
                            color: '#1976d2',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                        }}>
                            En Progreso
                        </span>
                    </div>

                    <div style={infoGridStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                            <Calendar size={18} />
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#999' }}>Inicio</span>
                                <span style={{ fontSize: '0.9rem' }}>{new Date(order.startDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                            <Clock size={18} />
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#999' }}>Fin Estimado</span>
                                <span style={{ fontSize: '0.9rem' }}>{new Date(order.estimatedEndDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                            <DollarSign size={18} />
                            <div>
                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#999' }}>Precio Total</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>${order.price.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button style={{
                            padding: '10px 16px',
                            background: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: '#666'
                        }}>
                            Contactar
                        </button>
                        <button
                            onClick={() => onComplete(order.id)}
                            style={{
                                padding: '10px 16px',
                                background: '#2ecc71',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontWeight: '600'
                            }}
                        >
                            <CheckCircle size={18} /> Finalizar Servicio
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActiveServices;
