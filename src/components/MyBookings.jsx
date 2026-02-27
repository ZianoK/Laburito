import React, { useState } from 'react';
import { useBookings, useUpdateBookingStatus } from '../features/bookings/bookings.hooks';
import { BOOKING_STATUS } from '../features/bookings/bookings.schemas';
import { Calendar, Clock, DollarSign, XCircle, AlertCircle } from 'lucide-react';

import { useCurrentUser } from '../features/auth/useCurrentUser';

const MyBookings = ({ onNavigate }) => {
    const { user } = useCurrentUser();
    const { data: allBookings = [], isLoading } = useBookings();
    const { mutate: updateStatus } = useUpdateBookingStatus();
    const [activeTab, setActiveTab] = useState('pending');

    if (isLoading) return <div className="p-8 text-center">Cargando contrataciones...</div>;

    // Filter Logic - explictly enforce matching clientId
    const bookings = allBookings.filter(b => b.clientId === user?.id);
    const pending = bookings.filter(b => b.status === BOOKING_STATUS.PENDING_CONFIRMATION);
    const active = bookings.filter(b => b.status === BOOKING_STATUS.CONFIRMED || b.status === BOOKING_STATUS.IN_PROGRESS);
    const history = bookings.filter(b => b.status === BOOKING_STATUS.COMPLETED || b.status === BOOKING_STATUS.CANCELLED);

    const handleCancel = (bookingId) => {
        if (window.confirm('¿Estás seguro que querés cancelar esta contratación?')) {
            updateStatus({ bookingId, newStatus: BOOKING_STATUS.CANCELLED });
        }
    };

    const renderBookingCard = (booking) => (
        <div key={booking.id} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '15px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: '1px solid #eee'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{booking.serviceName || 'Servicio sin nombre'}</h3>
                    <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
                        Proveedor: <strong>{booking.providerName || booking.serviceTitle || 'Desconocido'}</strong>
                    </p>
                </div>
                <StatusBadge status={booking.status} />
            </div>

            <hr style={{ borderTop: '1px solid #f0f0f0', margin: '15px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', fontSize: '0.9rem', color: '#555' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} color="#888" />
                    <span>{booking.dates ? booking.dates.join(', ') : 'Fecha a coordinar'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="#888" />
                    <span>Creado: {new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#333' }}>
                    <DollarSign size={16} color="var(--primary)" />
                    <span>Total: ${booking.totalAmount?.toLocaleString()}</span>
                </div>
            </div>

            {/* Actions */}
            {(booking.status === BOOKING_STATUS.PENDING_CONFIRMATION || booking.status === BOOKING_STATUS.CONFIRMED) && booking.clientId === user?.id && (
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => handleCancel(booking.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'white', border: '1px solid #ef4444', color: '#ef4444',
                            padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem'
                        }}
                    >
                        <XCircle size={16} /> Cancelar Contratación
                    </button>
                </div>
            )}
        </div>
    );

    const renderList = (list, emptyMessage) => {
        if (list.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '12px', color: '#666' }}>
                    <AlertCircle size={40} color="#ccc" style={{ marginBottom: '10px' }} />
                    <p>{emptyMessage}</p>
                    <button
                        onClick={() => onNavigate('home')}
                        style={{ marginTop: '15px', background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Buscar Servicios
                    </button>
                </div>
            );
        }
        return list.map(renderBookingCard);
    };

    const tabStyle = (id) => ({
        padding: '10px 20px',
        cursor: 'pointer',
        borderBottom: activeTab === id ? '2px solid var(--primary)' : '2px solid transparent',
        color: activeTab === id ? 'var(--primary)' : '#666',
        fontWeight: activeTab === id ? '600' : '400',
        background: 'none',
        border: 'none',
        borderBottom: activeTab === id ? '2px solid var(--primary)' : '2px solid transparent',
        fontSize: '1rem'
    });

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>📦 Mis Contrataciones</h2>
                <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>
                    Volver al inicio
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee' }}>
                <button style={tabStyle('pending')} onClick={() => setActiveTab('pending')}>
                    Pendientes ({pending.length})
                </button>
                <button style={tabStyle('active')} onClick={() => setActiveTab('active')}>
                    Activas ({active.length})
                </button>
                <button style={tabStyle('history')} onClick={() => setActiveTab('history')}>
                    Historial ({history.length})
                </button>
            </div>

            {/* Content */}
            <div>
                {activeTab === 'pending' && renderList(pending, "No tenés solicitudes pendientes.")}
                {activeTab === 'active' && renderList(active, "No tenés servicios activos en este momento.")}
                {activeTab === 'history' && renderList(history, "No tenés historial de contrataciones aún.")}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        [BOOKING_STATUS.PENDING_CONFIRMATION]: { bg: '#fff7ed', color: '#c2410c', label: 'Pendiente' },
        [BOOKING_STATUS.CONFIRMED]: { bg: '#eff6ff', color: '#1d4ed8', label: 'Confirmado' },
        [BOOKING_STATUS.IN_PROGRESS]: { bg: '#f0fdf4', color: '#15803d', label: 'En Progreso' },
        [BOOKING_STATUS.COMPLETED]: { bg: '#f0fdf4', color: '#15803d', label: 'Completado' },
        [BOOKING_STATUS.CANCELLED]: { bg: '#fef2f2', color: '#b91c1c', label: 'Cancelado' }
    };

    const config = styles[status] || styles[BOOKING_STATUS.PENDING_CONFIRMATION];

    return (
        <span style={{
            background: config.bg,
            color: config.color,
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: `1px solid ${config.color}20`
        }}>
            {config.label}
        </span>
    );
};

export default MyBookings;
