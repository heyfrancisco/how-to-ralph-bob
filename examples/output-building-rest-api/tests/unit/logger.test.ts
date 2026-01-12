import { logger } from '../../src/utils/logger';

describe('Logger', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;
  let originalEnv: string | undefined;

  beforeEach(() => {
    // Spy on console methods
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    
    // Save original LOG_LEVEL
    originalEnv = process.env.LOG_LEVEL;
  });

  afterEach(() => {
    // Restore console methods
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleDebugSpy.mockRestore();
    
    // Restore LOG_LEVEL
    if (originalEnv !== undefined) {
      process.env.LOG_LEVEL = originalEnv;
    } else {
      delete process.env.LOG_LEVEL;
    }
  });

  describe('error', () => {
    it('should log error messages', () => {
      logger.error('Test error');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('[ERROR]');
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('Test error');
    });

    it('should log error messages with metadata', () => {
      logger.error('Test error', { code: 500 });
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('[ERROR]');
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('Test error');
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('"code":500');
    });

    it('should always log errors regardless of log level', () => {
      process.env.LOG_LEVEL = 'ERROR';
      logger.error('Test error');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      process.env.LOG_LEVEL = 'WARN';
      logger.warn('Test warning');
      
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('[WARN]');
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('Test warning');
    });

    it('should log warning messages with metadata', () => {
      process.env.LOG_LEVEL = 'WARN';
      logger.warn('Test warning', { status: 'deprecated' });
      
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('[WARN]');
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('Test warning');
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('"status":"deprecated"');
    });

    it('should not log warnings when log level is ERROR', () => {
      process.env.LOG_LEVEL = 'ERROR';
      logger.warn('Test warning');
      
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log warnings when log level is INFO', () => {
      process.env.LOG_LEVEL = 'INFO';
      logger.warn('Test warning');
      
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      process.env.LOG_LEVEL = 'INFO';
      logger.info('Test info');
      
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy.mock.calls[0][0]).toContain('[INFO]');
      expect(consoleInfoSpy.mock.calls[0][0]).toContain('Test info');
    });

    it('should log info messages with metadata', () => {
      process.env.LOG_LEVEL = 'INFO';
      logger.info('Test info', { userId: '123' });
      
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy.mock.calls[0][0]).toContain('[INFO]');
      expect(consoleInfoSpy.mock.calls[0][0]).toContain('Test info');
      expect(consoleInfoSpy.mock.calls[0][0]).toContain('"userId":"123"');
    });

    it('should not log info when log level is WARN', () => {
      process.env.LOG_LEVEL = 'WARN';
      logger.info('Test info');
      
      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });

    it('should log info when log level is DEBUG', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      logger.info('Test info');
      
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('debug', () => {
    it('should log debug messages', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      logger.debug('Test debug');
      
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy.mock.calls[0][0]).toContain('[DEBUG]');
      expect(consoleDebugSpy.mock.calls[0][0]).toContain('Test debug');
    });

    it('should log debug messages with metadata', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      logger.debug('Test debug', { trace: 'stack' });
      
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy.mock.calls[0][0]).toContain('[DEBUG]');
      expect(consoleDebugSpy.mock.calls[0][0]).toContain('Test debug');
      expect(consoleDebugSpy.mock.calls[0][0]).toContain('"trace":"stack"');
    });

    it('should not log debug when log level is INFO', () => {
      process.env.LOG_LEVEL = 'INFO';
      logger.debug('Test debug');
      
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should not log debug when log level is WARN', () => {
      process.env.LOG_LEVEL = 'WARN';
      logger.debug('Test debug');
      
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should not log debug when log level is ERROR', () => {
      process.env.LOG_LEVEL = 'ERROR';
      logger.debug('Test debug');
      
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
  });

  describe('log level hierarchy', () => {
    it('should respect ERROR level (only errors)', () => {
      process.env.LOG_LEVEL = 'ERROR';
      
      logger.error('error');
      logger.warn('warn');
      logger.info('info');
      logger.debug('debug');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should respect WARN level (errors and warnings)', () => {
      process.env.LOG_LEVEL = 'WARN';
      
      logger.error('error');
      logger.warn('warn');
      logger.info('info');
      logger.debug('debug');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should respect INFO level (errors, warnings, and info)', () => {
      process.env.LOG_LEVEL = 'INFO';
      
      logger.error('error');
      logger.warn('warn');
      logger.info('info');
      logger.debug('debug');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should respect DEBUG level (all messages)', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      
      logger.error('error');
      logger.warn('warn');
      logger.info('info');
      logger.debug('debug');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('message formatting', () => {
    it('should include timestamp in ISO format', () => {
      logger.error('Test');
      
      const logOutput = consoleErrorSpy.mock.calls[0][0];
      // Check for ISO timestamp pattern: [YYYY-MM-DDTHH:mm:ss.sssZ]
      expect(logOutput).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    });

    it('should format metadata as JSON', () => {
      logger.error('Test', { key: 'value', num: 42 });
      
      const logOutput = consoleErrorSpy.mock.calls[0][0];
      expect(logOutput).toContain('{"key":"value","num":42}');
    });

    it('should handle metadata without JSON', () => {
      logger.error('Test without metadata');
      
      const logOutput = consoleErrorSpy.mock.calls[0][0];
      expect(logOutput).toContain('[ERROR]');
      expect(logOutput).toContain('Test without metadata');
      expect(logOutput).not.toContain('{}');
    });
  });

  describe('default log level', () => {
    it('should default to INFO when LOG_LEVEL is not set', () => {
      delete process.env.LOG_LEVEL;
      
      logger.error('error');
      logger.warn('warn');
      logger.info('info');
      logger.debug('debug');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should default to INFO for invalid LOG_LEVEL', () => {
      process.env.LOG_LEVEL = 'INVALID';
      
      logger.error('error');
      logger.warn('warn');
      logger.info('info');
      logger.debug('debug');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
  });
});
