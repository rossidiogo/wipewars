/** Mail rules, free of DOM and legacy calls so they can be unit-tested. */

type Merged = Required<Pick<Rewards, 'gold' | 'gems' | 'keys' | 'tiers'>>;

export const unclaimed = (s: Save): Mail[] => s.mail.filter(m => !m.claimed);

/** Adds up the rewards of several mails into one grant. Mail never carries tickets or XP. */
export function mergeRewards(mails: Mail[]): Merged {
  const total: Merged = { gold: 0, gems: 0, keys: {}, tiers: [] };
  for (const { rewards: r } of mails) {
    total.gold += r.gold ?? 0;
    total.gems += r.gems ?? 0;
    for (const k in r.keys) total.keys[k] = (total.keys[k] ?? 0) + r.keys[k];
    total.tiers.push(...(r.tiers ?? []));
  }
  return total;
}

/** Marks one mail claimed and returns what to grant for it. */
export function claimMail(m: Mail): Rewards {
  m.claimed = true;
  return m.rewards;
}

/** Marks every unclaimed mail claimed and returns the combined grant. */
export function claimAll(s: Save): Merged {
  const pending = unclaimed(s);
  for (const m of pending) m.claimed = true;
  return mergeRewards(pending);
}
