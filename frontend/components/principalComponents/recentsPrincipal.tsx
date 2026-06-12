import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

type Evaluation = {
id: string;
name: string;
date: string;
status: 'SUSPEITA' | 'NORMAL';
};

type RecentesPrincipalProps = {
data: Evaluation[];
onVerTodos?: () => void;
};

const STATUS_COLORS = {
SUSPEITA: { bg: '#FEE2E2', text: '#C53030' },
NORMAL:   { bg: '#D1FAE5', text: '#065F46' },
};

const LEFT_BAR_COLORS = {
SUSPEITA: '#E53E3E',
NORMAL:   '#38A169',
};

export function RecentesPrincipal({ data, onVerTodos }: RecentesPrincipalProps) {
return (
    <ThemedView style={styles.section}>
    <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Avaliações Recentes</ThemedText>
        <TouchableOpacity onPress={onVerTodos}>
        <ThemedText style={styles.seeAll}>Ver todos</ThemedText>
        </TouchableOpacity>
    </ThemedView>

    <ThemedView style={styles.list}>
        {data.map((item) => (
        <TouchableOpacity key={item.id} activeOpacity={0.7}>
            <ThemedView style={styles.card}>
            <ThemedView
                style={[styles.leftBar, { backgroundColor: LEFT_BAR_COLORS[item.status] }]}
            />
            <ThemedView style={styles.cardContent}>
                <ThemedText style={styles.patientName}>{item.name}</ThemedText>
                <ThemedText style={styles.date}>{item.date}</ThemedText>
            </ThemedView>
            <ThemedView
                style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status].bg }]}
            >
                <ThemedText style={[styles.badgeText, { color: STATUS_COLORS[item.status].text }]}>
                {item.status}
                </ThemedText>
            </ThemedView>
            </ThemedView>
        </TouchableOpacity>
        ))}
    </ThemedView>
    </ThemedView>
);
}

const styles = StyleSheet.create({
section: {
    gap: 10,
    marginTop: 4,
},
sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
},
seeAll: {
    fontSize: 13,
    color: '#00478D',
    fontWeight: '500',
},
list: {
    gap: 10,
},
card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE4EE',
    overflow: 'hidden',
},
leftBar: {
    width: 4,
    alignSelf: 'stretch',
},
cardContent: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 4,
},
patientName: {
    fontSize: 15,
    fontWeight: '600',
},
date: {
    fontSize: 12,
    opacity: 0.5,
},
badge: {
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
},
badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
},
});