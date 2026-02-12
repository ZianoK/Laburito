import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, CreditCard, Clock, CheckCircle } from 'lucide-react';
import './HiringModal.css';

const HiringModal = ({ service, onClose, onConfirm, onRequestQuote }) => {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState(null);
    const [hours, setHours] = useState(1);
    const [quantity, setQuantity] = useState(1); // For variable pricing (e.g. m2)
    const [selectedDates, setSelectedDates] = useState([]); // Array of date strings
    const [paymentMethod, setPaymentMethod] = useState('');

    // Reset state when service changes (though modal should remount)
    useEffect(() => {
        if (service && service.serviceTypes.length > 0) {
            setSelectedType(service.serviceTypes[0]);
        }
    }, [service]);

    const handleDateSelect = (e) => {
        const date = e.target.value;
        if (!date) return;

        // Toggle date selection
        if (selectedDates.includes(date)) {
            setSelectedDates(selectedDates.filter(d => d !== date));
        } else {
            setSelectedDates([...selectedDates, date].sort());
        }
    };

    const calculateTotal = () => {
        if (!selectedType) return 0;

        let basePrice = selectedType.price;
        let multiplier = 1;

        if (selectedType.type === 'hourly') {
            multiplier = hours;
        } else if (selectedType.type === 'variable') {
            multiplier = quantity;
        }

        // Multiply by number of days if multiple dates selected
        const daysCount = Math.max(1, selectedDates.length);

        let subtotal = basePrice * multiplier * daysCount;

        // Apply discount
        const discount = service.discounts[paymentMethod] || 0;
        return subtotal * (1 - discount);
    };

    const handleNext = () => {
        if (step === 1) {
            if (!selectedType) return;
            // If it's a quote type, redirect to chat immediately
            if (selectedType.type === 'quote') {
                onRequestQuote(service);
                return;
            }
        }

        if (step === 2 && selectedDates.length === 0) {
            alert("Por favor selecciona al menos una fecha.");
            return;
        }
        setStep(step + 1);
    };

    const renderStep1 = () => (
        <div className="modal-step">
            <h3>Seleccioná el tipo de trabajo</h3>
            <div className="service-types-list">
                {service.serviceTypes.map(type => (
                    <div
                        key={type.id}
                        className={`type-option ${selectedType?.id === type.id ? 'selected' : ''}`}
                        onClick={() => setSelectedType(type)}
                    >
                        <div className="type-info">
                            <span className="type-name">{type.name}</span>
                            <span className="type-price">
                                {type.type === 'quote' ? 'A Presupuestar' : `$${type.price}`}
                                {type.type === 'hourly' ? ' / hora' : ''}
                                {type.type === 'variable' ? ` / ${type.unit}` : ''}
                            </span>
                        </div>
                        {selectedType?.id === type.id && <CheckCircle size={20} color="var(--primary)" />}
                    </div>
                ))}
            </div>

            {selectedType?.type === 'hourly' && (
                <div className="hours-selector">
                    <label>Cantidad de horas estimadas:</label>
                    <div className="counter-control">
                        <button onClick={() => setHours(Math.max(1, hours - 1))}>-</button>
                        <span>{hours}</span>
                        <button onClick={() => setHours(hours + 1)}>+</button>
                    </div>
                </div>
            )}

            {selectedType?.type === 'variable' && (
                <div className="hours-selector">
                    <label>Cantidad de {selectedType.unitLabel || 'unidades'}:</label>
                    <div className="counter-control">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="modal-step">
            <h3>¿Cuándo lo necesitás?</h3>
            <p className="step-subtitle">Podés seleccionar uno o varios días.</p>

            <div className="date-picker-container">
                <input
                    type="date"
                    className="date-input"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={handleDateSelect}
                />

                <div className="selected-dates-list">
                    {selectedDates.length > 0 ? (
                        selectedDates.map(date => (
                            <div key={date} className="date-chip">
                                {new Date(date).toLocaleDateString()}
                                <X size={14} onClick={() => setSelectedDates(selectedDates.filter(d => d !== date))} style={{ cursor: 'pointer' }} />
                            </div>
                        ))
                    ) : (
                        <span className="no-dates">No hay fechas seleccionadas</span>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="modal-step">
            <h3>Forma de Pago</h3>
            <div className="payment-methods-list">
                {service.paymentMethods.map(method => (
                    <div
                        key={method}
                        className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod(method)}
                    >
                        <span>{method}</span>
                        {service.discounts[method] && (
                            <span className="discount-tag">-{service.discounts[method] * 100}% OFF</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="price-summary">
                <div className="summary-row">
                    <span>Servicio:</span>
                    <span>{selectedType?.name}</span>
                </div>
                {selectedType?.type === 'hourly' && (
                    <div className="summary-row">
                        <span>Horas:</span>
                        <span>{hours}</span>
                    </div>
                )}
                {selectedType?.type === 'variable' && (
                    <div className="summary-row">
                        <span>Cantidad ({selectedType.unit}):</span>
                        <span>{quantity}</span>
                    </div>
                )}
                <div className="summary-row">
                    <span>Días:</span>
                    <span>{Math.max(1, selectedDates.length)} ({selectedDates.length > 0 ? selectedDates.join(', ') : 'A definir'})</span>
                </div>
                <div className="summary-total">
                    <span>Total Estimado:</span>
                    <span>${calculateTotal().toLocaleString()}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Contratar Servicio</h2>
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="progress-bar">
                    <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className="step-line"></div>
                    <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                    <div className="step-line"></div>
                    <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
                </div>

                <div className="modal-body">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </div>

                <div className="modal-footer">
                    {step > 1 && (
                        <button className="back-btn" onClick={() => setStep(step - 1)}>Volver</button>
                    )}

                    {step < 3 ? (
                        <button
                            className="next-btn"
                            onClick={handleNext}
                        >
                            {step === 1 && selectedType?.type === 'quote' ? 'Consultar Presupuesto' : 'Siguiente'}
                        </button>
                    ) : (
                        <button
                            className="confirm-btn"
                            disabled={!paymentMethod}
                            onClick={() => {
                                onConfirm({
                                    service,
                                    type: selectedType,
                                    hours,
                                    quantity: selectedType.type === 'variable' ? quantity : undefined,
                                    dates: selectedDates,
                                    paymentMethod,
                                    total: calculateTotal()
                                });
                            }}
                        >
                            Confirmar Contratación
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HiringModal;
