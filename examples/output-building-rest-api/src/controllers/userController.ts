import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import {
  createUserSchema,
  updateUserSchema,
  CreateUserDto,
  UpdateUserDto,
} from '../models/user';
import { ZodError, ZodIssue } from 'zod';

/**
 * User controller
 * Handles HTTP requests for user management endpoints
 */
export class UserController {
  /**
   * Create a new user
   * POST /api/users
   */
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate request body
      const validatedData: CreateUserDto = createUserSchema.parse(req.body);

      // Create user
      const user = userService.createUser(validatedData);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.issues.map((err: ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  }

  /**
   * Get a user by ID
   * GET /api/users/:id
   */
  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id as string;

      const user = userService.findUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
          message: `User with ID ${id} does not exist`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all users with pagination
   * GET /api/users
   */
  async listUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize as string, 10)
        : 10;

      // Validate pagination parameters
      if (page < 1 || pageSize < 1 || pageSize > 100) {
        res.status(400).json({
          success: false,
          error: 'Invalid pagination parameters',
          message: 'Page must be >= 1, pageSize must be between 1 and 100',
        });
        return;
      }

      const result = userService.listUsers({ page, pageSize });

      res.status(200).json({
        success: true,
        data: {
          users: result.users,
          pagination: {
            page: result.page,
            pageSize: result.pageSize,
            total: result.total,
            totalPages: result.totalPages,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a user
   * PUT /api/users/:id
   */
  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id as string;

      // Check if user exists
      if (!userService.userExists(id)) {
        res.status(404).json({
          success: false,
          error: 'User not found',
          message: `User with ID ${id} does not exist`,
        });
        return;
      }

      // Validate request body
      const validatedData: UpdateUserDto = updateUserSchema.parse(req.body);

      // Check if at least one field is provided
      if (Object.keys(validatedData).length === 0) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'At least one field must be provided for update',
        });
        return;
      }

      // Update user
      const updatedUser = userService.updateUser(id, validatedData);

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.issues.map((err: ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  }

  /**
   * Delete a user
   * DELETE /api/users/:id
   */
  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id as string;

      const deleted = userService.deleteUser(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'User not found',
          message: `User with ID ${id} does not exist`,
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const userController = new UserController();
