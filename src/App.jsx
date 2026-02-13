import React, { useState, useMemo } from 'react';
import { useCurrentUser } from './features/auth/useCurrentUser';
import BookingWizard from './features/bookings/BookingWizard';

import Header from './components/Header';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ServiceCard from './components/ServiceCard';
import MapComponent from './components/MapComponent';
import RankingSection from './components/RankingSection';
import FavoritesPage from './components/FavoritesPage';
// import HiringModal from './components/HiringModal'; // Replaced by BookingWizard
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CartDrawer from './components/CartDrawer';
import { MOCK_SERVICES } from './data/mockData';
import './App.css';

import ChatInterface from './components/ChatInterface';

import ActiveServices from './components/ActiveServices';
import IncomingRequests from './components/IncomingRequests';
import ServiceHistory from './components/ServiceHistory';
import ChatList from './components/ChatList';
import UserProfile from './components/UserProfile';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h2>Algo salió mal.</h2>
                    <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', marginTop: '10px', color: 'red' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px', cursor: 'pointer' }}>Recargar Página</button>
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ marginTop: '20px', marginLeft: '10px', padding: '10px', cursor: 'pointer' }}>Borrar Datos y Recargar</button>
                </div>
            );
        }

        return this.props.children;
    }
}

function App() {
    return (
        <ErrorBoundary>
            <LaburitoApp />
        </ErrorBoundary>
    );
}

function LaburitoApp() {
    const [view, setView] = useState('home');
    const { user, login, logout, register } = useCurrentUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('rating');
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // UI State for Wizard
    const [hiringService, setHiringService] = useState(null);
    const [activeChatService, setActiveChatService] = useState(null);

    // -- Handlers --
    const addToCart = (service) => {
        setCart(prev => {
            if (!prev.find(item => item.id === service.id)) {
                return [...prev, service];
            }
            return prev;
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const handleHire = (service) => {
        if (!user) {
            setView('login');
            return;
        }
        setHiringService(service);
    };

    const handleBookingSuccess = (booking) => {
        setHiringService(null);
        setView('active-services');
    };



    const filteredServices = useMemo(() => {
        let result = [...MOCK_SERVICES];

        if (selectedCategory !== 'all') {
            result = result.filter(s => s.category === selectedCategory);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(term) ||
                s.serviceTitle.toLowerCase().includes(term) ||
                s.category.toLowerCase().includes(term)
            );
        }

        result.sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'price_asc') return a.price - b.price;
            if (sortBy === 'price_desc') return b.price - a.price;
            if (sortBy === 'reviews') return b.reviews - a.reviews;
            return 0;
        });

        return result;
    }, [searchTerm, selectedCategory, sortBy]);

    const topServices = useMemo(() => {
        return [...MOCK_SERVICES].sort((a, b) => b.rating - a.rating);
    }, []);

    const renderContent = () => {
        switch (view) {
            case 'login':
                return <LoginPage onLogin={(u) => { login(u); setView('home'); }} onNavigate={setView} />;
            case 'register':
                return <RegisterPage onRegister={(u) => { register(u); setView('home'); }} onNavigate={setView} />;
            case 'chat':
                return (
                    <ChatInterface
                        service={activeChatService}
                        user={user}
                        onBack={() => setView('home')}
                        onHireProposal={(price) => {
                            // Bridge: we'd ideally pass this price to wizard
                            setActiveChatService(null);
                            setView('home');
                            setHiringService(activeChatService);
                        }}
                    />
                );
            case 'profile':
                return <UserProfile onNavigate={setView} />;
            case 'favorites':
                return (
                    <FavoritesPage
                        services={MOCK_SERVICES}
                        onHire={handleHire}
                        onAddToCart={addToCart}
                    />
                );
            case 'requests':
                return <IncomingRequests onNavigate={setView} />;
            case 'active-services':
                return <ActiveServices onNavigate={setView} />;
            case 'history':
                return <ServiceHistory onNavigate={setView} />;
            case 'chats':
                return (
                    <ChatList
                        onOpenChat={(chat) => {
                            const service = MOCK_SERVICES.find(s => s.id === chat.serviceId || s.id === parseInt(chat.serviceId));
                            setActiveChatService(service || { id: chat.serviceId, name: chat.serviceName, serviceTitle: chat.serviceName, image: chat.serviceImage });
                            setView('chat');
                        }}
                    />
                );
            case 'home':
            default:
                return (
                    <>
                        {!searchTerm && <Hero onSearch={setSearchTerm} />}
                        <main className="main-content">
                            <FilterBar
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                            />

                            <div className="content-grid">
                                <div className="services-column">
                                    <div className="results-header">
                                        <h2>{selectedCategory === 'all' ? 'Todos los Servicios' : selectedCategory}</h2>
                                        <span>{filteredServices.length} resultados cerca de ti</span>
                                    </div>

                                    <div className="services-list">
                                        {filteredServices.map(service => (
                                            <ServiceCard
                                                key={service.id}
                                                service={service}
                                                // Favorites now handled internally by hook
                                                onHire={handleHire}
                                                onAddToCart={addToCart}
                                                isInCart={cart.some(item => item.id === service.id)}
                                            />
                                        ))}

                                        {filteredServices.length === 0 && (
                                            <div className="no-results">
                                                <p>No se encontraron servicios con tus criterios.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="sidebar-column">
                                    <MapComponent services={filteredServices} />
                                    <RankingSection topServices={topServices} />
                                </div>
                            </div>
                        </main>
                    </>
                );
        }
    };

    return (
        <div className="app">
            {view !== 'chat' && <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onNavigate={(v) => {
                    setView(v);
                    setSearchTerm('');
                    setIsCartOpen(false);
                }}
                user={user}
                onLogout={logout}
                cartCount={cart.length}
                onOpenCart={() => setIsCartOpen(true)}
            />}

            {renderContent()}

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cart}
                onRemove={removeFromCart}
                onCheckout={() => {
                    alert("Checkout de carrito pendiente de migrar a nuevo wizard");
                }}
            />

            {hiringService && (
                <BookingWizard
                    service={hiringService}
                    onClose={() => setHiringService(null)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
}

export default App;
