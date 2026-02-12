import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Wrench, LogOut, ShoppingCart } from 'lucide-react';
import './Header.css';

const Header = ({ searchTerm, setSearchTerm, onNavigate, user, onLogout, cartCount, onOpenCart }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNavigate = (view) => {
        onNavigate(view);
        setShowDropdown(false);
    };

    const handleLogout = () => {
        onLogout();
        setShowDropdown(false);
    }

    return (
        <header className="header">
            <div className="logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
                <Wrench size={24} />
                <span>Laburito</span>
            </div>

            <div className="search-bar">
                <Search size={18} color="#999" />
                <input
                    type="text"
                    placeholder="¿Qué servicio estás buscando?"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <nav className="nav-links">
                <div className="nav-group">
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Servicios</a>
                    {user && (
                        <>
                            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('chats'); }}>Mensajes</a>
                            <div className="cart-icon-container" onClick={onOpenCart} title="Ver Carrito">
                                <ShoppingCart size={22} className="nav-icon" />
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </div>
                        </>
                    )}
                </div>

                {user ? (
                    <div className="user-menu-container" ref={dropdownRef}>
                        <div
                            className="user-menu-trigger"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <span className="user-name">
                                {user.name}
                                {user.type === 'company' && <span className="badge-company">Empresa</span>}
                            </span>
                            <div className="avatar">
                                <User size={18} />
                            </div>
                        </div>

                        {showDropdown && (
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <p>Hola, <strong>{user.name}</strong></p>
                                    <span className="user-email">{user.email}</span>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item" onClick={() => handleNavigate('active-services')}>
                                    🛠️ Servicios Activos
                                </button>
                                <button className="dropdown-item" onClick={() => handleNavigate('favorites')}>
                                    ❤️ Favoritos
                                </button>
                                <button className="dropdown-item" onClick={() => handleNavigate('history')}>
                                    📅 Historial
                                </button>
                                <button className="dropdown-item" onClick={() => handleNavigate('config')}>
                                    ⚙️ Configuración
                                </button>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item logout" onClick={handleLogout}>
                                    <LogOut size={16} /> Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        className="login-btn"
                        onClick={() => onNavigate('login')}
                    >
                        <User size={16} /> Ingresar
                    </button>
                )}
            </nav>
        </header>
    );
};

export default Header;
