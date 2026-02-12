import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';

const ChatList = ({ chats, onOpenChat }) => {

    const containerStyle = {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: '1px solid #eee'
    };

    if (chats.length === 0) {
        return (
            <div style={{ ...containerStyle, textAlign: 'center', marginTop: '50px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#ccc' }}>💬</div>
                <h2>No tenés mensajes</h2>
                <p style={{ color: '#666' }}>Iniciá una conversación o pedí un presupuesto para ver tus chats acá.</p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h2 style={{ marginBottom: '20px' }}>Mis Mensajes ({chats.length})</h2>

            {chats.map(chat => (
                <div
                    key={chat.id}
                    style={cardStyle}
                    onClick={() => onOpenChat(chat)} // Logic to open specific chat (to be implemented fully)
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img
                            src={chat.serviceImage}
                            alt={chat.serviceName}
                            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{chat.serviceName}</h3>
                            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {chat.lastMessage}
                            </p>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: '#999', display: 'block', marginBottom: '8px' }}>
                            {chat.timestamp}
                        </span>
                        {chat.unread > 0 && (
                            <span style={{
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>
                                {chat.unread}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatList;
