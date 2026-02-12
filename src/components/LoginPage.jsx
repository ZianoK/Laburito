import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import './Auth.css';

const LoginPage = ({ onLogin, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock login logic
        if (email) {
            // Check mock DB for existing user
            const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
            const existingUser = usersDB.find(u => u.email === email);

            if (existingUser) {
                onLogin(existingUser);
            } else {
                // Fallback for demo/unregistered emails
                onLogin({
                    id: 'u' + Date.now(),
                    name: email.split('@')[0], // Fallback if not found
                    email: email,
                    type: 'client' // Default to client for demo
                });
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Iniciar Sesión</h2>
                    <p>Bienvenido de nuevo a Laburito</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <div className="input-with-icon">
                            <User size={18} />
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-btn">
                        Ingresar <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p>¿No tenés cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('register'); }}>Registrate</a></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
