import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { displayNumberStyle } from '@/utils/displayText';

type ResultadoAvaliacaoScoreCardProps = {
  score: number;
  maxScore?: number;
};

export function ResultadoAvaliacaoScoreCard({
  score,
  maxScore = 1.0,
}: ResultadoAvaliacaoScoreCardProps) {
  const colorScheme = useColorScheme();
  const buttonColor = useThemeColor({}, 'buttonColor');
  const cardSurface = useThemeColor({}, 'cardSurface');
  const cardBorderColor = useThemeColor({}, 'cardBorder');
  const progressTrackColor = useThemeColor({}, 'progressTrack');
  const percentage = (score / maxScore) * 100;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cardSurface,
          borderColor: cardBorderColor,
        },
      ]}
    >
      <ThemedText style={[styles.label, { color: Colors[colorScheme ?? 'light'].label }]}>
        PONTUAÇÃO GERAL
      </ThemedText>

      <ThemedText style={[styles.scoreValue, { color: buttonColor }]}>
        {score.toFixed(2)}
      </ThemedText>

      <View style={[styles.progressContainer, { backgroundColor: progressTrackColor }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: buttonColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  scoreValue: displayNumberStyle(48),
  progressContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
