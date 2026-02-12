import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ServiceCard from './components/ServiceCard';
import MapComponent from './components/MapComponent';
import RankingSection from './components/RankingSection';
import FavoritesPage from './components/FavoritesPage';
import HiringModal from './components/HiringModal';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CartDrawer from './components/CartDrawer';
import { MOCK_SERVICES } from './data/mockData';
import './App.css';

import ChatInterface from './components/ChatInterface';

import ActiveServices from './components/ActiveServices';
import ServiceHistory from './components/ServiceHistory';
import ChatList from './components/ChatList';

function App() {
    // ... existing state ...

    // ... existing handlers ...

    const renderContent = () => {
        switch (view) {
            case 'login':
                return <LoginPage onLogin={handleLogin} onNavigate={setView} />;
            case 'register':
                return <RegisterPage onRegister={handleRegister} onNavigate={setView} />;
            case 'chat':
                return (
                    <ChatInterface
                        service={activeChatService}
                        user={user}
                        onBack={() => setView(chats.length > 0 ? 'chats' : 'home')}
                        onHireProposal={handleHireFromChat}
                    />
                );
            case 'favorites':
                return (
                    <FavoritesPage
                        favorites={favorites}
                        services={MOCK_SERVICES}
                        onToggleFavorite={toggleFavorite}
                        onHire={handleHire}
                        onAddToCart={addToCart}
                    />
                );
            case 'active-services':
                return (
                    <ActiveServices
                        orders={orders}
                        onComplete={handleCompleteOrder}
                        onNavigate={setView}
                    />
                );
            case 'history':
                return (
                    <ServiceHistory
                        orders={orders}
                        onNavigate={setView}
                    />
                );
            case 'chats':
                return (
                    <ChatList
                        chats={chats}
                        onOpenChat={(chat) => {
                            const service = MOCK_SERVICES.find(s => s.id === chat.serviceId || s.id === parseInt(chat.serviceId));
                            setActiveChatService(service || { id: chat.serviceId, name: chat.serviceName, image: chat.serviceImage });
                            setView('chat');
                        }}
                    />
                );
            case 'config':
                return (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <h2>⚙️ Configuración</h2>
                        <p>Pronto podrás gestionar tus preferencias aquí.</p>
                        <button onClick={() => setView('home')} style={{ marginTop: '20px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Volver al Inicio</button>
                    </div>
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
                                                isFavorite={favorites.includes(service.id)}
                                                onToggleFavorite={toggleFavorite}
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
                onLogout={handleLogout}
                cartCount={cart.length}
                onOpenCart={() => setIsCartOpen(true)}
            />}

            {renderContent()}

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cart}
                onRemove={removeFromCart}
                onCheckout={handleCheckoutCart}
            />

            {hiringService && (
                <HiringModal
                    service={hiringService}
                    onClose={() => setHiringService(null)}
                    onConfirm={confirmHire}
                    onRequestQuote={handleRequestQuote}
                />
            )}
        </div>
    );
}

export default App;
