import { userService } from '../../src/services/userService';
import type { CreateUserDto, UpdateUserDto } from '../../src/models/user';

describe('UserService', () => {
  beforeEach(() => {
    // Clear all users before each test
    userService.clearAllUsers();
  });

  describe('createUser', () => {
    it('should create a new user with valid data', () => {
      const userData: CreateUserDto = {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      };

      const user = userService.createUser(userData);

      expect(user).toMatchObject({
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      });
      expect(user.id).toBeDefined();
      expect(typeof user.id).toBe('string');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.createdAt).toEqual(user.updatedAt);
    });

    it('should create a user without optional age field', () => {
      const userData: CreateUserDto = {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const user = userService.createUser(userData);

      expect(user.age).toBeUndefined();
      expect(user.email).toBe('jane.smith@example.com');
    });

    it('should trim whitespace from string fields', () => {
      const userData: CreateUserDto = {
        email: '  test@example.com  ',
        firstName: '  John  ',
        lastName: '  Doe  ',
      };

      const user = userService.createUser(userData);

      expect(user.email).toBe('test@example.com');
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
    });

    it('should generate unique IDs for multiple users', () => {
      const user1 = userService.createUser({
        email: 'user1@example.com',
        firstName: 'User',
        lastName: 'One',
      });

      const user2 = userService.createUser({
        email: 'user2@example.com',
        firstName: 'User',
        lastName: 'Two',
      });

      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe('findUserById', () => {
    it('should return a user when found', () => {
      const created = userService.createUser({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      });

      const found = userService.findUserById(created.id);

      expect(found).toEqual(created);
    });

    it('should return null when user not found', () => {
      const found = userService.findUserById('non-existent-id');

      expect(found).toBeNull();
    });

    it('should return null for empty string ID', () => {
      const found = userService.findUserById('');

      expect(found).toBeNull();
    });
  });

  describe('listUsers', () => {
    beforeEach(() => {
      // Create test users
      for (let i = 1; i <= 25; i++) {
        userService.createUser({
          email: `user${i}@example.com`,
          firstName: `User${i}`,
          lastName: `Test${i}`,
          age: 20 + i,
        });
      }
    });

    it('should return paginated users with default parameters', () => {
      const result = userService.listUsers();

      expect(result.users).toHaveLength(10); // Default pageSize
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.total).toBe(25);
      expect(result.totalPages).toBe(3);
    });

    it('should return correct page of users', () => {
      const page1 = userService.listUsers({ page: 1, pageSize: 10 });
      const page2 = userService.listUsers({ page: 2, pageSize: 10 });

      expect(page1.users).toHaveLength(10);
      expect(page2.users).toHaveLength(10);
      expect(page1.users[0].id).not.toBe(page2.users[0].id);
    });

    it('should handle custom page size', () => {
      const result = userService.listUsers({ page: 1, pageSize: 5 });

      expect(result.users).toHaveLength(5);
      expect(result.pageSize).toBe(5);
      expect(result.totalPages).toBe(5);
    });

    it('should return remaining users on last page', () => {
      const result = userService.listUsers({ page: 3, pageSize: 10 });

      expect(result.users).toHaveLength(5); // 25 total, 20 on first 2 pages
      expect(result.page).toBe(3);
    });

    it('should return empty array for page beyond total pages', () => {
      const result = userService.listUsers({ page: 10, pageSize: 10 });

      expect(result.users).toHaveLength(0);
      expect(result.page).toBe(10);
      expect(result.total).toBe(25);
    });

    it('should return users sorted by creation date (newest first)', () => {
      const result = userService.listUsers({ page: 1, pageSize: 25 });

      // Users should be in reverse creation order
      for (let i = 0; i < result.users.length - 1; i++) {
        expect(result.users[i].createdAt.getTime()).toBeGreaterThanOrEqual(
          result.users[i + 1].createdAt.getTime()
        );
      }
    });

    it('should return empty list when no users exist', () => {
      userService.clearAllUsers();
      const result = userService.listUsers();

      expect(result.users).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('updateUser', () => {
    let userId: string;

    beforeEach(() => {
      const user = userService.createUser({
        email: 'original@example.com',
        firstName: 'Original',
        lastName: 'User',
        age: 25,
      });
      userId = user.id;
    });

    it('should update user fields', () => {
      const updateData: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Name',
        age: 30,
      };

      const updated = userService.updateUser(userId, updateData);

      expect(updated).not.toBeNull();
      expect(updated?.firstName).toBe('Updated');
      expect(updated?.lastName).toBe('Name');
      expect(updated?.age).toBe(30);
      expect(updated?.email).toBe('original@example.com'); // Unchanged
    });

    it('should update only provided fields', () => {
      const updateData: UpdateUserDto = {
        firstName: 'NewFirst',
      };

      const updated = userService.updateUser(userId, updateData);

      expect(updated?.firstName).toBe('NewFirst');
      expect(updated?.lastName).toBe('User'); // Unchanged
      expect(updated?.age).toBe(25); // Unchanged
    });

    it('should update the updatedAt timestamp', async () => {
      const original = userService.findUserById(userId);
      
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      const updated = userService.updateUser(userId, { firstName: 'New' });

      expect(updated?.updatedAt.getTime()).toBeGreaterThan(
        original!.updatedAt.getTime()
      );
      expect(updated?.createdAt).toEqual(original?.createdAt); // Unchanged
    });

    it('should trim whitespace from updated fields', () => {
      const updateData: UpdateUserDto = {
        firstName: '  Trimmed  ',
        lastName: '  Name  ',
      };

      const updated = userService.updateUser(userId, updateData);

      expect(updated?.firstName).toBe('Trimmed');
      expect(updated?.lastName).toBe('Name');
    });

    it('should return null when user not found', () => {
      const updated = userService.updateUser('non-existent-id', {
        firstName: 'Test',
      });

      expect(updated).toBeNull();
    });

    it('should handle empty update object', () => {
      const original = userService.findUserById(userId);
      const updated = userService.updateUser(userId, {});

      expect(updated).toEqual(original);
    });

    it('should allow removing optional age field', () => {
      const updated = userService.updateUser(userId, { age: undefined });

      expect(updated?.age).toBeUndefined();
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', () => {
      const user = userService.createUser({
        email: 'delete@example.com',
        firstName: 'Delete',
        lastName: 'Me',
      });

      const deleted = userService.deleteUser(user.id);

      expect(deleted).toBe(true);
      expect(userService.findUserById(user.id)).toBeNull();
    });

    it('should return false when user not found', () => {
      const deleted = userService.deleteUser('non-existent-id');

      expect(deleted).toBe(false);
    });

    it('should decrease user count after deletion', () => {
      const user = userService.createUser({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      });

      const countBefore = userService.getUserCount();
      userService.deleteUser(user.id);
      const countAfter = userService.getUserCount();

      expect(countAfter).toBe(countBefore - 1);
    });
  });

  describe('userExists', () => {
    it('should return true for existing user', () => {
      const user = userService.createUser({
        email: 'exists@example.com',
        firstName: 'Exists',
        lastName: 'User',
      });

      expect(userService.userExists(user.id)).toBe(true);
    });

    it('should return false for non-existent user', () => {
      expect(userService.userExists('non-existent-id')).toBe(false);
    });
  });

  describe('getUserCount', () => {
    it('should return 0 when no users exist', () => {
      expect(userService.getUserCount()).toBe(0);
    });

    it('should return correct count after creating users', () => {
      userService.createUser({
        email: 'user1@example.com',
        firstName: 'User',
        lastName: 'One',
      });
      userService.createUser({
        email: 'user2@example.com',
        firstName: 'User',
        lastName: 'Two',
      });

      expect(userService.getUserCount()).toBe(2);
    });

    it('should update count after deletion', () => {
      const user = userService.createUser({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(userService.getUserCount()).toBe(1);
      userService.deleteUser(user.id);
      expect(userService.getUserCount()).toBe(0);
    });
  });

  describe('clearAllUsers', () => {
    it('should remove all users', () => {
      userService.createUser({
        email: 'user1@example.com',
        firstName: 'User',
        lastName: 'One',
      });
      userService.createUser({
        email: 'user2@example.com',
        firstName: 'User',
        lastName: 'Two',
      });

      expect(userService.getUserCount()).toBe(2);

      userService.clearAllUsers();

      expect(userService.getUserCount()).toBe(0);
      expect(userService.listUsers().users).toHaveLength(0);
    });
  });
});
