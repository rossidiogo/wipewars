import type { ComponentChildren } from 'preact';

export function EmptyState({ children }: { children: ComponentChildren }) {
  return <div class="empty-msg">{children}</div>;
}
