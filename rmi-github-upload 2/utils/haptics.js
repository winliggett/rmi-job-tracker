import { Platform } from 'react-native';

let Haptics = null;

if (Platform.OS !== 'web') {
  Haptics = require('expo-haptics');
}

export const impactAsync = (style) => {
  if (Haptics) {
    return Haptics.impactAsync(style);
  }
  return Promise.resolve();
};

export const notificationAsync = (type) => {
  if (Haptics) {
    return Haptics.notificationAsync(type);
  }
  return Promise.resolve();
};

export const selectionAsync = () => {
  if (Haptics) {
    return Haptics.selectionAsync();
  }
  return Promise.resolve();
};

export const ImpactFeedbackStyle = Haptics?.ImpactFeedbackStyle || {
  Light: 'light',
  Medium: 'medium',
  Heavy: 'heavy',
};

export const NotificationFeedbackType = Haptics?.NotificationFeedbackType || {
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
};

export default {
  impactAsync,
  notificationAsync,
  selectionAsync,
  ImpactFeedbackStyle,
  NotificationFeedbackType,
};
