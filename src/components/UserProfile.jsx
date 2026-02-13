import React, { useState } from 'react';
import { User, Phone, MapPin, Shield, Briefcase } from 'lucide-react';
import { useCurrentUser } from '../features/auth/useCurrentUser';
import { usersApi } from '../features/users/users.api';
import { USER_ROLES } from '../features/users/users.schemas';
import { useToast } from './ui/Toast';

const UserProfile = ({ onNavigate }) => {
    const { user, sellerProfile, companyProfile, isReady, switchUser } = useCurrentUser();
    const { addToast } = useToast();

    // Simple local state for edit mode (only for Name/Phone for now)
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });

    // Sync formData when user loads
    React.useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    if (!isReady) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <div className="loading-spinner"></div>
                <p style={{ marginLeft: '10px' }}>Cargando perfil...</p>
            </div>
        );
    }

    const containerStyle = {
        maxWidth: '800px',
        margin: '20px auto',
        padding: '20px'
    };

    // Empty State / Dev User Selection
    if (!user) {
        return (
            <div style={containerStyle}>
                <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Shield size={48} color="#ccc" style={{ marginBottom: '20px' }} />
                    <h2>No hay usuario activo</h2>
                    <p style={{ color: '#666', marginBottom: '30px' }}>Seleccioná un usuario de prueba para continuar:</p>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => switchUser(USER_ROLES.CLIENT)}
                            style={{ padding: '10px 20px', cursor: 'pointer', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px' }}
                        >
                            Cliente (u1)
                        </button>
                        <button
                            onClick={() => switchUser(USER_ROLES.SELLER)}
                            style={{ padding: '10px 20px', cursor: 'pointer', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px' }}
                        >
                            Vendedor (u2)
                        </button>
                        <button
                            onClick={() => switchUser(USER_ROLES.COMPANY)}
                            style={{ padding: '10px 20px', cursor: 'pointer', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px' }}
                        >
                            Empresa (u3)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSave = () => {
        usersApi.update(user.id, formData);
        addToast({ title: 'Perfil actualizado', description: 'Los cambios se han guardado correctamente.', type: 'success' });
        setIsEditing(false);
        // Force reload to reflect changes in hook (simple way)
        window.location.reload();
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginBottom: '20px'
    };

    const roleBadgeStyle = {
        background: '#e0e7ff',
        color: '#4338ca',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
    };

    return (
        <div style={containerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Mi Perfil</h2>
                <button onClick={() => onNavigate('home')}>Volver al inicio</button>
            </div>

            <div style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={40} color="#666" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>{user.name}</h2>
                        <p style={{ color: '#666', margin: '5px 0' }}>{user.email}</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {user.roles && user.roles.map(role => (
                                <span key={role} style={roleBadgeStyle}>
                                    <Shield size={12} /> {role}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <hr style={{ borderTop: '1px solid #eee', margin: '20px 0' }} />

                <div style={{ display: 'grid', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Nombre Completo</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        ) : (
                            <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>{user.name}</div>
                        )}
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Teléfono</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        ) : (
                            <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>{user.phone || 'No especificado'}</div>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={handleSave} style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Guardar Cambios</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Editar Datos</button>
                    )}
                </div>
            </div>

            {/* SELLER PROFILE INFO */}
            {sellerProfile && (
                <div style={cardStyle}>
                    <h3><Briefcase size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Perfil de Vendedor</h3>
                    <p style={{ color: '#666' }}>{sellerProfile.bio}</p>
                    <div style={{ marginTop: '10px' }}>
                        <strong>Habilidades:</strong> {sellerProfile.skills.join(', ')}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <strong>Nivel de Verificación:</strong> {sellerProfile.verificationLevel}
                    </div>
                </div>
            )}

            {/* COMPANY PROFILE INFO */}
            {companyProfile && (
                <div style={cardStyle}>
                    <h3><Briefcase size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Perfil de Empresa</h3>
                    <p style={{ color: '#666' }}>{companyProfile.description}</p>
                    <div style={{ marginTop: '10px' }}>
                        <strong>Empresa:</strong> {companyProfile.companyName}
                    </div>
                </div>
            )}

            {/* DEV TOOLS */}
            <div style={{ marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '1px dashed #ccc' }}>
                <h4 style={{ margin: '0 0 15px 0' }}>🛠️ [DEV MODE] Cambiar Rol de Usuario</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => switchUser(USER_ROLES.CLIENT)}
                        style={{ padding: '8px 12px', cursor: 'pointer', background: user.id === 'u1' ? '#ddd' : 'white', border: '1px solid #ccc', borderRadius: '6px' }}
                    >
                        Usuario Cliente (u1)
                    </button>
                    <button
                        onClick={() => switchUser(USER_ROLES.SELLER)}
                        style={{ padding: '8px 12px', cursor: 'pointer', background: user.id === 'u2' ? '#ddd' : 'white', border: '1px solid #ccc', borderRadius: '6px' }}
                    >
                        Usuario Vendedor (u2)
                    </button>
                    <button
                        onClick={() => switchUser(USER_ROLES.COMPANY)}
                        style={{ padding: '8px 12px', cursor: 'pointer', background: user.id === 'u3' ? '#ddd' : 'white', border: '1px solid #ccc', borderRadius: '6px' }}
                    >
                        Usuario Empresa (u3)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
