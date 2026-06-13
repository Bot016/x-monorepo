import { useEffect, useState } from 'react';
import { Appearance, useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * Appearance.addChangeListener keeps components in sync when the OS/browser theme changes.
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | null>(
    () => Appearance.getColorScheme() ?? 'light',
  );

  useEffect(() => {
    setHasHydrated(true);

    const subscription = Appearance.addChangeListener(({ colorScheme: next }) => {
      setColorScheme(next ?? 'light');
    });

    return () => subscription.remove();
  }, []);

  const rnColorScheme = useRNColorScheme();

  if (!hasHydrated) {
    return 'light';
  }

  return colorScheme ?? rnColorScheme ?? 'light';
}
