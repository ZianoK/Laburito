import { z } from 'zod';

export const BOOKING_STATUS = {
    PENDING_CONFIRMATION: 'PENDING_CONFIRMATION',
    CONFIRMED: 'CONFIRMED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

export const bookingSchema = z.object({
    id: z.string(),
    serviceId: z.number(), // MOCK_SERVICES uses number IDs
    providerId: z.string().optional(), // For now optional as we use MOCK data
    clientId: z.string(),

    // Relaxed validation for selectedOption as it might come in different shapes
    selectedOption: z.any(),

    dates: z.array(z.string()).min(1, "Debés seleccionar al menos una fecha"),

    paymentMethod: z.string(), // z.enum(['cash', 'transfer', 'debit']) was too strict if UI sends something else

    status: z.enum(Object.values(BOOKING_STATUS)),

    totalAmount: z.number().min(0),

    createdAt: z.string(), // z.datetime() can be strict on format

    // UI/Denormalized fields - make them all optional
    serviceName: z.string().optional(),
    serviceTitle: z.string().optional(),
    serviceImage: z.string().optional(),
    providerName: z.string().optional(),

    // Optional: Extra details from wizard
    notes: z.string().optional()
}).passthrough(); // Allow unknown fields without stripping or erroring

export const createBookingSchema = bookingSchema.omit({
    id: true,
    status: true,
    createdAt: true,
    clientId: true // we inject this from context
});
