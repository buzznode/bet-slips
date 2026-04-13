# Bet Slips — Subscription Plan

## Pricing

| Tier | Price |
|------|-------|
| Free | $0 — forever |
| Pro  | $19.99 / year |

---

## Feature Split

### Free (always available)

- 1 track, 1 bettor
- All bet types & modifiers
- Full combination math
- Race management & scratches
- Results & outcome detection
- Payout entry
- Budget tracker
- Notes on bets
- Day summary

### Pro ($19.99/yr)

- **Multi-track, multi-bettor** — unlimited tracks and bettors per session
- **Templates** — save and reuse bet configurations
- **Bet slip sharing** — share a formatted slip with others
- **Data backup & restore** — export/import full session data
- **Race day archive** — access historical race days
- **Auto-sync payout across bettors** — entering a payout propagates to all bettors on the same bet
- **Bettor & track quick views** — summary dashboards per bettor or track

---

## Implementation Notes

### Paywall library
**RevenueCat** — handles App Store / Google Play subscription billing, receipt validation, and entitlements for Expo/React Native.

### Entitlement gate points
- Creating a 2nd track → Pro gate
- Creating a 2nd bettor → Pro gate
- Accessing Templates → Pro gate
- Accessing Archive → Pro gate
- Triggering Share → Pro gate
- Triggering Backup/Restore → Pro gate

### Free tier limits
- Hard cap at 1 track and 1 bettor (not a soft warning — block creation)
- All other free features are fully unlocked with no degraded experience

### Upgrade flow
- Gate triggers show a paywall modal (RevenueCat Paywalls or custom)
- Annual plan only — no monthly option to keep pricing simple
- Free trial TBD (Apple allows up to 1 year introductory offer)
