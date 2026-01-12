import request from 'supertest';
import app from '../../src/app';
import { userService } from '../../src/services/userService';

describe('User API Integration Tests', () => {
  beforeEach(() => {
    // Clear all users before each test
    userService.clearAllUsers();
  });

  describe('POST /api/users', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });

    it('should create a user without optional age field', async () => {
      const userData = {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.age).toBeUndefined();
    });

    it('should trim whitespace from string fields', async () => {
      const userData = {
        email: '  test@example.com  ',
        firstName: '  John  ',
        lastName: '  Doe  ',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.firstName).toBe('John');
      expect(response.body.data.lastName).toBe('Doe');
    });

    it('should return 400 for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.details).toBeDefined();
    });

    it('should return 400 for missing required fields', async () => {
      const userData = {
        email: 'test@example.com',
        // Missing firstName and lastName
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details).toHaveLength(2); // Two missing fields
    });

    it('should return 400 for firstName too short', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'J',
        lastName: 'Doe',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for age out of range', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 200,
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should retrieve an existing user by ID', async () => {
      // Create a user first
      const user = userService.createUser({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        age: 25,
      });

      const response = await request(app)
        .get(`/api/users/${user.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
      });
    });

    it('should return 404 for non-existent user ID', async () => {
      const response = await request(app)
        .get('/api/users/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('GET /api/users', () => {
    it('should return empty list when no users exist', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toEqual([]);
      expect(response.body.data.pagination).toMatchObject({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      });
    });

    it('should return list of users with default pagination', async () => {
      // Create multiple users
      for (let i = 1; i <= 5; i++) {
        userService.createUser({
          email: `user${i}@example.com`,
          firstName: `User${i}`,
          lastName: `Test${i}`,
        });
      }

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toHaveLength(5);
      expect(response.body.data.pagination).toMatchObject({
        page: 1,
        pageSize: 10,
        total: 5,
        totalPages: 1,
      });
    });

    it('should support custom page size', async () => {
      // Create 5 users
      for (let i = 1; i <= 5; i++) {
        userService.createUser({
          email: `user${i}@example.com`,
          firstName: `User${i}`,
          lastName: `Test${i}`,
        });
      }

      const response = await request(app)
        .get('/api/users?pageSize=2')
        .expect(200);

      expect(response.body.data.users).toHaveLength(2);
      expect(response.body.data.pagination).toMatchObject({
        page: 1,
        pageSize: 2,
        total: 5,
        totalPages: 3,
      });
    });

    it('should support pagination with page parameter', async () => {
      // Create 5 users
      for (let i = 1; i <= 5; i++) {
        userService.createUser({
          email: `user${i}@example.com`,
          firstName: `User${i}`,
          lastName: `Test${i}`,
        });
      }

      const response = await request(app)
        .get('/api/users?page=2&pageSize=2')
        .expect(200);

      expect(response.body.data.users).toHaveLength(2);
      expect(response.body.data.pagination.page).toBe(2);
    });

    it('should return 400 for invalid page parameter', async () => {
      const response = await request(app)
        .get('/api/users?page=0')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid pageSize parameter', async () => {
      const response = await request(app)
        .get('/api/users?pageSize=200')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should sort users by creation date (newest first)', async () => {
      // Create users with slight delays to ensure different timestamps
      const user1 = userService.createUser({
        email: 'first@example.com',
        firstName: 'First',
        lastName: 'User',
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      const user2 = userService.createUser({
        email: 'second@example.com',
        firstName: 'Second',
        lastName: 'User',
      });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.data.users[0].id).toBe(user2.id);
      expect(response.body.data.users[1].id).toBe(user1.id);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update an existing user with full data', async () => {
      const user = userService.createUser({
        email: 'old@example.com',
        firstName: 'Old',
        lastName: 'Name',
        age: 25,
      });

      const updateData = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'Name',
        age: 30,
      };

      const response = await request(app)
        .put(`/api/users/${user.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject(updateData);
      expect(response.body.data.updatedAt).not.toBe(user.updatedAt);
    });

    it('should update user with partial data', async () => {
      const user = userService.createUser({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
      });

      const updateData = {
        firstName: 'Jane',
      };

      const response = await request(app)
        .put(`/api/users/${user.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.firstName).toBe('Jane');
      expect(response.body.data.lastName).toBe('Doe'); // Unchanged
      expect(response.body.data.email).toBe('test@example.com'); // Unchanged
    });

    it('should trim whitespace in update data', async () => {
      const user = userService.createUser({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      const updateData = {
        firstName: '  Jane  ',
        lastName: '  Smith  ',
      };

      const response = await request(app)
        .put(`/api/users/${user.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.firstName).toBe('Jane');
      expect(response.body.data.lastName).toBe('Smith');
    });

    it('should return 404 for non-existent user', async () => {
      const updateData = {
        firstName: 'New',
      };

      const response = await request(app)
        .put('/api/users/non-existent-id')
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid update data', async () => {
      const user = userService.createUser({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      const updateData = {
        email: 'invalid-email',
      };

      const response = await request(app)
        .put(`/api/users/${user.id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should allow removing optional age field', async () => {
      const user = userService.createUser({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
      });

      const updateData = {
        age: null,
      };

      const response = await request(app)
        .put(`/api/users/${user.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.age).toBeUndefined();
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete an existing user', async () => {
      const user = userService.createUser({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      });

      await request(app)
        .delete(`/api/users/${user.id}`)
        .expect(204);

      // Verify user is deleted
      const getResponse = await request(app)
        .get(`/api/users/${user.id}`)
        .expect(404);

      expect(getResponse.body.success).toBe(false);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/api/users/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should decrease user count after deletion', async () => {
      const user1 = userService.createUser({
        email: 'user1@example.com',
        firstName: 'User1',
        lastName: 'Test',
      });

      const user2 = userService.createUser({
        email: 'user2@example.com',
        firstName: 'User2',
        lastName: 'Test',
      });

      expect(userService.getUserCount()).toBe(2);

      await request(app)
        .delete(`/api/users/${user1.id}`)
        .expect(204);

      expect(userService.getUserCount()).toBe(1);

      // Verify remaining user is still accessible
      await request(app)
        .get(`/api/users/${user2.id}`)
        .expect(200);
    });
  });

  describe('Health Check', () => {
    it('should return 200 for health check endpoint', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'ok',
        timestamp: expect.any(String),
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });
});
