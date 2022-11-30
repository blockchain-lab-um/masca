import { DataManager } from '../src/agent/dataManager';
import { AbstractDataStore } from '../src/data-store/abstractDataStore';
import { MemoryDataStore } from '../src/data-store/data-store';

describe('Data Manager', () => {
  const stores: Record<string, AbstractDataStore> = {};
  stores['memory1'] = new MemoryDataStore();
  stores['memory2'] = new MemoryDataStore();

  const dataManager = new DataManager({ store: stores });
  beforeEach(async () => {
    await dataManager.clear({});
  });
  describe('MemoryDataManager', () => {
    it('should store object', async () => {
      const data = { test: 'test' };
      const res = await dataManager.save({
        data,
        options: { store: 'memory1' },
      });

      const allData = await dataManager.query({});
      expect(allData).toHaveLength(1);
      expect(allData[0].meta.id).toEqual(res[0].id);
      expect(res[0].store).toEqual('memory1');
      expect(allData[0].data).toEqual(data);
      expect(allData[0].meta.store).toEqual('memory1');
      expect.assertions(5);
    });
    it('should store multiple objects in same memory store', async () => {
      const data = { test: 'test' };
      const res = await dataManager.save({
        data,
        options: { store: 'memory1' },
      });
      const res2 = await dataManager.save({
        data,
        options: { store: 'memory1' },
      });

      const allData = await dataManager.query({});
      expect(allData).toHaveLength(2);
      expect(allData[0].meta.id).toEqual(res[0].id);
      expect(res[0].store).toEqual('memory1');
      expect(allData[0].data).toEqual(data);
      expect(allData[0].meta.store).toEqual('memory1');
      expect(allData[0].data).toEqual(data);
      expect(allData[1].meta.id).toEqual(res2[0].id);
      expect(res2[0].store).toEqual('memory1');
      expect(allData[1].data).toEqual(data);
      expect(allData[1].meta.store).toEqual('memory1');
      expect(allData[1].data).toEqual(data);
      expect.assertions(11);
    });
    it('should store object in multiple stores', async () => {
      const data = { test: 'test' };
      const res = await dataManager.save({
        data,
        options: { store: ['memory1', 'memory2'] },
      });

      const allData = await dataManager.query({});
      expect(allData).toHaveLength(2);
      expect(allData[0].meta.id).toEqual(res[0].id);
      expect(allData[1].meta.id).toEqual(res[1].id);
      expect(res[0].store).toEqual('memory1');
      expect(res[1].store).toEqual('memory2');
      expect(allData[0].data).toEqual(data);
      expect(allData[1].data).toEqual(data);
      expect(allData[0].meta.store).toEqual('memory1');
      expect(allData[1].meta.store).toEqual('memory2');
      expect.assertions(9);
    });
    it('should clear objects from multiple stores', async () => {
      const data = { test: 'test' };
      const res = await dataManager.save({
        data,
        options: { store: ['memory1', 'memory2'] },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const rews = await dataManager.clear({});
      const allData = await dataManager.query({});
      expect(allData).toHaveLength(0);
      expect.assertions(1);
    });
    it('should query object by id', async () => {
      const data = { test: 'test' };
      const res = await dataManager.save({
        data,
        options: { store: 'memory1' },
      });

      const allData = await dataManager.query({
        filter: { type: 'id', filter: res[0].id },
      });
      expect(allData).toHaveLength(1);
      expect(allData[0].meta.id).toEqual(res[0].id);
      expect(res[0].store).toEqual('memory1');
      expect(allData[0].data).toEqual(data);
      expect(allData[0].meta.store).toEqual('memory1');
      expect.assertions(5);
    });
    it('should query object by id in specific store', async () => {
      const data = { test: 'test' };
      const res = await dataManager.save({
        data,
        options: { store: 'memory1' },
      });

      const allData = await dataManager.query({
        filter: { type: 'id', filter: res[0].id },
        options: { store: 'memory1' },
      });
      expect(allData).toHaveLength(1);
      expect(allData[0].meta.id).toEqual(res[0].id);
      expect(res[0].store).toEqual('memory1');
      expect(allData[0].data).toEqual(data);
      expect(allData[0].meta.store).toEqual('memory1');
      expect.assertions(5);
    });
    it('should fail query object by id in specific store', async () => {
      const data = { test: 'test' };
      const res = await dataManager.save({
        data,
        options: { store: 'memory1' },
      });

      const allData = await dataManager.query({
        filter: { type: 'id', filter: 'wrong_id' },
        options: { store: 'memory1' },
      });
      expect(allData).toHaveLength(0);
      expect.assertions(1);
    });
  });
});
