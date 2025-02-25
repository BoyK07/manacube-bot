# Code Conventions

## Classes

- Use `PascalCase` for class names (e.g. `UserManager`, `BaseService`, `Logger`)
- Create one class per file with matching filenames (e.g. `UserManager.ts` contains `UserManager` class)
- Use abstract classes for base implementations when needed
- Always declare class properties with visibility modifiers:
  - `public` for properties accessed outside the class
  - `private` for internal implementation details
  - `protected` for properties accessed by subclasses
- Mark readonly properties with `readonly` keyword (e.g. `public readonly id: string`)
- Initialize properties in constructor using parameter properties when possible
- Implement abstract methods in subclasses with consistent signatures
- Use generic type parameters for flexible implementations

## Methods

- Use `camelCase` for method names (e.g. `getData()`, `updateUser()`, `loadConfig()`)
- Keep methods focused on a single responsibility
- Use async/await for asynchronous operations:
  - Mark async methods with `async` keyword
  - Always await promises
  - Handle potential errors with try/catch
- Add return type annotations for all methods:
  - Use `Promise<void>` for async methods with no return value
  - Use `Promise<T>` for async methods returning values
  - Use explicit return types like `Map<string, User>`
- Document complex methods with JSDoc comments:
  ```typescript
  /**
   * Updates the user data in the database.
   * @param userId - The unique identifier of the user.
   * @param data - The data to update.
   * @returns Promise that resolves when update is complete.
   */
  ```

## Error Handling

- Use try/catch blocks around operations that may fail
- Always log errors using a logging utility:
  ```typescript
  try {
    await operation();
  } catch (err) {
    Logger.error(`Operation failed:`, err);
  }
  ```
- Include context in error messages (e.g. `Error loading resource from ${path}:`)
- Propagate errors up when appropriate using Promise rejections
- Create custom error types for specific failure cases
- Log different error levels appropriately:
  - `error()` for critical failures
  - `warn()` for recoverable issues
  - `debug()` for development information

## Control Flow

- Prefer early returns to reduce nesting, only single line returns can omit braces:

```typescript
if (!condition) return;

// For anything more than a single return, use braces:
if (!condition) {
  Logger.warn("Condition not met");
  return;
}
```

- Use switch statements for handling multiple discrete cases with braces for each case:

```typescript
switch (type.toLowerCase()) {
  case "user": {
    const user = loadUser();
    await user.update();
    break;
  }
  case "admin": {
    const admin = loadAdmin();
    await admin.verify();
    break;
  }
  default: {
    throw new Error(`Unknown type: ${type}`);
  }
}
```

- For if/else statements, always use braces except for single return statements:

```typescript
// Acceptable - single return
if (!user) return;

// Required - multiple lines
if (user.isActive) {
  await user.update();
  Logger.info("User updated");
}

// Required - else blocks
if (condition) {
  doSomething();
} else {
  doSomethingElse();
}
```

- Keep conditional logic simple and readable
- Avoid deeply nested if/else blocks by extracting logic into functions
- Use guard clauses to handle edge cases early
- Use optional chaining and nullish coalescing when appropriate

## Types

- Define interfaces for data structures:
  ```typescript
  interface Config {
    apiKey: string;
    baseUrl: string;
    timeout: number;
    retries: number;
    debug: boolean;
  }
  ```
- Use type annotations consistently
- Leverage TypeScript's strict mode settings from tsconfig.json
- Create type definitions in dedicated types directory
- Use type unions and intersections appropriately
- Extend existing types when needed:
  ```typescript
  interface ExtendedUser extends User {
    preferences: UserPreferences;
  }
  ```

## File Organization

- Group related functionality into logical directories:
  - Feature-based organization
  - Layer-based organization
  - Domain-based organization
- Use consistent file naming conventions:
  - PascalCase for class files
  - camelCase for utility files
  - `.ts` extension for TypeScript files
- Keep files focused and manageable in size
- Maintain a clear and organized project structure

## Naming

- Use clear, descriptive names that indicate purpose
- Follow consistent naming patterns for similar concepts
- Be consistent with casing conventions:
  - PascalCase for classes and interfaces
  - camelCase for methods and variables
  - UPPER_CASE for constants
- Avoid abbreviations unless widely understood

## Comments

- Add JSDoc comments for public APIs
- Explain complex logic when necessary
- Keep comments current and accurate
- Avoid redundant comments that repeat code
- Use TSDoc tags appropriately:
  ```typescript
  /**
   * @param data - The data to process
   * @param options - Processing options
   * @returns Promise that resolves with processed result
   */
  ```

## Formatting

- Use 2 space indentation
- Add trailing commas in multi-line structures
- Place opening braces on same line
- Use semicolons consistently
- Follow Prettier formatting rules
- Maintain consistent whitespace
- Limit line length to 80-100 characters
- Use proper alignment for related code
