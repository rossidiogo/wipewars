// @vitest-environment jsdom
import { render } from 'preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initStore } from '../../bridge/store';
import { Mail } from './Mail';

const tick = () => new Promise(r => setTimeout(r));
const out: RewardOut = { gold: 1, gems: 0, keys: {}, items: [], xp: 0 };
let host: HTMLElement;
let calls: string[];

function mount(mail: Mail[]) {
  vi.stubGlobal('save', { gold: 0, gems: 0, mail });
  render(<Mail />, host);
}
const letter = (id: number, rewards: Rewards = { gold: 5000, gems: 300, keys: { s: 1 } }): Mail =>
  ({ id, title: `Title ${id}`, body: `Body <b>${id}</b>`, rewards, claimed: false, t: Date.UTC(2026, 0, 15, 17) });

beforeEach(() => {
  calls = [];
  vi.stubGlobal('DRAW', {});
  vi.stubGlobal('ICO', new Proxy({}, { get: (_, k) => `ico:${String(k)}` }));
  vi.stubGlobal('KEYI', { b: 'key_bronze', s: 'key_silver', g: 'key_gold' });
  vi.stubGlobal('comma', (n: number) => n.toLocaleString('en-US'));
  vi.stubGlobal('openScreen', vi.fn());
  vi.stubGlobal('give', vi.fn(() => { calls.push('give'); return out; }));
  vi.stubGlobal('syncCur', vi.fn(() => { calls.push('syncCur'); }));
  vi.stubGlobal('showRewards', vi.fn(() => { calls.push('showRewards'); }));
  vi.stubGlobal('save', { gold: 0, gems: 0, mail: [] });
  initStore();
  document.body.innerHTML = '<div id="mailBody"></div>';
  host = document.getElementById('mailBody')!;
});
afterEach(() => { render(null, host); vi.unstubAllGlobals(); });

describe('Mail', () => {
  it('shows the unclaimed count as a single text node, so the translator can match it', () => {
    mount([letter(1), letter(2)]);
    const span = host.querySelector('.bagbar span')!;
    expect(span.childNodes).toHaveLength(1);
    expect(span.textContent).toBe('2 unclaimed');
  });

  it('renders each mail with the legacy structure', () => {
    mount([letter(1), letter(2)]);
    const rows = host.querySelectorAll(':scope > .panel.mailr');
    expect(rows).toHaveLength(2);
    const row = rows[0];
    expect([...row.children].map(c => c.className)).toEqual(['mh', 'sub', 'chips', 'btn sm primary']);
    expect(row.querySelector('.mh b')!.textContent).toBe('Title 1');
    expect(row.querySelector('.mh small')!.textContent).toBe(new Date(letter(1).t).toLocaleDateString());
    expect(row.querySelector('.sub')!.innerHTML).toBe('Body <b>1</b>');
    expect(row.querySelector('button')!.textContent).toBe('Claim');
  });

  it('shows reward chips in legacy order with icons and formatted amounts', () => {
    mount([letter(1, { xp: 10, tiers: [0, 2], keys: { s: 1, b: 0 }, tix: 2, gems: 300, gold: 5000 })]);
    const chips = [...host.querySelectorAll('.chips .chip')];
    expect(chips.map(c => c.textContent)).toEqual(['5,000', '300', '2', '1', '10 XP', '2 items']);
    expect(chips.map(c => c.querySelector('img')?.getAttribute('src') ?? null))
      .toEqual(['ico:gold', 'ico:gem', 'ico:ticket', 'ico:key_silver', null, 'ico:item_sword_2']);
    expect(chips[4].className).toBe('chip xp');
    expect(chips[5].querySelector('b')!.childNodes).toHaveLength(1);
  });

  it('says "1 item" for a single item', () => {
    mount([letter(1, { tiers: [1] })]);
    expect(host.querySelector('.chips .chip')!.textContent).toBe('1 item');
  });

  it('claims one mail: grants, refreshes, then shows the rewards, and marks the row claimed', async () => {
    const mails = [letter(1), letter(2)];
    mount(mails);
    host.querySelector<HTMLButtonElement>('.mailr button')!.click();
    expect(give).toHaveBeenCalledWith(mails[0].rewards);
    expect(showRewards).toHaveBeenCalledWith('Title 1', out);
    expect(calls).toEqual(['give', 'syncCur', 'showRewards']);
    await tick();
    const row = host.querySelector('.mailr')!;
    expect(row.className).toBe('panel mailr done');
    const btn = row.querySelector('button')!;
    expect(btn.textContent).toBe('Claimed');
    expect(btn.disabled).toBe(true);
    expect(btn.className).toBe('btn sm');
    expect(host.querySelector('.bagbar span')!.textContent).toBe('1 unclaimed');
  });

  it('claims everything at once with the combined rewards', async () => {
    mount([letter(1, { gold: 10 }), letter(2, { gold: 5, keys: { b: 3 } })]);
    host.querySelector<HTMLButtonElement>('.bagbar button')!.click();
    expect(give).toHaveBeenCalledWith({ gold: 15, gems: 0, keys: { b: 3 }, tiers: [] });
    expect(showRewards).toHaveBeenCalledWith('Mail Rewards', out);
    expect(calls).toEqual(['give', 'syncCur', 'showRewards']);
    await tick();
    expect(host.querySelector('.bagbar span')!.textContent).toBe('0 unclaimed');
    expect(host.querySelector<HTMLButtonElement>('.bagbar button')!.disabled).toBe(true);
  });

  it('shows an empty state and a disabled Claim all when there is no mail', () => {
    mount([]);
    expect(host.querySelector('.empty-msg')!.textContent).toBe('No mail.');
    const all = host.querySelector<HTMLButtonElement>('.bagbar button')!;
    expect(all.textContent).toBe('Claim all');
    expect(all.className).toBe('btn sm primary');
    expect(all.disabled).toBe(true);
    expect(host.querySelector('.bagbar span')!.textContent).toBe('0 unclaimed');
  });
});
