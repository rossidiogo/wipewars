import { describe, expect, it } from 'vitest';
import { claimAll, claimMail, mergeRewards, unclaimed } from './actions';

const mail = (id: number, rewards: Rewards, claimed = false): Mail => ({ id, title: `m${id}`, body: '', rewards, claimed, t: 0 });
const saveWith = (...ms: Mail[]): Save => ({ gold: 0, gems: 0, mail: ms, team: [] });

describe('unclaimed', () => {
  it('returns only mail that has not been claimed', () => {
    const s = saveWith(mail(1, {}), mail(2, {}, true), mail(3, {}));
    expect(unclaimed(s).map(m => m.id)).toEqual([1, 3]);
  });
});

describe('mergeRewards', () => {
  it('sums currencies and keys and collects item tiers across mails', () => {
    const merged = mergeRewards([
      mail(1, { gold: 100, keys: { b: 3 } }),
      mail(2, { gems: 300, gold: 50, keys: { s: 1, b: 1 }, tiers: [2] }),
      mail(3, {}),
    ]);
    expect(merged).toEqual({ gold: 150, gems: 300, tix: 0, keys: { b: 4, s: 1 }, tiers: [2] });
  });

  it('is all zeroes for no mail', () => {
    expect(mergeRewards([])).toEqual({ gold: 0, gems: 0, tix: 0, keys: {}, tiers: [] });
  });

  it('keeps the recruit tickets a chapter mail carries', () => {
    expect(mergeRewards([mail(1, { gems: 100, tix: 5 }), mail(2, { tix: 3 })]).tix).toBe(8);
  });
});

describe('claimMail', () => {
  it('marks the mail claimed and returns its rewards', () => {
    const m = mail(1, { gold: 7 });
    expect(claimMail(m)).toBe(m.rewards);
    expect(m.claimed).toBe(true);
  });
});

describe('claimAll', () => {
  it('marks every unclaimed mail and returns their combined rewards', () => {
    const s = saveWith(mail(1, { gold: 10 }), mail(2, { gold: 99 }, true), mail(3, { gold: 5, gems: 1 }));
    expect(claimAll(s)).toEqual({ gold: 15, gems: 1, tix: 0, keys: {}, tiers: [] });
    expect(s.mail.every(m => m.claimed)).toBe(true);
  });

  it('returns zeroes and changes nothing when everything is already claimed', () => {
    const s = saveWith(mail(1, { gold: 10 }, true));
    const before = JSON.stringify(s);
    expect(claimAll(s)).toEqual({ gold: 0, gems: 0, tix: 0, keys: {}, tiers: [] });
    expect(JSON.stringify(s)).toBe(before);
  });
});
