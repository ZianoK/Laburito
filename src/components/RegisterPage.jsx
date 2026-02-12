import React, { useState } from 'react';
import { User, Briefcase, Building2, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import './Auth.css';

const RegisterPage = ({ onRegister, onNavigate }) => {
    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState(null); // 'client', 'provider', 'company'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        category: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Mock existing emails for validation
    const EXISTING_EMAILS = ['test@test.com', 'user@laburito.com', 'admin@laburito.com'];

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');

        if (EXISTING_EMAILS.includes(formData.email)) {
            setError('Este correo electrónico ya está registrado. Por favor, utilizá otro o iniciá sesión.');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setSuccess(true);
            // We delay the actual onRegister callback to show the success message first
            // or we just show the success message and a button to continue
        }, 500);
    };

    const finishRegistration = () => {
        onRegister({
            id: `u${Date.now()}`,
            ...formData,
            type: userType
        });
    };

    const renderSuccess = () => (
        <div className="auth-success">
            <div className="success-icon">🎉</div>
            <h2>¡Registro Exitoso!</h2>
            <p className="success-message">
                Bienvenido a Laburito, <strong>{formData.name}</strong>.
            </p>
            <p>Tu cuenta de <strong>{userType === 'company' ? 'Empresa' : (userType === 'provider' ? 'Profesional' : 'Cliente')}</strong> ha sido creada correctamente.</p>

            <button className="auth-btn" onClick={finishRegistration}>
                Comenzar a usar Laburito <ArrowRight size={18} />
            </button>
        </div>
    );

    const renderTypeSelection = () => (
        <>
            <div className="auth-header">
                <h2>Crear Cuenta</h2>
                <p>Seleccioná cómo querés usar Laburito</p>
            </div>

            <div className="user-types-grid">
                <div
                    className={`type-card ${userType === 'client' ? 'selected' : ''}`}
                    onClick={() => setUserType('client')}
                >
                    <div className="type-icon"><User size={24} /></div>
                    <div className="type-info">
                        <h4>Cliente</h4>
                        <p>Quiero contratar servicios para mi hogar o empresa.</p>
                    </div>
                </div>

                <div
                    className={`type-card ${userType === 'provider' ? 'selected' : ''}`}
                    onClick={() => setUserType('provider')}
                >
                    <div className="type-icon"><Briefcase size={24} /></div>
                    <div className="type-info">
                        <h4>Profesional</h4>
                        <p>Soy un experto y quiero ofrecer mis servicios.</p>
                    </div>
                </div>

                <div
                    className={`type-card ${userType === 'company' ? 'selected' : ''}`}
                    onClick={() => setUserType('company')}
                >
                    <div className="type-icon"><Building2 size={24} /></div>
                    <div className="type-info">
                        <h4>Empresa</h4>
                        <p>Gestiono un equipo o ofrezco múltiples servicios.</p>
                    </div>
                </div>
            </div>

            <button
                className="auth-btn"
                onClick={() => userType && setStep(2)}
                disabled={!userType}
                style={{ opacity: userType ? 1 : 0.5 }}
            >
                Continuar <ArrowRight size={18} />
            </button>
        </>
    );

    const renderForm = () => (
        <>
            <div className="auth-header" style={{ marginBottom: '20px' }}>
                <button className="back-btn-text" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#666', marginBottom: '16px' }}>
                    <ArrowLeft size={14} /> Volver
                </button>
                <h2>Datos de {userType === 'company' ? 'la Empresa' : (userType === 'provider' ? 'Profesional' : 'Usuario')}</h2>
            </div>

            <form onSubmit={handleRegister} className="auth-form">
                {error && <div className="auth-error" style={{ color: 'red', background: '#ffebee', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</div>}

                <div className="form-group">
                    <label>{userType === 'company' ? 'Nombre de la Empresa' : 'Nombre Completo'}</label>
                    <div className="input-with-icon">
                        {userType === 'company' ? <Building2 size={18} /> : <User size={18} />}
                        <input
                            type="text"
                            placeholder={userType === 'company' ? "Ej. Servicios S.A." : "Tu nombre"}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                </div>

                {userType !== 'client' && (
                    <div className="form-group">
                        <label>Rubro Principal</label>
                        <div className="input-with-icon">
                            <Briefcase size={18} />
                            <input
                                type="text"
                                placeholder="Ej. Plomería, Electricidad..."
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label>Email</label>
                    <div className="input-with-icon">
                        <User size={18} />
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Contraseña</label>
                    <div className="input-with-icon">
                        <Lock size={18} />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="auth-btn">
                    Registrarme
                </button>
            </form>
        </>
    );

    return (
        <div className="auth-container">
            <div className="auth-card">
                {success ? renderSuccess() : (step === 1 ? renderTypeSelection() : renderForm())}

                {!success && (
                    <div className="auth-footer">
                        <p>¿Ya tenés cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>Iniciá Sesión</a></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
