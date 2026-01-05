# Electron Application Architecture Guide

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Coding Standards](#coding-standards)
4. [Module Design Principles](#module-design-principles)
5. [API Design Patterns](#api-design-patterns)
6. [Error Handling & Debugging](#error-handling--debugging)
7. [Build & Run Instructions](#build--run-instructions)
8. [Scalability Guidelines](#scalability-guidelines)

---

## Overview

This document outlines the architectural standards for building a highly modular, infinitely expandable Electron application. The architecture follows:
- **Google's JavaScript/TypeScript Style Guide**: For code organization and naming conventions
- **NASA's Verbose Documentation Style**: For comprehensive inline documentation and error handling
- **Separation of Concerns**: Strict boundaries between layers
- **API-First Design**: All inter-module communication through well-defined interfaces

### Core Principles
1. **Modularity**: Each module is self-contained with minimal dependencies
2. **Testability**: All components can be tested in isolation
3. **Debuggability**: Comprehensive logging and error tracking
4. **Scalability**: New features can be added without modifying existing code
5. **Type Safety**: Full TypeScript implementation with strict mode

---

## Project Structure

```
project-root/
├── src/
│   ├── main/                    # Main process modules
│   │   ├── core/               # Core application logic
│   │   │   ├── Application.ts  # Main application orchestrator
│   │   │   ├── WindowManager.ts
│   │   │   └── ConfigManager.ts
│   │   ├── services/           # Business logic services
│   │   │   ├── DataService.ts
│   │   │   └── FileService.ts
│   │   ├── controllers/        # IPC controllers
│   │   │   ├── BaseController.ts
│   │   │   └── AppController.ts
│   │   ├── utils/              # Utility functions
│   │   │   ├── Logger.ts
│   │   │   └── ErrorHandler.ts
│   │   └── main.ts             # Entry point
│   │
│   ├── renderer/               # Renderer process modules
│   │   ├── components/         # UI components
│   │   │   ├── common/         # Reusable components
│   │   │   └── features/       # Feature-specific components
│   │   ├── services/           # Frontend services
│   │   │   └── ApiService.ts
│   │   ├── store/              # State management
│   │   │   ├── Store.ts
│   │   │   └── modules/
│   │   ├── utils/              # Frontend utilities
│   │   └── renderer.ts         # Renderer entry point
│   │
│   ├── preload/                # Preload scripts
│   │   ├── preload.ts
│   │   └── api/                # Exposed API definitions
│   │
│   ├── shared/                 # Shared between processes
│   │   ├── types/              # TypeScript type definitions
│   │   │   ├── api.types.ts
│   │   │   ├── config.types.ts
│   │   │   └── data.types.ts
│   │   ├── constants/          # Application constants
│   │   │   └── index.ts
│   │   ├── interfaces/         # Interface definitions
│   │   │   └── IService.ts
│   │   └── enums/              # Enum definitions
│   │
│   └── assets/                 # Static assets
│       ├── icons/
│       ├── images/
│       └── styles/
│
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
│
├── config/                     # Configuration files
│   ├── webpack.config.js
│   ├── jest.config.js
│   └── tsconfig.json
│
├── docs/                       # Documentation
│   ├── api/                    # API documentation
│   └── guides/                 # User guides
│
├── scripts/                    # Build and utility scripts
│   ├── build.js
│   └── dev.js
│
├── package.json
├── tsconfig.json
└── README.md
```

### Directory Responsibilities

#### `src/main/core/`
**Purpose**: Core application functionality that orchestrates the application lifecycle.
- **Entry Point**: `main.ts` - Initializes application
- **WindowManager**: Manages BrowserWindow instances
- **ConfigManager**: Handles application configuration
- **Application**: Main application class that coordinates all modules

#### `src/main/services/`
**Purpose**: Business logic implementation. Each service handles a specific domain.
- Self-contained with clear interfaces
- No direct dependencies on other services
- Communicate through events or dependency injection

#### `src/main/controllers/`
**Purpose**: Handle IPC (Inter-Process Communication) between main and renderer.
- Each controller handles a specific domain
- Validates input from renderer process
- Calls appropriate services
- Returns formatted responses

#### `src/renderer/components/`
**Purpose**: UI components organized by reusability and features.
- `common/`: Buttons, inputs, modals - reusable across app
- `features/`: Feature-specific components

#### `src/shared/`
**Purpose**: Code shared between main and renderer processes.
- **Types**: TypeScript type definitions
- **Interfaces**: Abstract interfaces for services
- **Constants**: Application-wide constants
- **Enums**: Enumeration definitions

---

## Coding Standards

### File Naming Conventions

```
PascalCase:       Classes, Interfaces, Types, Enums
                  Example: WindowManager.ts, IService.ts
                  
camelCase:        Functions, variables, methods
                  Example: getUserData(), currentWindow
                  
SCREAMING_SNAKE:  Constants, environment variables
                  Example: MAX_RETRIES, API_TIMEOUT
                  
kebab-case:       CSS files, HTML files
                  Example: app-styles.css, main-window.html
```

### File Header Template (NASA Style)

Every file must include a comprehensive header:

```typescript
/**
 * @fileoverview [Brief description of file purpose]
 * 
 * @description
 * [Detailed description of what this file contains, its role in the application,
 * and any important architectural decisions or patterns used]
 * 
 * @module [module-name]
 * @category [main|renderer|shared]
 * 
 * @author [Author Name]
 * @created [YYYY-MM-DD]
 * @modified [YYYY-MM-DD]
 * 
 * @requires [List of critical dependencies]
 * 
 * @example
 * // Example usage
 * import { ClassName } from './path/to/file';
 * const instance = new ClassName();
 * 
 * @see {@link RelatedClass} for related functionality
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
```

### Class/Function Documentation Template

```typescript
/**
 * @class ClassName
 * @description
 * [Detailed description of class purpose, responsibilities, and behavior]
 * 
 * @implements {IInterface}
 * @extends {BaseClass}
 * 
 * @example
 * const instance = new ClassName(config);
 * await instance.initialize();
 * 
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * @method methodName
 * @description
 * [Detailed description of what the method does, including side effects,
 * state changes, and important behavioral notes]
 * 
 * @param {Type} paramName - [Detailed parameter description including
 *                            valid values, constraints, and defaults]
 * @param {Type} [optionalParam] - [Description with default value]
 * 
 * @returns {Promise<ReturnType>} [Detailed description of return value,
 *                                  including all possible return states]
 * 
 * @throws {ErrorType} [Description of when this error is thrown]
 * @throws {AnotherErrorType} [Description of another error condition]
 * 
 * @async
 * @public
 * 
 * @example
 * const result = await instance.methodName(param1, param2);
 * 
 * @see {@link relatedMethod} for related functionality
 * 
 * @precondition [Conditions that must be true before calling]
 * @postcondition [Conditions guaranteed to be true after calling]
 * 
 * @version 1.0.0
 * @since 1.0.0
 */
```

### Code Style Guidelines

#### 1. Google Style: Line Length
```typescript
// Maximum 80 characters per line
// Break long lines logically

// Good
const result = await this.dataService
  .fetchData(userId)
  .then((data) => this.processData(data))
  .catch((error) => this.handleError(error));

// Avoid
const result = await this.dataService.fetchData(userId).then((data) => this.processData(data)).catch((error) => this.handleError(error));
```

#### 2. NASA Style: Verbose Comments
```typescript
/**
 * Initialize the application core systems.
 * 
 * This method performs the following critical initialization steps:
 * 1. Loads configuration from disk or creates default configuration
 * 2. Initializes the logging system with appropriate log levels
 * 3. Establishes database connections with retry logic
 * 4. Registers all service modules with the service container
 * 5. Sets up IPC communication channels between main and renderer
 * 
 * @async
 * @throws {ConfigurationError} If configuration file is corrupted
 * @throws {DatabaseConnectionError} If database connection fails after retries
 */
public async initialize(): Promise<void> {
  // Step 1: Load configuration
  // Configuration is loaded from config.json or default values are used
  // This must succeed before any other initialization steps
  this.logger.info('Loading application configuration...');
  this.config = await this.configManager.loadConfiguration();
  
  // Step 2: Initialize logging system
  // Logger is configured based on environment (dev/prod) and config settings
  // Log rotation is enabled for production environments
  this.logger.info('Initializing logging system...');
  await this.logger.initialize(this.config.logging);
  
  // Continue with verbose documentation for each step...
}
```

#### 3. Strict Type Definitions
```typescript
// Always use explicit types, never rely on inference for public APIs

// Good
public async getData(userId: string): Promise<UserData | null> {
  // Implementation
}

// Avoid
public async getData(userId) {
  // Implementation
}
```

#### 4. Error Handling Pattern
```typescript
/**
 * NASA-style error handling with detailed error context
 */
try {
  // Attempt operation with pre-condition check
  if (!this.isInitialized) {
    throw new ApplicationError(
      'Cannot perform operation before initialization',
      ErrorCode.NOT_INITIALIZED,
      { method: 'getData', state: 'uninitialized' }
    );
  }
  
  // Perform operation
  const result = await this.performOperation();
  
  // Validate result meets post-conditions
  if (!this.validateResult(result)) {
    throw new ValidationError(
      'Operation result failed validation',
      ErrorCode.VALIDATION_FAILED,
      { result, expected: 'valid data structure' }
    );
  }
  
  return result;
  
} catch (error) {
  // Log error with full context for debugging
  this.logger.error('Operation failed', {
    error: error.message,
    stack: error.stack,
    context: { userId, timestamp: Date.now() },
    recovery: 'Returning cached data if available'
  });
  
  // Attempt graceful degradation
  return this.getCachedData(userId);
}
```

---

## Module Design Principles

### 1. Single Responsibility Principle
Each module/class has ONE primary responsibility.

```typescript
// Good: Single responsibility
class UserDataService {
  public async getUserData(userId: string): Promise<UserData> { }
  public async updateUserData(userId: string, data: UserData): Promise<void> { }
}

class UserValidator {
  public validateUserData(data: UserData): ValidationResult { }
}

// Bad: Multiple responsibilities
class UserManager {
  public async getUserData(userId: string): Promise<UserData> { }
  public validateUserData(data: UserData): ValidationResult { }
  public renderUserUI(data: UserData): void { }
  public logUserActivity(userId: string): void { }
}
```

### 2. Dependency Injection
All dependencies are injected, never instantiated internally.

```typescript
/**
 * @class DataController
 * @description
 * Controller for handling data-related IPC requests.
 * Dependencies are injected through constructor for testability.
 */
export class DataController extends BaseController {
  /**
   * Create a DataController instance.
   * 
   * @param {IDataService} dataService - Service for data operations
   * @param {ILogger} logger - Logging service for operation tracking
   * @param {IValidator} validator - Input validation service
   * 
   * @throws {DependencyError} If any required dependency is null/undefined
   */
  constructor(
    private readonly dataService: IDataService,
    private readonly logger: ILogger,
    private readonly validator: IValidator
  ) {
    super();
    this.validateDependencies();
  }
  
  /**
   * Validate that all required dependencies are present.
   * Called during construction to fail-fast if dependencies are missing.
   * 
   * @private
   * @throws {DependencyError} If any dependency is null or undefined
   */
  private validateDependencies(): void {
    if (!this.dataService || !this.logger || !this.validator) {
      throw new DependencyError(
        'DataController requires all dependencies',
        { dataService: !!this.dataService, logger: !!this.logger }
      );
    }
  }
}
```

### 3. Interface Segregation
Define small, focused interfaces.

```typescript
/**
 * @interface IDataReader
 * @description Interface for read-only data operations
 */
export interface IDataReader {
  getData(id: string): Promise<Data>;
  queryData(query: Query): Promise<Data[]>;
}

/**
 * @interface IDataWriter
 * @description Interface for write-only data operations
 */
export interface IDataWriter {
  saveData(data: Data): Promise<void>;
  deleteData(id: string): Promise<void>;
}

/**
 * @interface IDataService
 * @description Complete data service interface combining read and write
 * @extends {IDataReader}
 * @extends {IDataWriter}
 */
export interface IDataService extends IDataReader, IDataWriter {
  // Additional methods specific to full service
}
```

### 4. Event-Driven Communication
Use events for loose coupling between modules.

```typescript
/**
 * @class EventBus
 * @description
 * Central event bus for application-wide event communication.
 * Provides publish-subscribe pattern for decoupled module interaction.
 */
export class EventBus {
  private listeners: Map<string, Set<EventListener>>;
  
  /**
   * Subscribe to an event.
   * 
   * @param {string} eventName - Name of event to listen for
   * @param {EventListener} callback - Function called when event fires
   * @returns {() => void} Unsubscribe function
   * 
   * @example
   * const unsubscribe = eventBus.on('data:updated', (data) => {
   *   console.log('Data updated:', data);
   * });
   * // Later: unsubscribe();
   */
  public on(eventName: string, callback: EventListener): () => void {
    // Implementation
  }
  
  /**
   * Emit an event to all subscribers.
   * 
   * @param {string} eventName - Name of event to emit
   * @param {unknown} data - Data to pass to listeners
   * 
   * @async
   * @returns {Promise<void>}
   */
  public async emit(eventName: string, data: unknown): Promise<void> {
    // Implementation
  }
}
```

---

## API Design Patterns

### 1. IPC Communication Pattern

```typescript
/**
 * @fileoverview IPC communication pattern implementation
 * 
 * @description
 * Defines the standard pattern for communication between main and renderer processes.
 * Uses a request-response pattern with type-safe channels and error handling.
 */

// Shared types (src/shared/types/api.types.ts)
export interface IpcRequest<T = unknown> {
  channel: string;
  payload: T;
  requestId: string;
  timestamp: number;
}

export interface IpcResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
  timestamp: number;
}

// Main process controller
export class BaseController {
  /**
   * Handle an IPC request with standard error handling.
   * 
   * @template TRequest - Type of request payload
   * @template TResponse - Type of response data
   * 
   * @param {IpcRequest<TRequest>} request - Incoming request
   * @param {(payload: TRequest) => Promise<TResponse>} handler - Handler function
   * 
   * @returns {Promise<IpcResponse<TResponse>>} Formatted response
   */
  protected async handleRequest<TRequest, TResponse>(
    request: IpcRequest<TRequest>,
    handler: (payload: TRequest) => Promise<TResponse>
  ): Promise<IpcResponse<TResponse>> {
    try {
      // Log incoming request for debugging
      this.logger.debug('IPC request received', {
        channel: request.channel,
        requestId: request.requestId
      });
      
      // Execute handler
      const data = await handler(request.payload);
      
      // Return success response
      return {
        success: true,
        data,
        requestId: request.requestId,
        timestamp: Date.now()
      };
      
    } catch (error) {
      // Log error with full context
      this.logger.error('IPC request failed', {
        channel: request.channel,
        requestId: request.requestId,
        error: error.message,
        stack: error.stack
      });
      
      // Return error response
      return {
        success: false,
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message,
          details: error.details
        },
        requestId: request.requestId,
        timestamp: Date.now()
      };
    }
  }
}

// Renderer process API service
export class ApiService {
  /**
   * Send an IPC request to main process.
   * 
   * @template TRequest - Type of request payload
   * @template TResponse - Type of expected response
   * 
   * @param {string} channel - IPC channel name
   * @param {TRequest} payload - Request data
   * 
   * @returns {Promise<TResponse>} Response data
   * @throws {ApiError} If request fails or response indicates error
   */
  public async invoke<TRequest, TResponse>(
    channel: string,
    payload: TRequest
  ): Promise<TResponse> {
    const request: IpcRequest<TRequest> = {
      channel,
      payload,
      requestId: this.generateRequestId(),
      timestamp: Date.now()
    };
    
    const response = await window.electron.ipcRenderer.invoke<
      IpcRequest<TRequest>,
      IpcResponse<TResponse>
    >(channel, request);
    
    if (!response.success) {
      throw new ApiError(
        response.error!.message,
        response.error!.code,
        response.error!.details
      );
    }
    
    return response.data!;
  }
}
```

### 2. Service Layer Pattern

```typescript
/**
 * @interface IService
 * @description Base interface for all services
 */
export interface IService {
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
  getStatus(): ServiceStatus;
}

/**
 * @abstract
 * @class BaseService
 * @description Base class for all services with common functionality
 */
export abstract class BaseService implements IService {
  protected isInitialized: boolean = false;
  protected logger: ILogger;
  
  /**
   * Initialize the service.
   * Must be called before using service functionality.
   * 
   * @async
   * @throws {InitializationError} If initialization fails
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Service already initialized');
      return;
    }
    
    try {
      await this.onInitialize();
      this.isInitialized = true;
      this.logger.info('Service initialized successfully');
    } catch (error) {
      this.logger.error('Service initialization failed', { error });
      throw new InitializationError(
        `Failed to initialize ${this.constructor.name}`,
        { originalError: error }
      );
    }
  }
  
  /**
   * Template method for service-specific initialization.
   * Subclasses override this to implement their initialization logic.
   * 
   * @abstract
   * @protected
   * @async
   */
  protected abstract onInitialize(): Promise<void>;
  
  /**
   * Shutdown the service and cleanup resources.
   * 
   * @async
   */
  public async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }
    
    try {
      await this.onShutdown();
      this.isInitialized = false;
      this.logger.info('Service shutdown successfully');
    } catch (error) {
      this.logger.error('Service shutdown failed', { error });
      throw error;
    }
  }
  
  /**
   * Template method for service-specific shutdown.
   * 
   * @abstract
   * @protected
   * @async
   */
  protected abstract onShutdown(): Promise<void>;
  
  /**
   * Get current service status.
   * 
   * @returns {ServiceStatus} Current status
   */
  public getStatus(): ServiceStatus {
    return {
      name: this.constructor.name,
      initialized: this.isInitialized,
      healthy: this.checkHealth()
    };
  }
  
  /**
   * Check if service is healthy.
   * Subclasses can override for custom health checks.
   * 
   * @protected
   * @returns {boolean} True if service is healthy
   */
  protected checkHealth(): boolean {
    return this.isInitialized;
  }
}
```

---

## Error Handling & Debugging

### 1. Error Class Hierarchy

```typescript
/**
 * @class BaseError
 * @description Base error class for all application errors
 * @extends {Error}
 */
export class BaseError extends Error {
  public readonly code: string;
  public readonly timestamp: number;
  public readonly details?: unknown;
  
  constructor(message: string, code: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = Date.now();
    this.details = details;
    
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
  
  /**
   * Convert error to JSON for logging/transmission.
   * 
   * @returns {object} Serialized error
   */
  public toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp,
      details: this.details,
      stack: this.stack
    };
  }
}

// Specific error types
export class ValidationError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

export class ConfigurationError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONFIGURATION_ERROR', details);
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'DATABASE_ERROR', details);
  }
}
```

### 2. Logging System

```typescript
/**
 * @class Logger
 * @description Comprehensive logging system with multiple levels and transports
 */
export class Logger implements ILogger {
  private transports: ILogTransport[] = [];
  private logLevel: LogLevel;
  
  /**
   * Log debug message.
   * Used for detailed debugging information.
   * Only logged in development or when log level is DEBUG.
   * 
   * @param {string} message - Log message
   * @param {unknown} [context] - Additional context data
   */
  public debug(message: string, context?: unknown): void {
    this.log(LogLevel.DEBUG, message, context);
  }
  
  /**
   * Log info message.
   * Used for general informational messages about application state.
   * 
   * @param {string} message - Log message
   * @param {unknown} [context] - Additional context data
   */
  public info(message: string, context?: unknown): void {
    this.log(LogLevel.INFO, message, context);
  }
  
  /**
   * Log warning message.
   * Used for potentially harmful situations that don't prevent operation.
   * 
   * @param {string} message - Log message
   * @param {unknown} [context] - Additional context data
   */
  public warn(message: string, context?: unknown): void {
    this.log(LogLevel.WARN, message, context);
  }
  
  /**
   * Log error message.
   * Used for error events that might still allow application to continue.
   * 
   * @param {string} message - Log message
   * @param {unknown} [context] - Additional context data
   */
  public error(message: string, context?: unknown): void {
    this.log(LogLevel.ERROR, message, context);
  }
  
  /**
   * Log critical error message.
   * Used for severe error events that will lead to application abort.
   * 
   * @param {string} message - Log message
   * @param {unknown} [context] - Additional context data
   */
  public critical(message: string, context?: unknown): void {
    this.log(LogLevel.CRITICAL, message, context);
  }
  
  /**
   * Internal logging method.
   * Formats log entry and sends to all configured transports.
   * 
   * @private
   * @param {LogLevel} level - Log level
   * @param {string} message - Log message
   * @param {unknown} [context] - Additional context
   */
  private log(level: LogLevel, message: string, context?: unknown): void {
    if (!this.shouldLog(level)) {
      return;
    }
    
    const logEntry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      process: process.type, // 'browser' or 'renderer'
      pid: process.pid
    };
    
    this.transports.forEach(transport => {
      transport.write(logEntry);
    });
  }
}
```

### 3. Debug Configuration

```typescript
/**
 * @constant DEBUG_CONFIG
 * @description Debug configuration for different environments
 */
export const DEBUG_CONFIG = {
  development: {
    logLevel: LogLevel.DEBUG,
    enableDevTools: true,
    enableSourceMaps: true,
    enableHotReload: true,
    verboseLogging: true,
    logToFile: true,
    logToConsole: true
  },
  
  production: {
    logLevel: LogLevel.WARN,
    enableDevTools: false,
    enableSourceMaps: false,
    enableHotReload: false,
    verboseLogging: false,
    logToFile: true,
    logToConsole: false
  },
  
  test: {
    logLevel: LogLevel.ERROR,
    enableDevTools: false,
    enableSourceMaps: true,
    enableHotReload: false,
    verboseLogging: false,
    logToFile: false,
    logToConsole: true
  }
};
```

---

## Build & Run Instructions

### Prerequisites
```bash
# Required software
- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn >= 1.22.0
- Git >= 2.0.0

# Verify installations
node --version
npm --version
git --version
```

### Installation

```bash
# Clone repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
npm install

# Or with yarn
yarn install
```

### Development

```bash
# Run in development mode with hot reload
npm run dev

# Run with specific environment
NODE_ENV=development npm run dev

# Run main process in debug mode
npm run dev:main:debug

# Run renderer in debug mode  
npm run dev:renderer:debug
```

### Building

```bash
# Build for current platform
npm run build

# Build for specific platform
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux

# Build for all platforms
npm run build:all

# Build without packaging (for testing)
npm run build:nopack
```

### Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Linting & Formatting

```bash
# Lint code
npm run lint

# Fix linting errors
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### Package Scripts Explanation

```json
{
  "scripts": {
    "dev": "Runs development server with hot reload",
    "build": "Compiles TypeScript and bundles application",
    "start": "Starts the built application",
    "test": "Runs test suite",
    "lint": "Checks code for style issues",
    "format": "Auto-formats code",
    "type-check": "Verifies TypeScript types without building",
    "clean": "Removes build artifacts",
    "postinstall": "Runs after dependencies are installed"
  }
}
```

---

## Scalability Guidelines

### 1. Adding New Features

**Step-by-Step Process:**

1. **Define Interface** (src/shared/interfaces/)
   ```typescript
   /**
    * @interface INewFeatureService
    * @description Interface for new feature functionality
    */
   export interface INewFeatureService extends IService {
     performFeature(params: FeatureParams): Promise<FeatureResult>;
   }
   ```

2. **Define Types** (src/shared/types/)
   ```typescript
   /**
    * @interface FeatureParams
    * @description Parameters for feature operation
    */
   export interface FeatureParams {
     id: string;
     options: FeatureOptions;
   }
   ```

3. **Implement Service** (src/main/services/)
   ```typescript
   /**
    * @class NewFeatureService
    * @implements {INewFeatureService}
    */
   export class NewFeatureService extends BaseService 
     implements INewFeatureService {
     // Implementation
   }
   ```

4. **Create Controller** (src/main/controllers/)
   ```typescript
   /**
    * @class NewFeatureController
    * @description Handles IPC for new feature
    */
   export class NewFeatureController extends BaseController {
     // IPC handlers
   }
   ```

5. **Register in Application** (src/main/main.ts)
   ```typescript
   // Register service
   const featureService = new NewFeatureService(dependencies);
   await featureService.initialize();
   
   // Register controller
   const featureController = new NewFeatureController(featureService);
   featureController.register(ipcMain);
   ```

6. **Create UI Components** (src/renderer/components/features/)
   ```typescript
   /**
    * @component NewFeatureComponent
    * @description UI component for new feature
    */
   ```

7. **Add Tests** (tests/)
   ```typescript
   describe('NewFeatureService', () => {
     // Unit tests
   });
   ```

### 2. Module Registration Pattern

```typescript
/**
 * @class ModuleRegistry
 * @description Central registry for all application modules
 */
export class ModuleRegistry {
  private modules: Map<string, IModule> = new Map();
  
  /**
   * Register a module.
   * 
   * @param {string} name - Unique module name
   * @param {IModule} module - Module instance
   * @throws {RegistrationError} If module already registered
   */
  public register(name: string, module: IModule): void {
    if (this.modules.has(name)) {
      throw new RegistrationError(
        `Module ${name} already registered`,
        { name, existingModule: this.modules.get(name) }
      );
    }
    
    this.modules.set(name, module);
    this.logger.info(`Module registered: ${name}`);
  }
  
  /**
   * Get a registered module.
   * 
   * @param {string} name - Module name
   * @returns {IModule} Module instance
   * @throws {ModuleNotFoundError} If module not registered
   */
  public get<T extends IModule>(name: string): T {
    const module = this.modules.get(name);
    if (!module) {
      throw new ModuleNotFoundError(
        `Module ${name} not found`,
        { name, availableModules: Array.from(this.modules.keys()) }
      );
    }
    return module as T;
  }
  
  /**
   * Initialize all registered modules.
   * Modules are initialized in registration order.
   * 
   * @async
   */
  public async initializeAll(): Promise<void> {
    for (const [name, module] of this.modules) {
      this.logger.info(`Initializing module: ${name}`);
      await module.initialize();
    }
  }
}
```

### 3. Plugin System (Advanced Scalability)

```typescript
/**
 * @interface IPlugin
 * @description Interface for application plugins
 */
export interface IPlugin {
  readonly name: string;
  readonly version: string;
  readonly dependencies: string[];
  
  load(): Promise<void>;
  unload(): Promise<void>;
  activate(): Promise<void>;
  deactivate(): Promise<void>;
}

/**
 * @class PluginManager
 * @description Manages application plugins for infinite extensibility
 */
export class PluginManager {
  private plugins: Map<string, IPlugin> = new Map();
  
  /**
   * Load a plugin from directory.
   * 
   * @param {string} pluginPath - Path to plugin directory
   * @returns {Promise<IPlugin>} Loaded plugin instance
   */
  public async loadPlugin(pluginPath: string): Promise<IPlugin> {
    // Plugin loading logic with validation and dependency resolution
  }
  
  /**
   * Activate plugin.
   * Checks dependencies and loads them if necessary.
   * 
   * @param {string} pluginName - Name of plugin to activate
   */
  public async activatePlugin(pluginName: string): Promise<void> {
    // Activation with dependency resolution
  }
}
```

### 4. Configuration-Driven Features

```typescript
/**
 * @interface FeatureConfig
 * @description Configuration for feature flags
 */
export interface FeatureConfig {
  enabled: boolean;
  options: Record<string, unknown>;
  dependencies: string[];
}

/**
 * @class FeatureManager
 * @description Manages feature flags for gradual rollout
 */
export class FeatureManager {
  /**
   * Check if feature is enabled.
   * 
   * @param {string} featureName - Name of feature
   * @returns {boolean} True if feature is enabled
   */
  public isFeatureEnabled(featureName: string): boolean {
    const config = this.getFeatureConfig(featureName);
    return config.enabled && this.areDependenciesMet(config);
  }
  
  /**
   * Enable feature at runtime.
   * 
   * @param {string} featureName - Name of feature to enable
   */
  public async enableFeature(featureName: string): Promise<void> {
    // Dynamic feature enabling
  }
}
```

---

## Best Practices Summary

### DO's ✓
- **Write comprehensive documentation** for every file, class, and method
- **Use dependency injection** for all dependencies
- **Define explicit interfaces** for all service contracts
- **Implement proper error handling** with custom error classes
- **Log extensively** with appropriate log levels
- **Write tests** for all business logic
- **Use TypeScript strict mode** for maximum type safety
- **Separate concerns** with clear module boundaries
- **Version your APIs** for backward compatibility
- **Document breaking changes** clearly

### DON'Ts ✗
- **Don't use `any` type** except in very rare, justified cases
- **Don't create god classes** - keep classes focused and small
- **Don't hardcode values** - use configuration
- **Don't ignore errors** - always handle or propagate
- **Don't couple modules tightly** - use interfaces and events
- **Don't skip documentation** - if code needs explanation, document it
- **Don't commit untested code** - write tests first or alongside
- **Don't optimize prematurely** - make it work, then make it fast
- **Don't break APIs** without versioning and deprecation notices

---

## Conclusion

This architecture provides:
- **Infinite Scalability**: Add features without modifying existing code
- **Easy Debugging**: Comprehensive logging and error tracking
- **Maintainability**: Clear structure and documentation
- **Testability**: Modular design with dependency injection
- **Type Safety**: Full TypeScript with strict mode
- **Professional Quality**: Follows industry standards

By following these guidelines, the codebase will remain clean, maintainable, and scalable regardless of how large the application grows.

---

**Last Updated**: 2025-12-23  
**Version**: 1.0.0  
**Maintainer**: Development Team
