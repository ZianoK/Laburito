import { storage } from '../../lib/storage';
import { userSchema, USER_ROLES } from './users.schemas';
import { z } from 'zod';

const STORAGE_KEY = 'laburito_users_v1';
const STORAGE_VERSION = 'v1';
const LEGACY_KEY = 'laburito_users'; // For future if needed

const usersListSchema = z.array(userSchema);

const migrateUsers = (data) => data;

// Mock Initial Data
const INITIAL_USERS = [
    {
        id: 'u1',
        email: 'tiziano@example.com',
        name: 'Tiziano Client',
        roles: [USER_ROLES.CLIENT],
        addresses: [],
        createdAt: new Date().toISOString()
    },
    {
        id: 'u2',
        email: 'provider@example.com',
        name: 'Mario Plomero',
        roles: [USER_ROLES.CLIENT, USER_ROLES.SELLER],
        addresses: [],
        createdAt: new Date().toISOString()
    },
    {
        id: 'u3',
        email: 'company@example.com',
        name: 'Servicios SA',
        roles: [USER_ROLES.CLIENT, USER_ROLES.COMPANY],
        addresses: [],
        createdAt: new Date().toISOString()
    }
];

export const usersApi = {
    getAll: () => {
        const users = storage.get(STORAGE_KEY, STORAGE_VERSION, usersListSchema, migrateUsers, LEGACY_KEY);
        if (!users) {
            // Initialize if empty
            storage.set(STORAGE_KEY, INITIAL_USERS, STORAGE_VERSION);
            return INITIAL_USERS;
        }
        return users;
    },

    getById: (id) => {
        const users = usersApi.getAll();
        return users.find(u => u.id === id) || null;
    },

    update: (id, updates) => {
        const users = usersApi.getAll();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return null;

        const updatedUser = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
        users[index] = updatedUser;

        storage.set(STORAGE_KEY, users, STORAGE_VERSION);
        return updatedUser;
    }
};
