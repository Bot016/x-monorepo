import { Tabs } from 'expo-router';
import { Platform, useWindowDimensions } from 'react-native';

import { AppTabBar } from '@/components/AppTabBar';
import { HapticTab } from '@/components/haptic-tab';
import { TabBarLabel } from '@/components/TabBarLabel';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LAYOUT } from '@/constants/layout';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const theme = Colors[colorScheme ?? 'light'];
  const isCompact = width < LAYOUT.tabBarCompactMaxWidth;
  const iconSize = isCompact ? 20 : 28;

  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabel: ({ color, children }) => (
          <TabBarLabel color={color}>{children}</TabBarLabel>
        ),
        tabBarIconStyle: {
          marginBottom: Platform.OS === 'web' ? 2 : 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          ...(Platform.OS === 'web' ? { overflow: 'visible' as const } : {}),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Principal',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={iconSize} name="square.grid.2x2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="relatorios"
        options={{
          title: 'Relatórios',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={iconSize} name="chart.bar.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pacientes"
        options={{
          title: 'Pacientes',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={iconSize} name="person.2.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
