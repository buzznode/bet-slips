import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import HorseButton from './HorseButton';
import { colors, spacing, font, radius } from '../theme';

interface LegConfig {
  numHorses: number;
  scratchedHorses: number[];
}

interface LegSelectorProps {
  numHorses: number;
  legs: number[][];
  onToggle: (legIndex: number, horse: number) => void;
  legConfigs?: LegConfig[];
  startRace?: number;
  disabled?: boolean;
  onUpdateLegConfig?: (legIndex: number, config: { numHorses: number; scratchedHorses: number[] }) => void;
}

export default function LegSelector({
  numHorses,
  legs,
  onToggle,
  legConfigs,
  startRace,
  disabled = false,
  onUpdateLegConfig,
}: LegSelectorProps) {
  const allFilled = legs.length > 0 && legs.every((l) => l.length > 0);
  const totalCombos = legs.reduce((acc, l) => acc * (l.length || 1), 1);

  const hint = allFilled
    ? `${legs.map((l) => l.length).join(' × ')} = ${totalCombos} combination${totalCombos !== 1 ? 's' : ''}`
    : 'Select at least one horse per race';

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Select Horses</Text>
      <View style={styles.legs}>
        {legs.map((legHorses, legIndex) => {
          const legConfig = legConfigs?.[legIndex];
          const legNumHorses = legConfig?.numHorses ?? numHorses;
          const legScratched = legConfig?.scratchedHorses ?? [];
          const horses = Array.from({ length: legNumHorses }, (_, i) => i + 1);
          const raceNumber = (startRace ?? 1) + legIndex;
          const isFutureLeg = legIndex > 0 && !!onUpdateLegConfig;

          return (
            <View key={legIndex} style={styles.leg}>
              <View style={styles.legHeader}>
                <Text style={styles.legTitle}>Race {raceNumber}</Text>
                <View style={styles.legHeaderRight}>
                  {legHorses.length > 0 && (
                    <Text style={styles.legCount}>
                      {legHorses.length} horse{legHorses.length !== 1 ? 's' : ''}
                    </Text>
                  )}
                  {isFutureLeg && (
                    <View style={styles.stepper}>
                      <Pressable
                        style={styles.stepBtn}
                        onPress={() =>
                          onUpdateLegConfig(legIndex, {
                            numHorses: Math.max(2, legNumHorses - 1),
                            scratchedHorses: legScratched.filter((h) => h <= legNumHorses - 1),
                          })
                        }
                      >
                        <Text style={styles.stepBtnText}>−</Text>
                      </Pressable>
                      <Text style={styles.stepValue}>{legNumHorses}</Text>
                      <Pressable
                        style={styles.stepBtn}
                        onPress={() =>
                          onUpdateLegConfig(legIndex, {
                            numHorses: legNumHorses + 1,
                            scratchedHorses: legScratched,
                          })
                        }
                      >
                        <Text style={styles.stepBtnText}>+</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>

              {isFutureLeg && (
                <View style={styles.scratchRow}>
                  <Text style={styles.scratchLabel}>Scratches</Text>
                  <View style={styles.scratchChips}>
                    {horses.map((n) => {
                      const isScratched = legScratched.includes(n);
                      return (
                        <Pressable
                          key={n}
                          style={[styles.scratchChip, isScratched && styles.scratchChipActive]}
                          onPress={() => {
                            const newScratched = isScratched
                              ? legScratched.filter((s) => s !== n)
                              : [...legScratched, n];
                            onUpdateLegConfig(legIndex, {
                              numHorses: legNumHorses,
                              scratchedHorses: newScratched,
                            });
                          }}
                        >
                          <Text style={[styles.scratchChipText, isScratched && styles.scratchChipTextActive]}>
                            {n}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}

              <View style={styles.grid}>
                {horses.map((n) => {
                  const isScratched = legScratched.includes(n);
                  return (
                    <HorseButton
                      key={n}
                      number={n}
                      variant={
                        isScratched
                          ? 'scratched'
                          : legHorses.includes(n)
                            ? 'selected'
                            : 'default'
                      }
                      disabled={disabled}
                      onClick={
                        isScratched ? () => {} : () => onToggle(legIndex, n)
                      }
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: font.md,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  legs: {
    gap: spacing.lg,
  },
  leg: {
    gap: spacing.sm,
  },
  legHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  legTitle: {
    color: colors.textMuted,
    fontSize: font.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  legCount: {
    color: colors.primary,
    fontSize: font.sm,
    fontWeight: '600',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  stepBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  stepBtnText: {
    color: colors.textMuted,
    fontSize: font.md,
    fontWeight: '600',
    lineHeight: font.md,
  },
  stepValue: {
    color: colors.text,
    fontSize: font.sm,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  scratchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  scratchLabel: {
    color: colors.textDim,
    fontSize: font.sm,
    paddingTop: 3,
    minWidth: 60,
  },
  scratchChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    flex: 1,
  },
  scratchChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceHigh,
  },
  scratchChipActive: {
    backgroundColor: colors.dangerDim,
    borderColor: colors.danger,
  },
  scratchChipText: {
    color: colors.textDim,
    fontSize: font.sm,
  },
  scratchChipTextActive: {
    color: colors.danger,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  hint: {
    color: colors.textDim,
    fontSize: font.sm,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
});
