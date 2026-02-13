import { useState, useEffect } from 'react';
import { usersApi } from '../users/users.api';
import { profilesApi } from '../users/profiles.api';
import { USER_ROLES } from '../users/users.schemas';

const SESSION_KEY = 'laburito_active_session_uid';

export const useCurrentUser = () => {
    // Basic session management
    const [userId, setUserId] = useState(() => localStorage.getItem(SESSION_KEY));
    const [isReady, setIsReady] = useState(false);
    const [user, setUser] = useState(null);
    const [sellerProfile, setSellerProfile] = useState(null);
    const [companyProfile, setCompanyProfile] = useState(null);

    // Load User Data
    useEffect(() => {
        // Reset ready state if userId changes (optional, but good for transitions)
        setIsReady(false);

        try {
            if (userId) {
                const u = usersApi.getById(userId);
                // Contract: User must exist and have roles
                if (u && Array.isArray(u.roles)) {
                    setUser(u);
                    setSellerProfile(profilesApi.getSellerProfile(userId));
                    setCompanyProfile(profilesApi.getCompanyProfile(userId));
                } else {
                    console.warn("User data corrupted or missing roles, logging out.");
                    logout();
                }
            } else {
                setUser(null);
                setSellerProfile(null);
                setCompanyProfile(null);
            }
        } catch (err) {
            console.error("Error loading user data:", err);
            logout();
        } finally {
            setIsReady(true);
        }
    }, [userId]);

    const login = (userData) => {
        const users = usersApi.getAll();
        const found = users.find(u => u.email === userData.email);

        if (found) {
            setUserId(found.id);
            localStorage.setItem(SESSION_KEY, found.id);
        } else {
            alert("Usuario no encontrado en mock (intentá: tiziano@example.com)");
        }
    };

    const logout = () => {
        setUserId(null);
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
        setSellerProfile(null);
        setCompanyProfile(null);
    };

    const register = (userData) => {
        alert("Registro simulado. Usá el toggle DEV para cambiar de usuario.");
    };

    // DEV: Switch User Logic (Stable Contract: switchUser)
    const switchUser = (role) => {
        const users = usersApi.getAll();
        let targetUser;

        if (role === USER_ROLES.SELLER) {
            targetUser = users.find(u => u.roles.includes(USER_ROLES.SELLER));
        } else if (role === USER_ROLES.COMPANY) {
            targetUser = users.find(u => u.roles.includes(USER_ROLES.COMPANY));
        } else {
            targetUser = users.find(u => !u.roles.includes(USER_ROLES.SELLER) && !u.roles.includes(USER_ROLES.COMPANY));
        }

        if (targetUser) {
            setUserId(targetUser.id);
            localStorage.setItem(SESSION_KEY, targetUser.id);
            window.location.reload();
        } else {
            alert(`No hay usuario mock con rol ${role}`);
        }
    };

    return {
        user,
        isReady,
        sellerProfile,
        companyProfile,
        currentUserId: userId,
        login,
        logout,
        register,
        switchUser, // Stable alias
        devSwitchUser: switchUser, // Backward compatibility
        isAuthenticated: !!user
    };
};
