import { useWindowDimensions } from 'react-native';

import { LAYOUT } from '@/constants/layout';

export function useBreakpointLayout() {
  const { width } = useWindowDimensions();

  const isStatsRow = width >= LAYOUT.statsRowMinWidth;
  const isWide = width >= LAYOUT.dashboardWideMinWidth;
  const gridColumns = isWide ? 3 : isStatsRow ? 2 : 1;

  return {
    width,
    isStatsRow,
    isWide,
    gridColumns,
  };
}
