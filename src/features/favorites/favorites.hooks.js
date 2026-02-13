import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from './favorites.api';

export const FAVORITE_KEYS = {
    all: ['favorites'],
};

export const useFavorites = () => {
    return useQuery({
        queryKey: FAVORITE_KEYS.all,
        queryFn: favoritesApi.getAll,
    });
};

export const useToggleFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: favoritesApi.toggle,
        onSuccess: (newFavorites) => {
            queryClient.setQueryData(FAVORITE_KEYS.all, newFavorites);
        }
    });
};
