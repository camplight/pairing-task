import { z } from 'zod';

// User
export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
});

// List of users
export const UserListSchema = z.object({
    users: z.array(UserSchema),
});