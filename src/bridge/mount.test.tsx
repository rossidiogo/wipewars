// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerScreen } from './mount';
import { REQUIRED_GLOBALS, initStore, useSave } from './store';

const tick = () => new Promise(r => setTimeout(r));
let host: HTMLElement;

beforeEach(() => {
  for (const name of REQUIRED_GLOBALS) vi.stubGlobal(name, vi.fn());
  vi.stubGlobal('DRAW', {});
  vi.stubGlobal('save', { gold: 5 });
  document.body.innerHTML = '<div id="mx"></div>';
  host = document.getElementById('mx')!;
  initStore();
});
afterEach(() => vi.unstubAllGlobals());

describe('registerScreen', () => {
  it('installs a DRAW entry that renders the component into its mount point', () => {
    registerScreen('x', 'mx', () => <p>hello</p>);
    expect(host.innerHTML).toBe('');
    DRAW.x();
    expect(host.innerHTML).toBe('<p>hello</p>');
  });

  it('re-renders a mounted screen when legacy code calls syncCur', async () => {
    registerScreen('x', 'mx', () => <p>{String(useSave().gold)}</p>);
    DRAW.x();
    expect(host.textContent).toBe('5');
    save.gold = 9;
    syncCur();
    await tick();
    expect(host.textContent).toBe('9');
  });

  it('shows the error and a way home when a screen throws while rendering', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    registerScreen('x', 'mx', () => { throw new Error('boom in mail'); });
    DRAW.x();
    await tick();
    expect(host.textContent).toContain('boom in mail');
    host.querySelector('button')!.click();
    expect(openScreen).toHaveBeenCalledWith('home');
  });

  it('fails loudly when the mount point is not in the page', () => {
    registerScreen('x', 'nope', () => <p />);
    expect(() => DRAW.x()).toThrow('Mount point missing: #nope');
  });
});
