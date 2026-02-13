import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from './bookings.api';
import { useCurrentUser } from '../auth/useCurrentUser';

export const BOOKING_KEYS = {
    all: ['bookings'],
    list: (clientId) => [...BOOKING_KEYS.all, 'list', clientId],
    detail: (id) => [...BOOKING_KEYS.all, 'detail', id],
};

export const useBookings = () => {
    const { user } = useCurrentUser();
    return useQuery({
        queryKey: BOOKING_KEYS.list(user?.id),
        queryFn: () => bookingsApi.getByClientId(user?.id),
        enabled: !!user,
    });
};

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    const { user } = useCurrentUser();

    return useMutation({
        mutationFn: (data) => {
            if (!user) throw new Error("Debes iniciar sesión");
            return bookingsApi.create({ ...data, clientId: user.id });
        },
        onSuccess: () => {
            // Invalidate list for *this* user
            queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.list(user?.id) });
        }
    });
};

export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    const { user } = useCurrentUser();

    return useMutation({
        mutationFn: bookingsApi.updateStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.list(user?.id) });
            // Also invalidate provider bookings if applicable
            queryClient.invalidateQueries({ queryKey: [...BOOKING_KEYS.all, 'provider', user?.id] });
        }
    });
};

export const useProviderBookings = () => {
    const { user } = useCurrentUser();
    return useQuery({
        queryKey: [...BOOKING_KEYS.all, 'provider', user?.id],
        queryFn: () => bookingsApi.getByProviderId(user?.id),
        enabled: !!user,
    });
};
