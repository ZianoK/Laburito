import React from 'react';
import { Calendar, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { useBookings, useUpdateBookingStatus } from '../features/bookings/bookings.hooks';
import { BOOKING_STATUS } from '../features/bookings/bookings.schemas';

const ActiveServices = ({ onNavigate }) => {
    const { data: bookings = [], isLoading } = useBookings();
    const { mutate: updateStatus } = useUpdateBookingStatus();

    // Filter for active bookings (Pending, Confirmed, In Progress)
    const activeBookings = bookings.filter(b =>
        b.status !== BOOKING_STATUS.COMPLETED &&
        b.status !== BOOKING_STATUS.CANCELLED
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

    const getStatusLabel = (status) => {
        switch (status) {
            case BOOKING_STATUS.PENDING_CONFIRMATION: return { label: 'Pendiente', color: '#f39c12', bg: '#fef5e7' };
            case BOOKING_STATUS.CONFIRMED: return { label: 'Confirmado', color: '#3498db', bg: '#e8f6f3' };
            case BOOKING_STATUS.IN_PROGRESS: return { label: 'En Progreso', color: '#1976d2', bg: '#e3f2fd' };
            default: return { label: status, color: '#666', bg: '#eee' };
        }
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '40px' }}>Cargando servicios...</div>;

    if (activeBookings.length === 0) {
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
            <h2 style={{ marginBottom: '20px' }}>Servicios Activos ({activeBookings.length})</h2>

            {activeBookings.map(booking => {
                const statusMeta = getStatusLabel(booking.status);
                const startDate = booking.dates && booking.dates.length > 0 ? booking.dates[0] : booking.createdAt;
                const endDate = booking.dates && booking.dates.length > 0 ? booking.dates[booking.dates.length - 1] : 'Pendiente';

                return (
                    <div key={booking.id} style={cardStyle}>
                        <div style={headerStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img
                                    src={booking.serviceImage}
                                    alt={booking.serviceName}
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <div>
                                    <h3 style={{ margin: 0 }}>{booking.serviceTitle || booking.serviceName}</h3>
                                    <p style={{ margin: '4px 0 0', color: '#666', fontSize: '0.9rem' }}>{booking.serviceName}</p>
                                </div>
                            </div>
                            <span style={{
                                background: statusMeta.bg,
                                color: statusMeta.color,
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                            }}>
                                {statusMeta.label}
                            </span>
                        </div>

                        <div style={infoGridStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                                <Calendar size={18} />
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#999' }}>Inicio</span>
                                    <span style={{ fontSize: '0.9rem' }}>{new Date(startDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                                <Clock size={18} />
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#999' }}>Fin / Fechas</span>
                                    <span style={{ fontSize: '0.9rem' }}>{booking.dates?.length || 1} día(s)</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                                <DollarSign size={18} />
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#999' }}>Precio Total</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>${(booking.totalAmount || booking.price || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
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

                                {booking.status === BOOKING_STATUS.IN_PROGRESS && (
                                    <button
                                        onClick={() => updateStatus({ id: booking.id, status: BOOKING_STATUS.COMPLETED })}
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
                                )}
                            </div>

                            {/* DEV MODE CONTROLS */}
                            <div style={{
                                background: '#f0f0f0',
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px dashed #999',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{ fontWeight: 'bold', color: '#666' }}>[DEV MODE] Transiciones:</span>
                                {booking.status === BOOKING_STATUS.PENDING_CONFIRMATION && (
                                    <button onClick={() => updateStatus({ id: booking.id, status: BOOKING_STATUS.CONFIRMED })}>Confirmar</button>
                                )}
                                {booking.status === BOOKING_STATUS.CONFIRMED && (
                                    <button onClick={() => updateStatus({ id: booking.id, status: BOOKING_STATUS.IN_PROGRESS })}>Iniciar</button>
                                )}
                                {(booking.status === BOOKING_STATUS.CONFIRMED || booking.status === BOOKING_STATUS.IN_PROGRESS) && (
                                    <button onClick={() => updateStatus({ id: booking.id, status: BOOKING_STATUS.CANCELLED })} style={{ color: 'red' }}>Cancelar</button>
                                )}
                                {booking.status === BOOKING_STATUS.IN_PROGRESS && (
                                    <button onClick={() => updateStatus({ id: booking.id, status: BOOKING_STATUS.COMPLETED })}>Completar</button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ActiveServices;
