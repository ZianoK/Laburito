export const MOCK_USER = {
    id: 'u1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    type: 'client',
    avatar: 'https://i.pravatar.cc/150?u=u1'
};

export const getCurrentUser = () => {
    // In a real app, this would check session/token
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
};
