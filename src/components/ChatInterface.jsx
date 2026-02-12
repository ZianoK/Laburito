import React, { useState, useEffect, useRef } from 'react';
import { Send, User, ChevronLeft, Paperclip, Check } from 'lucide-react';
import './ChatInterface.css';

const ChatInterface = ({ service, user, onBack, onHireProposal }) => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'provider', text: `Hola ${user.name}, ¿en qué te puedo ayudar con ${service.serviceTitle}?`, time: '10:00 AM' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate provider response
        setTimeout(() => {
            const responses = [
                "Dale, perfecto. ¿Para cuándo lo necesitarías?",
                "Entiendo. Dejame calcular los materiales y te paso un presupuesto.",
                "¿Tenés fotos del lugar para ver mejor?",
                "Genial, tengo disponibilidad la próxima semana."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            setMessages(prev => [...prev, {
                id: prev.length + 1,
                sender: 'provider',
                text: randomResponse,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setIsTyping(false);
        }, 1500 + Math.random() * 2000);

        // Simulate Budget Proposal trigger (for demo purposes, trigger it if user asks for price/presupuesto)
        if (inputText.toLowerCase().includes('precio') || inputText.toLowerCase().includes('presupuesto') || inputText.toLowerCase().includes('cuanto sale')) {
            setTimeout(() => {
                const proposalPrice = 45000;
                setMessages(prev => [...prev, {
                    id: prev.length + 1,
                    sender: 'provider',
                    type: 'proposal',
                    price: proposalPrice,
                    description: 'Mano de obra y materiales básicos según lo charlado.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }, 4000);
        }
    };

    const handleAcceptProposal = (price) => {
        onHireProposal(price);
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <button className="back-button" onClick={onBack}>
                    <ChevronLeft size={24} />
                </button>
                <div className="provider-info-chat">
                    <img src={service.image} alt={service.name} className="chat-avatar" />
                    <div>
                        <h3>{service.name}</h3>
                        <span className="online-status">En línea</span>
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`message-wrapper ${msg.sender === 'user' ? 'my-message' : 'provider-message'}`}>
                        {msg.type === 'proposal' ? (
                            <div className="proposal-card">
                                <div className="proposal-header">
                                    <h4>Presupuesto Propuesto</h4>
                                </div>
                                <div className="proposal-body">
                                    <p>{msg.description}</p>
                                    <div className="proposal-price">${msg.price.toLocaleString()}</div>
                                </div>
                                <div className="proposal-actions">
                                    <button className="accept-btn" onClick={() => handleAcceptProposal(msg.price)}>
                                        <Check size={18} /> Aceptar Presupuesto
                                    </button>
                                    <button className="reject-btn">Cancelar</button>
                                </div>
                                <span className="message-time">{msg.time}</span>
                            </div>
                        ) : (
                            <div className="message-bubble">
                                <p>{msg.text}</p>
                                <span className="message-time">{msg.time}</span>
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div className="message-wrapper provider-message">
                        <div className="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <button className="attach-btn"><Paperclip size={20} /></button>
                <input
                    type="text"
                    placeholder="Escribí un mensaje..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="send-btn" onClick={handleSend} disabled={!inputText.trim()}>
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
