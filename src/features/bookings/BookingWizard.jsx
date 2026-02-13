import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, CreditCard, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { useCreateBooking } from './bookings.hooks';
import { useToast } from '../../components/ui/Toast';
import './BookingWizard.css';

const STEPS = [
    { id: 1, title: 'Elegí una opción' },
    { id: 2, title: 'Seleccioná fechas' },
    { id: 3, title: 'Forma de pago' },
    { id: 4, title: 'Confirmación' }
];

const BookingWizard = ({ service, onClose, onSuccess }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        selectedOption: null,
        dates: [],
        paymentMethod: null
    });

    const { mutate: createBooking, isLoading } = useCreateBooking();
    const { addToast } = useToast();

    // -- Handlers --
    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                if (!formData.selectedOption) {
                    addToast({ type: 'error', title: 'Error', description: 'Por favor seleccioná una opción de servicio.' });
                    return false;
                }
                return true;
            case 2:
                if (formData.dates.length === 0) {
                    addToast({ type: 'error', title: 'Error', description: 'Seleccioná al menos una fecha.' });
                    return false;
                }
                return true;
            case 3:
                if (!formData.paymentMethod) {
                    addToast({ type: 'error', title: 'Error', description: 'Seleccioná un método de pago.' });
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleSubmit = () => {
        createBooking({
            serviceId: service.id,
            providerId: service.sellerId, // Linked to User (Seller/Company)
            serviceName: service.name, // Provider Name
            serviceTitle: service.serviceTitle, // Service Title
            serviceImage: service.image,
            selectedOption: formData.selectedOption,
            dates: formData.dates,
            paymentMethod: formData.paymentMethod,
            totalAmount: formData.selectedOption.price * (formData.dates.length || 1) // Simple calc
        }, {
            onSuccess: (booking) => {
                addToast({ type: 'success', title: '¡Contratación iniciada!', description: 'El proveedor confirmará tu pedido pronto.' });
                // We keep a small delay to show the success state if needed, or close immediately
                onSuccess(booking);
                onClose();
            },
            onError: (err) => {
                addToast({ type: 'error', title: 'Error al contratar', description: err.message });
            }
        });
    };

    // -- Render Steps --
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="step-content">
                        <h3>¿Qué tipo de servicio necesitás?</h3>
                        {service.serviceTypes.map(type => (
                            <div
                                key={type.id}
                                className={`option-card ${formData.selectedOption?.id === type.id ? 'selected' : ''}`}
                                onClick={() => setFormData({ ...formData, selectedOption: type })}
                            >
                                <div>
                                    <h4>{type.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Servicio estándar</p>
                                </div>
                                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                    ${type.price.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 2:
                return (
                    <div className="step-content">
                        <h3>¿Cuándo lo necesitás?</h3>
                        <p style={{ color: '#666', marginBottom: '15px' }}>Seleccioná una o más fechas estimadas.</p>
                        <input
                            type="date"
                            className="date-input"
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                                if (e.target.value && !formData.dates.includes(e.target.value)) {
                                    setFormData({ ...formData, dates: [...formData.dates, e.target.value] });
                                }
                            }}
                        />
                        <div className="date-grid">
                            {formData.dates.map(date => (
                                <div key={date} className="date-chip selected">
                                    {date}
                                    <X
                                        size={14}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setFormData({ ...formData, dates: formData.dates.filter(d => d !== date) })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="step-content">
                        <h3>Forma de Pago</h3>
                        {[
                            { id: 'cash', label: 'Efectivo al finalizar', icon: <DollarSignIcon /> },
                            { id: 'transfer', label: 'Transferencia Bancaria', icon: <BankIcon /> },
                            { id: 'debit', label: 'Tarjeta de Débito', icon: <CardIcon /> }
                        ].map(method => (
                            <div
                                key={method.id}
                                className={`payment-option ${formData.paymentMethod === method.id ? 'selected' : ''}`}
                                onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                            >
                                {method.icon}
                                <span>{method.label}</span>
                            </div>
                        ))}
                    </div>
                );
            case 4:
                const total = formData.selectedOption.price * (formData.dates.length || 1);
                return (
                    <div className="step-content">
                        <h3>Resumen de Contratación</h3>
                        <div className="summary-box">
                            <div className="summary-row">
                                <span>Servicio</span>
                                <strong>{service.name}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Opción</span>
                                <span>{formData.selectedOption.label || formData.selectedOption.name}</span>
                            </div>
                            <div className="summary-row">
                                <span>Proveedor</span>
                                <span>{service.providerName}</span>
                            </div>
                            <div className="summary-row">
                                <span>Fechas</span>
                                <span>{formData.dates.length} día(s)</span>
                            </div>
                            <div className="summary-total">
                                <span>Total Estimado</span>
                                <span>${total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="booking-wizard-overlay">
            <div className="booking-wizard-container">
                <div className="wizard-header">
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Contratar Servicio</h2>
                        <div className="wizard-steps">
                            {STEPS.map(step => (
                                <div
                                    key={step.id}
                                    className={`step-indicator ${step.id === currentStep ? 'active' : ''} ${step.id < currentStep ? 'completed' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} color="#666" />
                    </button>
                </div>

                <div className="wizard-body">
                    {renderStepContent()}
                </div>

                <div className="wizard-footer">
                    {currentStep > 1 ? (
                        <button className="btn-secondary" onClick={handleBack}>
                            <ChevronLeft size={18} /> Atrás
                        </button>
                    ) : (
                        <div></div> // Spacer
                    )}

                    {currentStep < STEPS.length ? (
                        <button className="btn-primary" onClick={handleNext}>
                            Siguiente <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button className="btn-primary" onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? 'Procesando...' : 'Confirmar Contratación'} <Check size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Simple icons helpers
const DollarSignIcon = () => <span style={{ fontSize: '1.2rem' }}>💵</span>;
const BankIcon = () => <span style={{ fontSize: '1.2rem' }}>🏦</span>;
const CardIcon = () => <span style={{ fontSize: '1.2rem' }}>💳</span>;

export default BookingWizard;
