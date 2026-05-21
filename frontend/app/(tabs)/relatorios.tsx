import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function RelatoriosScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E8D5B7', dark: '#3D3426' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="doc.text.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Relatórios
        </ThemedText>
      </ThemedView>
      <ThemedText>Consulte e exporte relatórios da sua clínica.</ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
