import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

type UseAsyncListOptions = {
  errorMessage?: string;
  reloadOnFocus?: boolean;
};

export function useAsyncList<T>(
  loader: () => Promise<T[]>,
  {
    errorMessage = 'Não foi possível carregar os dados.',
    reloadOnFocus = true,
  }: UseAsyncListOptions = {},
) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(
    async (refreshing = false) => {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setLoadError(null);

      try {
        const data = await loader();
        setItems(data);
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : errorMessage,
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [loader, errorMessage],
  );

  useFocusEffect(
    useCallback(() => {
      if (reloadOnFocus) {
        void load();
      }
    }, [load, reloadOnFocus]),
  );

  return {
    items,
    isLoading,
    isRefreshing,
    errorMessage: loadError,
    reload: load,
  };
}
