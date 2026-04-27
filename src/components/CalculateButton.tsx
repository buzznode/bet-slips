import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';
import { haptic } from '../lib/haptics';

interface CalculateButtonProps {
  onClick: () => void;
  disabled: boolean;
  pendingCost?: number | null;
}

export default function CalculateButton({
  onClick,
  disabled,
  pendingCost,
}: CalculateButtonProps) {
  const costStr = pendingCost != null
    ? (pendingCost % 1 === 0 ? `$${pendingCost}` : `$${pendingCost.toFixed(2)}`)
    : null;

  return (
    <View>
      {costStr != null && (
        <View style={styles.costBanner}>
          <Text style={styles.costLabel}>Bet Total</Text>
          <Text style={styles.costAmount}>{costStr}</Text>
        </View>
      )}
      <Pressable
        style={[styles.btn, disabled && styles.disabled]}
        onPress={() => { haptic.medium(); onClick(); }}
        disabled={disabled}
      >
        <Text style={styles.text}>
          {costStr != null ? `Add ${costStr} Bet →` : 'Add Bet →'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  costBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  costLabel: {
    color: colors.textMuted,
    fontSize: font.sm,
    fontWeight: '600',
  },
  costAmount: {
    color: colors.primary,
    fontSize: font.xl,
    fontWeight: '800',
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: '#fff',
    fontSize: font.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
