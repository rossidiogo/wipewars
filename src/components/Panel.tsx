import type { ComponentChildren } from 'preact';

/** The ornate bordered frame used for cards and sections. */
export function Panel({ class: extra, children }: { class?: string; children: ComponentChildren }) {
  return <div class={extra ? `panel ${extra}` : 'panel'}>{children}</div>;
}
