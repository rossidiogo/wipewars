import type { ComponentChildren } from 'preact';

interface Props {
  variant?: 'primary' | 'danger';
  small?: boolean;
  wide?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ComponentChildren;
}

export function Button({ variant, small, wide, disabled, onClick, children }: Props) {
  const cls = ['btn', small && 'sm', wide && 'wide', variant].filter(Boolean).join(' ');
  return <button class={cls} disabled={disabled} onClick={onClick}>{children}</button>;
}
