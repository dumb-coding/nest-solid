import { SampleEntity } from '../../interfaces/sample.interface';

export type { SampleEntity } from '../../interfaces/sample.interface';

export interface SampleRepositoryInterface {
  /**
   * creates a new entity in the repository. Returns the created entity.
   * @param entity
   * @returns Promise<SampleEntity>
   */
  create(entity: SampleEntity): Promise<SampleEntity>;

  /**
   * finds an entity by its ID. Returns null if the entity is not found.
   * @param id
   * @returns Promise<SampleEntity | null>
   */
  findById(id: string): Promise<SampleEntity | null>;

  /**
   * finds all entities in the repository. Returns an empty array if no entities are found.
   * @returns Promise<SampleEntity[]>
   */
  findAll(): Promise<SampleEntity[]>;

  /**
   * updates an entity by its ID. Returns the updated entity, or null if the entity was not found.
   * @param id
   * @param patch
   * @returns Promise<SampleEntity | null>
   */
  update(
    id: string,
    patch: Partial<SampleEntity>,
  ): Promise<SampleEntity | null>;

  /**
   * deletes an entity by its ID. Returns true if the entity was deleted, false if it was not found.
   * @param id
   * @returns Promise<boolean>
   */
  delete(id: string): Promise<boolean>;

  clear(): Promise<void>; // clear all entities from the repository (if applicable)
  close(): Promise<void>; // close the repository connection (if applicable)
}
