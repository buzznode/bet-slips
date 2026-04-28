# CLAUDE.md

## Project Overview

**bet-slips-native** is a React Native (Expo) port of the bet-slips PWA — a horse racing bet tracker for iOS and Android. It calculates betting combinations, tracks bets across multiple tracks/bettors, determines win/loss outcomes, and logs payouts.

## Tech Stack

- **React Native** + **Expo** (managed workflow)
- **TypeScript**
- **Jest** + **React Native Testing Library** for tests
- **AsyncStorage** for persistence
- **react-native-purchases v10** (RevenueCat) for IAP
- Target platforms: iOS (App Store) and Android (Google Play)

## Commands

```bash
npm run ios        # Run in iOS Simulator
npm run android    # Run in Android emulator
npm run web        # Run in browser (dev only)
npx expo start     # Start Expo dev server
npm test           # Run tests
```

## Versioning

Bump `version` in `package.json` for every change that warrants a GitHub push.

- **Patch** (`1.0.x`) — Bug fixes, minor UI tweaks, copy changes
- **Minor** (`1.x.0`) — New features, new bet types, new components
- **Major** (`x.0.0`) — Breaking changes to state shape, major architecture changes

## Workflow After Making Changes

After completing any code change, always do all of the following without being asked:

1. **Write tests** for any new logic or significant component behavior — unit tests in `betting.test.ts`/`outcomes.test.ts`, UI interaction tests in `components.test.tsx`
2. **Run tests** (`npm test`) — all suites must pass with no failures, including unit and component tests
3. **Bump version** in `package.json`
4. **Stage** the changed files
5. **Commit** with a descriptive message (format: `vX.Y.Z: <summary>` with bullet details in body)
6. **Push** to GitHub

## Commit Message Guidelines

- Format: `vX.Y.Z: Short summary` with bullet-point details in the body
- Do **not** include `Co-Authored-By` or any AI attribution lines in commit messages

## Monetization

- **Free tier:** all bet types, 1 track, 1 bettor, current day tracking, day summary, share slip
- **Pro — $12.99 one-time:** unlimited tracks, unlimited bettors, bet history archive, backup & restore, saved bet templates
- Implemented via RevenueCat (`react-native-purchases` v10)
- Entitlement ID: `BetSlips Pro`
- `isPro` defaults to `true` in `__DEV__` mode so all features are accessible during development

## RevenueCat Status (as of 2026-04-27)

### RevenueCat Dashboard
- Project: BetSlips (`proj14cf468e`) at app.revenuecat.com
- Entitlement: `BetSlips Pro`
- Offering: `default` with `Lifetime` package
- Test API key: `test_rAozgrIaRDQESLiBLHVyZeohxQK`

### Android (Google Play)
- App: BetSlips (Play Store), package `com.buzznode.betslips`
- Product ID: `betslips_pro_lifetime`, $12.99, Active/Published
- Production API key: `goog_WKjVJpYiCKGOAPQvkoWuJrCElzQ` (active in code)
- Credentials warning: Google Play service account permissions may still be propagating — check dashboard and retry if still showing
- Key file: `lot-check/google-service-account.json` (shared service account, `firstsourcellc@firstsourcellc.iam.gserviceaccount.com`)

### iOS (App Store)
- **NOT YET SET UP** — waiting on Apple developer account approval
- Once approved:
  1. Add iOS app in RevenueCat dashboard (Apps & providers → Configurations → App Store)
  2. Create `betslips_pro_lifetime` product in App Store Connect at $12.99
  3. Get `appl_` API key from RevenueCat API Keys page
  4. Replace `appl_PLACEHOLDER` in `src/lib/purchases.ts`
  5. Build and submit iOS binary via EAS (`eas build --platform ios --profile production`)

## Current Status (as of 2026-04-27, v2.0.0)

### What's working
- Full bet tracking: all bet types, modifiers, multi-race, positional part-wheel
- Multiple bettors, multiple tracks, race day setup
- Bet history, outcomes/payouts, day summary
- Archive and backup/restore
- Share slip (text) with bet amount first: `$5.00 Trifecta (Box)`
- Prominent cost banner above Add Bet button showing pending total
- Pro paywall modal (`src/components/ProUpgradeModal.tsx`) with free vs Pro feature comparison
- Feature gates: multiple tracks, multiple bettors, archive, backup/restore, template saving
- RevenueCat initialized on app mount, entitlement checked on startup

### Google Play
- Package: `com.buzznode.betslips`
- v1.9.47 (version code 3): in review (original submission, 2026-04-26)
- v2.0.0 (version code 5): in review (RevenueCat Pro paywall, submitted 2026-04-27)
- Store screenshots: uploaded (8 screenshots, 1206×2622)
- Tax/W-9: resubmitted as First Source LLC business entity — pending Google verification

### App Store (iOS)
- Bundle ID: `com.buzznode.betslips`
- Waiting on Apple developer account approval
- Once approved: add iOS RevenueCat config, create IAP product, build and submit

### Google Play Tax Issue
- W-9 was originally submitted as individual (Bradley Warren Duderstadt) but account is First Source, LLC
- Resubmitted as business W-9 for First Source LLC — pending Google verification
- Until resolved: 24% withholding rate applies

## Key Files

- `src/lib/purchases.ts` — RevenueCat init, entitlement check, purchase, restore functions
- `src/components/ProUpgradeModal.tsx` — paywall UI with buy/restore
- `src/lib/outcomes.ts` — bet outcome calculation logic
- `src/lib/betting.ts` — combination calculation logic
- `src/lib/archive.ts` — race day archive logic
- `src/lib/backup.ts` — backup/restore logic
- `src/lib/share.ts` — share slip formatting
