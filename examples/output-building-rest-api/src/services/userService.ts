import { randomUUID } from 'crypto';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserResponse,
  PaginatedUsersResponse,
  ListUsersQuery,
} from '../models/user';

/**
 * In-memory data store for users
 * In a production app, this would be replaced with a database
 */
class UserStore {
  private users: Map<string, User> = new Map();

  /**
   * Add a user to the store
   */
  set(id: string, user: User): void {
    this.users.set(id, user);
  }

  /**
   * Get a user by ID
   */
  get(id: string): User | undefined {
    return this.users.get(id);
  }

  /**
   * Get all users
   */
  getAll(): User[] {
    return Array.from(this.users.values());
  }

  /**
   * Delete a user by ID
   */
  delete(id: string): boolean {
    return this.users.delete(id);
  }

  /**
   * Check if a user exists
   */
  has(id: string): boolean {
    return this.users.has(id);
  }

  /**
   * Get total count of users
   */
  count(): number {
    return this.users.size;
  }

  /**
   * Clear all users (useful for testing)
   */
  clear(): void {
    this.users.clear();
  }
}

/**
 * User service class
 * Handles all business logic for user management
 */
export class UserService {
  private store: UserStore;

  constructor() {
    this.store = new UserStore();
  }

  /**
   * Create a new user
   * @param userData - User data from request
   * @returns Created user
   */
  createUser(userData: CreateUserDto): UserResponse {
    const now = new Date();
    const user: User = {
      id: randomUUID(),
      email: userData.email.trim(),
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      age: userData.age,
      createdAt: now,
      updatedAt: now,
    };

    this.store.set(user.id, user);
    return user;
  }

  /**
   * Find a user by ID
   * @param id - User ID
   * @returns User if found, undefined otherwise
   */
  findUserById(id: string): UserResponse | null {
    return this.store.get(id) || null;
  }

  /**
   * List all users with pagination
   * @param query - Query parameters for pagination
   * @returns Paginated list of users
   */
  listUsers(query: ListUsersQuery = {}): PaginatedUsersResponse {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    const allUsers = this.store.getAll();
    const total = allUsers.length;
    const totalPages = Math.ceil(total / pageSize);

    // Sort by createdAt descending (newest first)
    const sortedUsers = allUsers.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Update an existing user
   * @param id - User ID
   * @param updateData - Fields to update
   * @returns Updated user if found, undefined otherwise
   */
  updateUser(id: string, updateData: UpdateUserDto): UserResponse | null {
    const existingUser = this.store.get(id);
    
    if (!existingUser) {
      return null;
    }

    // Trim string fields if provided and handle null age
    const trimmedData: Partial<User> = {};
    if ('email' in updateData) {
      trimmedData.email = updateData.email?.trim();
    }
    if ('firstName' in updateData) {
      trimmedData.firstName = updateData.firstName?.trim();
    }
    if ('lastName' in updateData) {
      trimmedData.lastName = updateData.lastName?.trim();
    }
    if ('age' in updateData) {
      // Convert null to undefined for User interface compatibility
      trimmedData.age = updateData.age === null ? undefined : updateData.age;
    }

    const updatedUser: User = {
      ...existingUser,
      ...trimmedData,
      updatedAt: new Date(),
    };

    this.store.set(id, updatedUser);
    return updatedUser;
  }

  /**
   * Delete a user by ID
   * @param id - User ID
   * @returns true if deleted, false if not found
   */
  deleteUser(id: string): boolean {
    return this.store.delete(id);
  }

  /**
   * Check if a user exists
   * @param id - User ID
   * @returns true if user exists, false otherwise
   */
  userExists(id: string): boolean {
    return this.store.has(id);
  }

  /**
   * Get total count of users
   * @returns Total number of users
   */
  getUserCount(): number {
    return this.store.count();
  }

  /**
   * Clear all users (for testing purposes)
   */
  clearAllUsers(): void {
    this.store.clear();
  }
}

// Export singleton instance
export const userService = new UserService();
