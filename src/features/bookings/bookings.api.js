import { storage } from '../../lib/storage';
import { BOOKING_STATUS, bookingSchema } from './bookings.schemas';
import { z } from 'zod';

const STORAGE_KEY = 'laburito_bookings_v1';
const STORAGE_VERSION = 'v1';

// Schema for the array of bookings
const bookingsListSchema = z.array(bookingSchema);

// Migration function (placeholder for V2+)
const migrateBookings = (data, oldVersion) => {
    return data;
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const LEGACY_KEY = 'laburito_bookings';

export const bookingsApi = {
    getAll: async () => {
        await delay(500);
        return storage.get(STORAGE_KEY, STORAGE_VERSION, bookingsListSchema, migrateBookings, LEGACY_KEY) || [];
    },

    getByClientId: async (clientId) => {
        await delay(500);
        const all = storage.get(STORAGE_KEY, STORAGE_VERSION, bookingsListSchema, migrateBookings, LEGACY_KEY) || [];
        return all.filter(b => b.clientId === clientId);
    },

    getByProviderId: async (providerId) => {
        await delay(500);
        const all = storage.get(STORAGE_KEY, STORAGE_VERSION, bookingsListSchema, migrateBookings, LEGACY_KEY) || [];
        return all.filter(b => b.providerId === providerId);
    },

    create: async (bookingData) => {
        await delay(1000);
        // Ensure we try to migrate even on create if listing hasn't been called yet
        const all = storage.get(STORAGE_KEY, STORAGE_VERSION, bookingsListSchema, migrateBookings, LEGACY_KEY) || [];

        const newBooking = {
            ...bookingData,
            id: `bk_${Date.now()}`,
            status: BOOKING_STATUS.PENDING_CONFIRMATION,
            createdAt: new Date().toISOString()
        };

        const updated = [...all, newBooking];
        storage.set(STORAGE_KEY, updated, STORAGE_VERSION);
        return newBooking;
    },

    updateStatus: async ({ id, status }) => {
        await delay(500);
        const all = storage.get(STORAGE_KEY, STORAGE_VERSION, bookingsListSchema, migrateBookings, LEGACY_KEY) || [];
        const index = all.findIndex(b => b.id === id);

        if (index === -1) throw new Error("Booking not found");

        const updatedBooking = { ...all[index], status };
        all[index] = updatedBooking;

        storage.set(STORAGE_KEY, all, STORAGE_VERSION);
        return updatedBooking;
    }
};
