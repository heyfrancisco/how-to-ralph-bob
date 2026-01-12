import { z } from 'zod';

/**
 * User entity interface
 * Represents a user in the system with all required and optional fields
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Zod schema for creating a new user
 * Validates input data when creating a user
 */
export const createUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .trim(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .trim(),
  age: z
    .number()
    .int('Age must be an integer')
    .min(1, 'Age must be at least 1')
    .max(150, 'Age must not exceed 150')
    .optional(),
});

/**
 * Zod schema for updating an existing user
 * All fields are optional to allow partial updates
 */
export const updateUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .optional(),
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .trim()
    .optional(),
  age: z
    .number()
    .int('Age must be an integer')
    .min(1, 'Age must be at least 1')
    .max(150, 'Age must not exceed 150')
    .optional(),
});

/**
 * Type for creating a new user (inferred from Zod schema)
 */
export type CreateUserDto = z.infer<typeof createUserSchema>;

/**
 * Type for updating an existing user (inferred from Zod schema)
 */
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

/**
 * Type for user response (excludes sensitive data if needed in future)
 */
export type UserResponse = User;

/**
 * Type for paginated user list response
 */
export interface PaginatedUsersResponse {
  users: UserResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Query parameters for listing users
 */
export interface ListUsersQuery {
  page?: number;
  pageSize?: number;
}
