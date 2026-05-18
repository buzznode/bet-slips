import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

const ENTITLEMENT_ID = 'BetSlips Pro';

// Replace ANDROID_KEY after RevenueCat Google Play connection is verified.
// Replace IOS_KEY after Apple developer account is approved and iOS app is
// added to RevenueCat.
const ANDROID_KEY = 'goog_WKjVJpYiCKGOAPQvkoWuJrCElzQ';
const IOS_KEY = 'appl_NnsFfxZYsvLsRAnJzdcYGVkmyHJ';

export function initPurchases() {
  try {
    const apiKey = Platform.OS === 'android' ? ANDROID_KEY : IOS_KEY;
    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey });
  } catch (e: any) {
    if (!__DEV__) console.error('[RC init]', e?.message ?? e);
  }
}

export async function checkEntitlement(): Promise<boolean> {
  try {
    const info = await Purchases.getCustomerInfo();
    return ENTITLEMENT_ID in info.entitlements.active;
  } catch {
    return false;
  }
}

export async function purchasePro(): Promise<{
  success: boolean;
  userCancelled: boolean;
  error?: string;
}> {
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages[0];
    if (!pkg) {
      return { success: false, userCancelled: false, error: 'Product unavailable. Try again later.' };
    }
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const success = ENTITLEMENT_ID in customerInfo.entitlements.active;
    return { success, userCancelled: false };
  } catch (e: any) {
    if (e?.userCancelled) return { success: false, userCancelled: true };
    const msg = e?.message ?? e?.code ?? String(e);
    return { success: false, userCancelled: false, error: `Purchase failed: ${msg}` };
  }
}

export async function restorePro(): Promise<boolean> {
  try {
    const info = await Purchases.restorePurchases();
    return ENTITLEMENT_ID in info.entitlements.active;
  } catch {
    return false;
  }
}
