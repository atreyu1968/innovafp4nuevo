import { describe, it, expect, vi } from 'vitest';
import { useCacheStore } from '../stores/cache';

describe('Cache Store', () => {
  it('should store and retrieve cached data', () => {
    const store = useCacheStore.getState();
    const testData = { test: 'data' };
    
    store.setCache('test', testData);
    expect(store.getCache('test')).toEqual(testData);
  });

  it('should respect TTL', () => {
    const store = useCacheStore.getState();
    const testData = { test: 'data' };
    
    vi.useFakeTimers();
    store.setCache('test', testData, 1000); // 1 second TTL
    
    expect(store.getCache('test')).toEqual(testData);
    
    vi.advanceTimersByTime(1500); // Advance past TTL
    expect(store.getCache('test')).toBeNull();
    
    vi.useRealTimers();
  });

  it('should clear specific cache entries', () => {
    const store = useCacheStore.getState();
    
    store.setCache('test1', 'data1');
    store.setCache('test2', 'data2');
    
    store.clearCache('test1');
    
    expect(store.getCache('test1')).toBeNull();
    expect(store.getCache('test2')).toBe('data2');
  });

  it('should clear all cache entries', () => {
    const store = useCacheStore.getState();
    
    store.setCache('test1', 'data1');
    store.setCache('test2', 'data2');
    
    store.clearCache();
    
    expect(store.getCache('test1')).toBeNull();
    expect(store.getCache('test2')).toBeNull();
  });
});