import { Request, Response, NextFunction } from 'express';
import { ApiError, errorHandler, notFoundHandler } from '../../src/middleware/errorHandler';

describe('ApiError', () => {
  it('should create an ApiError with status code and message', () => {
    const error = new ApiError(400, 'Test error');
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
    expect(error).toBeInstanceOf(Error);
  });

  it('should create an ApiError with 500 status code', () => {
    const error = new ApiError(500, 'Server error');
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Server error');
  });

  it('should default isOperational to true', () => {
    const error = new ApiError(400, 'Test error');
    expect(error.isOperational).toBe(true);
  });

  it('should allow setting isOperational to false', () => {
    const error = new ApiError(500, 'Test error', false);
    expect(error.isOperational).toBe(false);
  });

  it('should capture stack trace', () => {
    const error = new ApiError(400, 'Test error');
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('Error');
  });
});

describe('notFoundHandler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockReq = {
      method: 'GET',
      path: '/api/nonexistent',
    };
    mockRes = {
      status: statusMock,
    };
    mockNext = jest.fn();
  });

  it('should return 404 with proper error message', () => {
    notFoundHandler(mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: 'not found',
      message: 'Route GET /api/nonexistent not found',
    });
  });

  it('should include request method in error message', () => {
    const postReq = {
      method: 'POST',
      path: '/api/test',
    } as Partial<Request>;

    notFoundHandler(postReq as Request, mockRes as Response, mockNext);

    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: 'not found',
      message: 'Route POST /api/test not found',
    });
  });
});

describe('errorHandler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockReq = {
      path: '/api/test',
      method: 'GET',
    };
    mockRes = {
      status: statusMock,
    };
    mockNext = jest.fn();

    // Reset NODE_ENV to test
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle ApiError with 400 status code', () => {
    const error = new ApiError(400, 'Bad request error');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: 'Request failed',
      message: 'Bad request error',
    });
  });

  it('should handle ApiError with 404 status', () => {
    const error = new ApiError(404, 'User not found');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: 'Request failed',
      message: 'User not found',
    });
  });

  it('should handle ApiError with 500 status code', () => {
    const error = new ApiError(500, 'Server error');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: 'Internal server error',
      message: 'Server error',
    });
  });

  it('should handle generic Error with 500 status', () => {
    const error = new Error('Something went wrong');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    });
  });

  it('should include stack trace in development mode', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Dev error');
    error.stack = 'Error: Dev error\n    at test.ts:1:1';

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
    const response = jsonMock.mock.calls[0][0];
    expect(response.stack).toBe('Error: Dev error\n    at test.ts:1:1');
  });

  it('should not include stack trace in production mode', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Prod error');
    error.stack = 'Error: Prod error\n    at test.ts:1:1';

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
    const response = jsonMock.mock.calls[0][0];
    expect(response.stack).toBeUndefined();
  });

  it('should handle non-operational ApiError', () => {
    const error = new ApiError(500, 'Critical error', false);

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    });
  });

  it('should handle operational ApiError with custom message', () => {
    const error = new ApiError(403, 'Access denied', true);

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: 'Request failed',
      message: 'Access denied',
    });
  });

  it('should use "Internal server error" for 5xx status codes', () => {
    const error = new ApiError(503, 'Service unavailable');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(503);
    const response = jsonMock.mock.calls[0][0];
    expect(response.error).toBe('Internal server error');
  });

  it('should use "Request failed" for 4xx status codes', () => {
    const error = new ApiError(401, 'Unauthorized');

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(401);
    const response = jsonMock.mock.calls[0][0];
    expect(response.error).toBe('Request failed');
  });

  it('should handle errors without message', () => {
    const error = new Error();

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    });
  });
});
