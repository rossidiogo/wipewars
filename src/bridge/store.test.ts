// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REQUIRED_GLOBALS, initStore, version } from './store';

const stubAll = (except?: string) => {
  for (const name of REQUIRED_GLOBALS) if (name !== except) vi.stubGlobal(name, name === 'save' || name === 'DRAW' ? {} : vi.fn());
};

beforeEach(() => { version.value = 0; });
afterEach(() => vi.unstubAllGlobals());

describe('initStore', () => {
  it('names the legacy global that is missing', () => {
    stubAll('give');
    expect(() => initStore()).toThrow('Legacy global missing: give');
  });

  it('bumps the version each time legacy code calls syncCur, and still runs the original', () => {
    stubAll();
    const original = syncCur;
    initStore();
    syncCur();
    expect(original).toHaveBeenCalledTimes(1);
    expect(version.value).toBe(1);
  });

  it('wraps syncCur only once when initialised twice', () => {
    stubAll();
    initStore();
    initStore();
    syncCur();
    expect(version.value).toBe(1);
  });
});
