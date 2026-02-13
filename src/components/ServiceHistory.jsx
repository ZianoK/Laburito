import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useBookings } from '../features/bookings/bookings.hooks';
import { BOOKING_STATUS } from '../features/bookings/bookings.schemas';

const ServiceHistory = ({ onNavigate }) => {
    const { data: bookings = [] } = useBookings();

    // Filter for history (Completed or Cancelled)
    const historyOrders = bookings.filter(b =>
        b.status === BOOKING_STATUS.COMPLETED ||
        b.status === BOOKING_STATUS.CANCELLED
    );

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
        borderLeft: '4px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: 0.9
    };

    if (historyOrders.length === 0) {
        return (
            <div style={{ ...containerStyle, textAlign: 'center', marginTop: '50px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px', filter: 'grayscale(1)' }}>📅</div>
                <h2>Tu historial está vacío</h2>
                <p style={{ color: '#666' }}>Los servicios finalizados aparecerán acá.</p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h2 style={{ marginBottom: '20px' }}>Historial de Servicios ({historyOrders.length})</h2>

            {historyOrders.map(order => (
                <div key={order.id} style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img
                            src={order.serviceImage}
                            alt={order.serviceName}
                            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(0.5)' }}
                        />
                        <div>
                            <h3 style={{ margin: 0, color: '#333' }}>{order.serviceTitle || order.serviceName}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                <span style={{ color: '#666', fontSize: '0.9rem' }}>{order.serviceName}</span>
                                <span style={{ color: '#ccc' }}>•</span>
                                <span style={{ fontSize: '0.85rem', color: '#999' }}>
                                    {order.status === BOOKING_STATUS.CANCELLED ? 'Cancelado' : 'Finalizado'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#333' }}>
                            ${(order.totalAmount || order.price || 0).toLocaleString()}
                        </div>
                        <button
                            onClick={() => onNavigate('home')} // Simplified re-hire
                            style={{
                                marginTop: '8px',
                                padding: '6px 12px',
                                background: 'none',
                                border: '1px solid var(--primary)',
                                borderRadius: '20px',
                                color: 'var(--primary)',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginLeft: 'auto'
                            }}
                        >
                            <RotateCcw size={14} /> Contratar de nuevo
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServiceHistory;
