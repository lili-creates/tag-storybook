import { useEffect, useState } from 'react';

/** Lee el valor calculado de una variable CSS y se actualiza al cambiar `data-theme` (claro/oscuro). */
export function useTokenValue(name: string): string {
  const [value, setValue] = useState('');
  useEffect(() => {
    const read = () =>
      setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [name]);
  return value;
}
