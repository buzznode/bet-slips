import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, font } from '../theme';
import { purchasePro, restorePro } from '../lib/purchases';

interface Props {
  visible: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

const FREE_FEATURES = [
  'All bet types & combinations',
  '1 track, 1 bettor',
  'Full bet tracking & outcomes',
  'Day summary',
  'Share bet slip',
];

const PRO_FEATURES = [
  'Unlimited tracks',
  'Unlimited bettors',
  'Bet history archive',
  'Backup & restore',
  'Saved bet templates',
];

export default function ProUpgradeModal({ visible, onClose, onUnlocked }: Props) {
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  async function handlePurchase() {
    setLoading(true);
    const result = await purchasePro();
    setLoading(false);
    if (result.success) {
      onUnlocked();
    } else if (!result.userCancelled && result.error) {
      Alert.alert('Purchase Failed', result.error);
    }
  }

  async function handleRestore() {
    setRestoring(true);
    const unlocked = await restorePro();
    setRestoring(false);
    if (unlocked) {
      onUnlocked();
    } else {
      Alert.alert('No Purchase Found', 'No previous Pro purchase was found for this account.');
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeTxt}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.emoji}>🏇</Text>
          <Text style={styles.title}>Bet Slips Pro</Text>
          <Text style={styles.price}>$12.99 one-time</Text>
          <Text style={styles.sub}>No subscription. Pay once, use forever.</Text>
        </View>

        <View style={styles.columns}>
          <View style={styles.col}>
            <Text style={styles.colLabel}>Free</Text>
            {FREE_FEATURES.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Text style={styles.check}>✓</Text>
                <Text style={styles.featureTxt}>{f}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.col}>
            <Text style={[styles.colLabel, styles.proLabel]}>Pro</Text>
            {PRO_FEATURES.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Text style={styles.proCheck}>★</Text>
                <Text style={styles.featureTxt}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.buyBtn, loading && styles.btnDisabled]}
            onPress={handlePurchase}
            disabled={loading || restoring}
          >
            {loading
              ? <ActivityIndicator color={colors.bg} />
              : <Text style={styles.buyTxt}>Unlock Pro — $12.99</Text>
            }
          </Pressable>

          <Pressable
            style={styles.restoreBtn}
            onPress={handleRestore}
            disabled={loading || restoring}
          >
            {restoring
              ? <ActivityIndicator color={colors.textMuted} size="small" />
              : <Text style={styles.restoreTxt}>Restore purchase</Text>
            }
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  closeBtn: {
    padding: spacing.sm,
  },
  closeTxt: {
    color: colors.textMuted,
    fontSize: font.lg,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: font.xxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: font.xl,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sub: {
    fontSize: font.sm,
    color: colors.textMuted,
  },
  columns: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  col: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  colLabel: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  proLabel: {
    color: colors.primary,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  check: {
    color: colors.success,
    fontSize: font.sm,
    marginTop: 1,
  },
  proCheck: {
    color: colors.primary,
    fontSize: font.sm,
    marginTop: 1,
  },
  featureTxt: {
    flex: 1,
    color: colors.text,
    fontSize: font.sm,
    lineHeight: 18,
  },
  actions: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  buyBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  buyTxt: {
    color: colors.bg,
    fontSize: font.lg,
    fontWeight: '700',
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  restoreTxt: {
    color: colors.textMuted,
    fontSize: font.sm,
  },
});
