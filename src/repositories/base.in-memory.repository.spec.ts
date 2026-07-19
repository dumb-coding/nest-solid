import { BaseInMemoryRepository } from './base.in-memory.repository';

type SampleEntity = {
  id: string;
  name: string;
  count: number;
};

class SampleInMemoryRepository extends BaseInMemoryRepository<SampleEntity> {
  constructor() {
    super('samples'); // Table name for the in-memory store
  }
}

describe('BaseInMemoryRepository', () => {
  let repository: SampleInMemoryRepository;

  beforeEach(async () => {
    repository = new SampleInMemoryRepository();
    await repository.clear();
  });

  it('creates and reads entities from the in-memory store', async () => {
    const entity: SampleEntity = { id: '1', name: 'alpha', count: 1 };

    const created = await repository.repository.create(entity);
    const found = await repository.repository.findById('1');
    const all = await repository.repository.findAll();

    expect(created).toEqual(entity);
    expect(found).toEqual(entity);
    expect(all).toEqual([entity]);
  });

  it('updates an existing entity without mutating the stored copy', async () => {
    await repository.repository.create({ id: '1', name: 'alpha', count: 1 });

    const updated = await repository.repository.update('1', { name: 'beta' });
    const stored = await repository.repository.findById('1');

    expect(updated).toEqual({ id: '1', name: 'beta', count: 1 });
    expect(stored).toEqual({ id: '1', name: 'beta', count: 1 });

    updated!.name = 'gamma';
    expect(await repository.repository.findById('1')).toEqual({ id: '1', name: 'beta', count: 1 });
  });

  it('deletes entities and reports missing rows cleanly', async () => {
    await repository.repository.create({ id: '1', name: 'alpha', count: 1 });

    await expect(repository.repository.delete('1')).resolves.toBe(true);
    await expect(repository.repository.findById('1')).resolves.toBeNull();
    await expect(repository.repository.delete('1')).resolves.toBe(false);
  });
});
