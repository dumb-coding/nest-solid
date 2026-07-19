import { BaseRedisRepository } from './base.redis.repository';
import { createClient } from 'redis';

jest.mock('redis', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>;
const redisClient = {
  connect: jest.fn(),
  on: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  flushAll: jest.fn(),
  quit: jest.fn(),
  disconnect: jest.fn(),
};

type SampleEntity = {
  id: string;
  name: string;
  count: number;
};

class SampleRedisRepository extends BaseRedisRepository<SampleEntity> {
  constructor() {
    super('samples');
  }
}

describe('BaseRedisRepository', () => {
  let repository: SampleRedisRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockCreateClient.mockReturnValue(redisClient);
    redisClient.connect.mockResolvedValue(undefined);
    redisClient.set.mockResolvedValue('OK');
    redisClient.get.mockResolvedValue(null);
    redisClient.del.mockResolvedValue(1);
    redisClient.flushAll.mockResolvedValue('OK');
    redisClient.quit.mockResolvedValue('OK');
    redisClient.disconnect.mockResolvedValue(undefined);
    repository = new SampleRedisRepository();
    await repository.clear();
  });

  afterEach(async () => {
    await repository.close();
  });

  it('creates and fetches entities from Redis', async () => {
    const entity: SampleEntity = { id: '1', name: 'alpha', count: 1 };

    redisClient.get
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(JSON.stringify([entity]))
      .mockResolvedValueOnce(JSON.stringify([entity]));

    const created = await repository.repository.create(entity);
    const found = await repository.repository.findById('1');
    const all = await repository.repository.findAll();

    const expectedKey = `${process.env.TABLE_PREFIX ?? ''}samples`;

    expect(created).toEqual(entity);
    expect(found).toEqual(entity);
    expect(all).toEqual([entity]);
    expect(redisClient.set).toHaveBeenCalledWith(
      expectedKey,
      JSON.stringify([entity]),
    );
  });

  it('updates an existing entity and returns the updated copy', async () => {
    redisClient.get.mockResolvedValueOnce(
      JSON.stringify([{ id: '1', name: 'alpha', count: 1 }]),
    );

    const updated = await repository.repository.update('1', { name: 'beta' });

    const expectedKey = `${process.env.TABLE_PREFIX ?? ''}samples`;

    expect(updated).toEqual({ id: '1', name: 'beta', count: 1 });
    expect(redisClient.set).toHaveBeenCalledWith(
      expectedKey,
      JSON.stringify([{ id: '1', name: 'beta', count: 1 }]),
    );
  });

  it('deletes entities and reports missing rows', async () => {
    redisClient.get.mockResolvedValueOnce(
      JSON.stringify([{ id: '1', name: 'alpha', count: 1 }]),
    );
    redisClient.del.mockResolvedValueOnce(1);

    await expect(repository.repository.delete('1')).resolves.toBe(true);
    await expect(repository.repository.delete('1')).resolves.toBe(false);
  });
});
