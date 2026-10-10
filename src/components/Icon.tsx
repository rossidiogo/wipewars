/** A pixel-art icon from the ICO atlas. Sizes are the legacy `.ic` modifiers. */
export function Icon({ name, size }: { name: string; size?: 's' | 'lg' | 'xl' | 'big' }) {
  return <img class={size ? `ic ${size}` : 'ic'} src={ICO[name === 'gems' ? 'gem' : name]} alt="" />;
}
