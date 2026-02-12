import React, { useMemo } from 'react';
import { X, Trash2, ShoppingCart } from 'lucide-react';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose, cartItems, onRemove, onCheckout }) => {
    const total = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            // Price calculation logic could be complex (hourly vs fixed), simple sum for MVP
            // Assuming price is fixed or base price for now
            const price = item.serviceTypes && item.serviceTypes[0]
                ? item.serviceTypes[0].price
                : (item.price || 0);
            return sum + price;
        }, 0);
    }, [cartItems]);

    if (!isOpen) return null;

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-drawer" onClick={e => e.stopPropagation()}>
                <div className="cart-header">
                    <h3><ShoppingCart size={20} /> Tu Carrito ({cartItems.length})</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <ShoppingCart size={48} color="#ddd" />
                            <p>Tu carrito está vacío</p>
                            <button className="browse-btn" onClick={onClose}>Explorar Servicios</button>
                        </div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="cart-item">
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <p>{item.serviceTitle}</p>
                                    <span className="item-price">
                                        ${item.serviceTypes && item.serviceTypes[0]?.price
                                            ? item.serviceTypes[0].price
                                            : item.price}
                                    </span>
                                </div>
                                <button className="remove-btn" onClick={() => onRemove(item.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="total-row">
                            <span>Total Estimado</span>
                            <span className="total-price">${total}</span>
                        </div>
                        <button className="checkout-btn" onClick={onCheckout}>
                            Contratar Todo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
