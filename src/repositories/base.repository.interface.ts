export interface BaseRepositoryInterface {
  /**
   * Clears all entities or repository state. Intended for repository cleanup and tests.
   */
  clear(): Promise<void>;

  /**
   * Closes the repository connection or releases resources.
   */
  close(): Promise<void>;
}
