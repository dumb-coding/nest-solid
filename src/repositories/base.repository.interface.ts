/**
 * Lifecycle methods for repository implementations.
 *
 * These operations are typically used for cleanup and test setup.
 */
export interface BaseRepositoryInterface {
  /**
   * Clears in-memory or persistent repository state.
   * This is commonly used in tests to reset state between runs.
   */
  clear(): Promise<void>;

  /**
   * Releases underlying connections or resources held by the repository.
   */
  close(): Promise<void>;
}
