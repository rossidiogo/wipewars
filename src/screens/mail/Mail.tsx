import { useSave } from '../../bridge/store';
import { Button } from '../../components/Button';
import { Chips } from '../../components/Chips';
import { EmptyState } from '../../components/EmptyState';
import { Panel } from '../../components/Panel';
import { claimAll, claimMail, unclaimed } from './actions';

/** Grants rewards, refreshes the currency pills (which re-renders this screen), then shows what was received. */
function grant(title: string, rewards: Rewards) {
  const out = give(rewards);
  syncCur();
  showRewards(title, out);
}

/** Body of the Mail screen: reward letters the player can claim one by one or all at once. */
export function Mail() {
  const s = useSave();
  const pending = unclaimed(s);
  return (
    <>
      <div class="bagbar">
        <span>{`${pending.length} unclaimed`}</span>
        <Button small variant="primary" disabled={!pending.length} onClick={() => grant('Mail Rewards', claimAll(s))}>Claim all</Button>
      </div>
      {!s.mail.length && <EmptyState>No mail.</EmptyState>}
      {s.mail.map(m => (
        <Panel key={m.id} class={m.claimed ? 'mailr done' : 'mailr'}>
          <div class="mh">
            <b dangerouslySetInnerHTML={{ __html: m.title }} />
            <small>{new Date(m.t).toLocaleDateString()}</small>
          </div>
          <div class="sub" dangerouslySetInnerHTML={{ __html: m.body }} />
          <div class="chips"><Chips rewards={m.rewards} /></div>
          <Button small variant={m.claimed ? undefined : 'primary'} disabled={m.claimed} onClick={() => grant(m.title, claimMail(m))}>
            {m.claimed ? 'Claimed' : 'Claim'}
          </Button>
        </Panel>
      ))}
    </>
  );
}
