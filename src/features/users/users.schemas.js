import { z } from 'zod';

export const USER_ROLES = {
    CLIENT: 'CLIENT',
    SELLER: 'SELLER',
    COMPANY: 'COMPANY',
    ADMIN: 'ADMIN'
};

export const VERIFICATION_LEVEL = {
    NONE: 'NONE',
    BASIC: 'BASIC',
    VERIFIED: 'VERIFIED'
};

export const addressSchema = z.object({
    id: z.string(),
    street: z.string().min(1, "La calle es obligatoria"),
    number: z.string().min(1, "El número es obligatorio"),
    floor: z.string().optional(),
    apartment: z.string().optional(),
    city: z.string().min(1, "La ciudad es obligatoria"),
    province: z.string().min(1, "La provincia es obligatoria"),
    zipCode: z.string().optional(),
    isDefault: z.boolean().default(false)
});

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email("Email inválido"),
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    phone: z.string().optional(),
    avatar: z.string().optional(),

    roles: z.array(z.enum(Object.values(USER_ROLES))).default([USER_ROLES.CLIENT]),

    addresses: z.array(addressSchema).default([]),
    defaultAddressId: z.string().optional(),

    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional()
});

export const sellerProfileSchema = z.object({
    userId: z.string(), // Link to User
    bio: z.string().optional(),
    skills: z.array(z.string()).default([]),
    rating: z.number().min(0).max(5).default(0),
    reviewCount: z.number().default(0),
    verificationLevel: z.enum(Object.values(VERIFICATION_LEVEL)).default(VERIFICATION_LEVEL.NONE),
    cuit: z.string().optional(), // Tax ID
    portfolio: z.array(z.string()).default([]) // URLs
});

export const companyProfileSchema = z.object({
    userId: z.string(), // Link to User
    companyName: z.string().min(1, "Nombre de empresa requerido"),
    description: z.string().optional(),
    website: z.string().url().optional(),
    verificationLevel: z.enum(Object.values(VERIFICATION_LEVEL)).default(VERIFICATION_LEVEL.NONE),
    taxId: z.string().optional(),
    logo: z.string().optional()
});
