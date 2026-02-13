import React from 'react';
import { Calendar, Clock, DollarSign, Check, X, AlertCircle } from 'lucide-react';
import { useProviderBookings, useUpdateBookingStatus } from '../features/bookings/bookings.hooks';
import { BOOKING_STATUS } from '../features/bookings/bookings.schemas';

const IncomingRequests = ({ onNavigate }) => {
    const { data: bookings = [], isLoading } = useProviderBookings();
    const { mutate: updateStatus } = useUpdateBookingStatus();

    // Filter for PENDING_CONFIRMATION
    const pendingRequests = bookings.filter(b => b.status === BOOKING_STATUS.PENDING_CONFIRMATION);

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
        borderLeft: '4px solid #f39c12', // Orange for pending
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
        background: '#fff8e1', // Light orange bg
        padding: '15px',
        borderRadius: '8px'
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '40px' }}>Cargando solicitudes...</div>;

    if (pendingRequests.length === 0) {
        return (
            <div style={{ ...containerStyle, textAlign: 'center', marginTop: '50px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📬</div>
                <h2>No hay solicitudes pendientes</h2>
                <p style={{ color: '#666' }}>Te avisaremos cuando alguien quiera contratar tus servicios.</p>
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
                    Volver al Inicio
                </button>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h2 style={{ marginBottom: '20px' }}>Solicitudes Pendientes ({pendingRequests.length})</h2>

            {pendingRequests.map(booking => {
                const startDate = booking.dates && booking.dates.length > 0 ? booking.dates[0] : booking.createdAt;

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
                                    <p style={{ margin: '4px 0 0', color: '#666', fontSize: '0.9rem' }}>Cliente: {booking.clientId}</p>
                                </div>
                            </div>
                            <span style={{
                                background: '#fef5e7',
                                color: '#f39c12',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <AlertCircle size={14} /> Nueva Solicitud
                            </span>
                        </div>

                        <div style={infoGridStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                                <Calendar size={18} />
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#999' }}>Fechas Solicitadas</span>
                                    <span style={{ fontSize: '0.9rem' }}>{booking.dates?.length || 1} día(s) desde {new Date(startDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                                <Clock size={18} />
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#999' }}>Opción</span>
                                    <span style={{ fontSize: '0.9rem' }}>{booking.selectedOption?.label || booking.selectedOption?.name}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                                <DollarSign size={18} />
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#999' }}>Total Estimado</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>${(booking.totalAmount || booking.price || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                            <button
                                onClick={() => updateStatus({ id: booking.id, status: BOOKING_STATUS.CANCELLED })}
                                style={{
                                    padding: '10px 16px',
                                    background: 'white',
                                    border: '1px solid #e74c3c',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: '#e74c3c',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontWeight: '600'
                                }}
                            >
                                <X size={18} /> Rechazar
                            </button>
                            <button
                                onClick={() => updateStatus({ id: booking.id, status: BOOKING_STATUS.CONFIRMED })}
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
                                <Check size={18} /> Aceptar Solicitud
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default IncomingRequests;
