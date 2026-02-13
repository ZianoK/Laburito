import { z } from 'zod';

export const favoriteSchema = z.number(); // Just the service ID
export const favoritesListSchema = z.array(favoriteSchema);
