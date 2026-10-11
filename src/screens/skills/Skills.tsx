import { useEffect, useRef, useState } from 'preact/hooks';
import { touch, useSave } from '../../bridge/store';
import { Button } from '../../components/Button';
import { Panel } from '../../components/Panel';
import { KEYSTONE_ICON, SKILL_ICONS } from './icons';

/** Selection inside the tree: a node id, or a keystone id. */
type Pick = { kind: 'node' | 'key'; id: string } | null;

function Glyph({ d }: { d: string }) {
  return <svg class="skg" viewBox="0 0 24 24" aria-hidden="true"><path d={d} fill="currentColor" fill-rule="evenodd" /></svg>;
}

/** The hero's sprite, drawn by the legacy canvas renderer. */
function Sprite({ hero }: { hero: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) spriteArt(ref.current, hero, 1.1, true); }, [hero]);
  return <div class="skport"><div ref={ref} /></div>;
}

/** Why a node cannot be learned, in words. Empty when it can. */
function nodeReason(hero: string, branch: SkillBranch, i: number): string {
  const block = skBlock(hero, branch.nodes[i].id);
  if (block === 'max') return 'Maxed';
  if (block === 'locked') return `Needs ${SK_STEP} ranks of ${branch.nodes[i - 1].n}`;
  if (block === 'points') return 'No skill points left';
  return '';
}

/**
 * A hero's skill tree: three class branches of three nodes, then two keystones of the hero's own.
 * Tapping a node selects it and shows what it does; "Learn" spends a point. All rules live in js/skills.js.
 */
export function Skills() {
  useSave();
  const [pick, setPick] = useState<Pick>(null);
  const owned = HIDS.filter(isOwned);
  const hero = owned.includes(selHero) ? selHero : owned[0];
  const H = HEROES[hero], tree = skTree(hero), keys = KEYSTONES[hero];
  const free = skFree(hero), total = skTotal(hero), spent = skSpent(hero);
  const inNodes = spent - (skKey(hero) ? SK_KEY_COST : 0);
  const changed = () => { touch(); syncCur(); };
  const go = (k: string) => { selHero = k; setPick(null); touch(); };
  const step = (d: number) => go(owned[(owned.indexOf(hero) + d + owned.length) % owned.length]);

  let detail = null;
  if (pick?.kind === 'node') {
    for (const b of tree) {
      const i = b.nodes.findIndex(n => n.id === pick.id);
      if (i < 0) continue;
      const n = b.nodes[i], why = nodeReason(hero, b, i);
      detail = (
        <Panel class="skdet">
          <div class="skdh"><b style={{ color: b.col }}>{n.n}</b><small>{`Rank ${skRank(hero, n.id)} / ${SK_RANKS}`}</small></div>
          <div class="sub">{n.d}</div>
          <Button variant="primary" wide disabled={!!why} onClick={() => { if (skBuy(hero, n.id)) { sfx('click'); changed(); } }}>{why || 'Learn'}</Button>
        </Panel>
      );
    }
  } else if (pick?.kind === 'key') {
    const k = keys.find(x => x.id === pick.id);
    if (k) {
      const block = skKeyBlock(hero, k.id);
      const label = block === 'on' ? 'Active' : block === 'locked' ? `Spend ${SK_KEY_REQ} points in the tree first (${inNodes} / ${SK_KEY_REQ})`
        : block === 'points' ? `Needs ${SK_KEY_COST} skill points` : skKey(hero) ? 'Switch to this keystone' : 'Activate';
      detail = (
        <Panel class="skdet key">
          <div class="skdh"><b>{k.n}</b><small>Keystone</small></div>
          <div class="sub">{k.d}</div>
          <Button variant="primary" wide disabled={!!block} onClick={() => { if (skPickKey(hero, k.id)) { sfx('reward'); changed(); } }}>{label}</Button>
        </Panel>
      );
    }
  }

  return (
    <>
      <Panel class="skhead">
        <button class="btn sm sknav" aria-label="Previous hero" disabled={owned.length < 2} onClick={() => step(-1)}>&#8249;</button>
        <Sprite hero={hero} />
        <div class="skinfo">
          <div class="hname">{H.n}</div>
          <div class="hrole">{H.role}</div>
          <div class={free > 0 ? 'skpts has' : 'skpts'}><b>{String(free)}</b><span>{free === 1 ? 'point to spend' : 'points to spend'}</span></div>
          <div class="sub">{`${spent} / ${total} spent`}</div>
        </div>
        <button class="btn sm sknav" aria-label="Next hero" disabled={owned.length < 2} onClick={() => step(1)}>&#8250;</button>
      </Panel>

      <Panel class="sktree">
        <div class="skcols">
          {tree.map(b => (
            <div class="skcol" key={b.n} style={{ '--bc': b.col }}>
              <div class="skbn">{b.n}</div>
              {b.nodes.map((n, i) => {
                const rank = skRank(hero, n.id), block = skBlock(hero, n.id);
                const cls = ['sknode', rank > 0 && 'on', block === 'max' && 'max', block === 'locked' && 'locked', !block && 'can', pick?.id === n.id && 'sel'].filter(Boolean).join(' ');
                return (
                  <button class={cls} key={n.id} style={{ '--p': rank / SK_RANKS }} onClick={() => setPick({ kind: 'node', id: n.id })}>
                    <span class="skring"><Glyph d={SKILL_ICONS[n.m]} /></span>
                    <span class="sknn">{n.n}</span>
                    <span class="skpips">{Array.from({ length: SK_RANKS }, (_, k) => <i class={k < rank ? 'f' : ''} key={k} />)}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div class={inNodes >= SK_KEY_REQ ? 'skjoin open' : 'skjoin'}><span>{inNodes >= SK_KEY_REQ ? 'Keystones' : `Keystones unlock at ${SK_KEY_REQ} points (${inNodes} / ${SK_KEY_REQ})`}</span></div>
        <div class="skkeys">
          {keys.map(k => {
            const block = skKeyBlock(hero, k.id);
            const cls = ['skkey', block === 'on' && 'on', block === 'locked' && 'locked', pick?.id === k.id && 'sel'].filter(Boolean).join(' ');
            return (
              <button class={cls} key={k.id} onClick={() => setPick({ kind: 'key', id: k.id })}>
                <span class="skgem"><Glyph d={KEYSTONE_ICON} /></span>
                <span class="sknn">{k.n}</span>
              </button>
            );
          })}
        </div>
      </Panel>

      {detail ?? <div class="sub dim center">Tap a skill to see what it does.</div>}

      <div class="rbtns">
        <Button disabled={free < 1} onClick={() => { skAuto(hero); toast('Points assigned'); changed(); }}>Auto-assign</Button>
        <Button disabled={spent < 1} onClick={() => { skReset(hero); setPick(null); toast('Skill points reset'); changed(); }}>Reset</Button>
      </div>
      <div class="sub dim center">Heroes earn 1 skill point per level-up and 2 per star. Resetting is free.</div>
    </>
  );
}
