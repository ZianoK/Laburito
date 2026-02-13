import { storage } from '../../lib/storage';
import { z } from 'zod';

const STORAGE_KEY = 'laburito_favorites_v1';
const STORAGE_VERSION = 'v1';

// Schema: Array of strings (service IDs) or numbers if IDs vary
const favoritesListSchema = z.array(z.union([z.string(), z.number()]));

// Migration: If we ever change structure
const migrateFavorites = (data, oldVersion) => {
    return data;
};

const LEGACY_KEY = 'laburito_favorites';

export const favoritesApi = {
    getAll: () => {
        return storage.get(STORAGE_KEY, STORAGE_VERSION, favoritesListSchema, migrateFavorites, LEGACY_KEY) || [];
    },

    toggle: (serviceId) => {
        const current = storage.get(STORAGE_KEY, STORAGE_VERSION, favoritesListSchema, migrateFavorites, LEGACY_KEY) || [];
        let updated;

        if (current.includes(serviceId)) {
            updated = current.filter(id => id !== serviceId);
        } else {
            updated = [...current, serviceId];
        }

        storage.set(STORAGE_KEY, updated, STORAGE_VERSION);
        return updated;
    }
};
