import { Icon } from './Icon';

/**
 * Reward pills, in the fixed order the game always lists them. Renders the chips only; the
 * caller supplies the `.chips` container. Mixed text is built as one string per node because
 * the translator (lang.js) matches whole text nodes.
 */
export function Chips({ rewards: r }: { rewards: Rewards }) {
  const keys = Object.entries(r.keys ?? {}).filter(([, n]) => n);
  const items = r.tiers?.length ?? 0;
  return (
    <>
      {!!r.gold && <span class="chip"><Icon name="gold" /><b>{comma(r.gold)}</b></span>}
      {!!r.gems && <span class="chip"><Icon name="gem" /><b>{comma(r.gems)}</b></span>}
      {!!r.tix && <span class="chip"><Icon name="ticket" /><b>{r.tix}</b></span>}
      {keys.map(([k, n]) => <span class="chip" key={k}><Icon name={KEYI[k]} /><b>{n}</b></span>)}
      {!!r.xp && <span class="chip xp"><b>{r.xp}</b> XP</span>}
      {items > 0 && (
        <span class="chip">
          {/* Shows the best tier's icon for the whole bundle. */}
          <Icon name={`item_sword_${Math.max(...r.tiers!)}`} />
          <b>{`${items} item${items > 1 ? 's' : ''}`}</b>
        </span>
      )}
    </>
  );
}
