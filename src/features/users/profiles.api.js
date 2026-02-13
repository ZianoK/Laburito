import { storage } from '../../lib/storage';
import { sellerProfileSchema, companyProfileSchema, VERIFICATION_LEVEL } from './users.schemas';
import { z } from 'zod';

const STORAGE_KEY = 'laburito_profiles_v1';
const STORAGE_VERSION = 'v1';

// Combined schema for storage simply as a container
const profilesContainerSchema = z.object({
    sellers: z.array(sellerProfileSchema),
    companies: z.array(companyProfileSchema)
});

const INITIAL_PROFILES = {
    sellers: [
        {
            userId: 'u2',
            bio: 'Plomero experto con 10 años de experiencia.',
            skills: ['Plomería', 'Gas', 'Calefacción'],
            rating: 4.8,
            reviewCount: 15,
            verificationLevel: VERIFICATION_LEVEL.VERIFIED,
            portfolio: []
        }
    ],
    companies: [
        {
            userId: 'u3',
            companyName: 'Servicios SA',
            description: 'Soluciones integrales para el hogar.',
            verificationLevel: VERIFICATION_LEVEL.BASIC,
            website: 'https://servicios-sa.com'
        }
    ]
};

const migrateProfiles = (data) => data;

export const profilesApi = {
    getAll: () => {
        const data = storage.get(STORAGE_KEY, STORAGE_VERSION, profilesContainerSchema, migrateProfiles);
        if (!data) {
            storage.set(STORAGE_KEY, INITIAL_PROFILES, STORAGE_VERSION);
            return INITIAL_PROFILES;
        }
        return data;
    },

    getSellerProfile: (userId) => {
        const data = profilesApi.getAll();
        return data.sellers.find(p => p.userId === userId) || null;
    },

    getCompanyProfile: (userId) => {
        const data = profilesApi.getAll();
        return data.companies.find(p => p.userId === userId) || null;
    },

    updateSellerProfile: (userId, updates) => {
        const data = profilesApi.getAll();
        const index = data.sellers.findIndex(p => p.userId === userId);

        let newProfile;
        if (index === -1) {
            // Create if not exists
            newProfile = { userId, ...updates }; // Validation should happen before
            data.sellers.push(newProfile);
        } else {
            newProfile = { ...data.sellers[index], ...updates };
            data.sellers[index] = newProfile;
        }

        storage.set(STORAGE_KEY, data, STORAGE_VERSION);
        return newProfile;
    }
};
