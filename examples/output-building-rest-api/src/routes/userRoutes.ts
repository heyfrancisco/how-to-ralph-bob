import { Router } from 'express';
import { userController } from '../controllers/userController';

/**
 * User routes
 * Defines all endpoints for user management
 */
const router = Router();

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 * @body    { email, firstName, lastName, age? }
 * @returns 201 - Created user
 * @returns 400 - Validation error
 */
router.post('/', (req, res, next) => userController.createUser(req, res, next));

/**
 * @route   GET /api/users/:id
 * @desc    Get a user by ID
 * @access  Public
 * @param   id - User ID (UUID)
 * @returns 200 - User data
 * @returns 404 - User not found
 */
router.get('/:id', (req, res, next) => userController.getUserById(req, res, next));

/**
 * @route   GET /api/users
 * @desc    List all users with pagination
 * @access  Public
 * @query   page - Page number (default: 1)
 * @query   pageSize - Items per page (default: 10, max: 100)
 * @returns 200 - Paginated list of users
 * @returns 400 - Invalid pagination parameters
 */
router.get('/', (req, res, next) => userController.listUsers(req, res, next));

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user
 * @access  Public
 * @param   id - User ID (UUID)
 * @body    { email?, firstName?, lastName?, age? }
 * @returns 200 - Updated user
 * @returns 400 - Validation error
 * @returns 404 - User not found
 */
router.put('/:id', (req, res, next) => userController.updateUser(req, res, next));

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 * @access  Public
 * @param   id - User ID (UUID)
 * @returns 204 - User deleted successfully
 * @returns 404 - User not found
 */
router.delete('/:id', (req, res, next) => userController.deleteUser(req, res, next));

export default router;
