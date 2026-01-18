import { Platform } from 'react-native';

// PROFESSIONAL CONSTRUCTION THEME - Muted, High Contrast, Premium Feel
// Navy primary #1C3B59, slate grays, charcoal backgrounds, SF Pro typography

export const colors = {
  // Primary - Professional navy blue (construction industry standard)
  primary: '#1C3B59',        // Deep navy - trustworthy, professional
  primaryLight: '#2C4B69',   // Lighter navy for hover states
  primaryDark: '#0C2B49',    // Darker navy for pressed states
  
  // Accent - Muted orange for CTAs (construction orange without brightness)
  accent: '#D97742',         // Muted construction orange
  accentLight: '#E98752',    // Lighter for backgrounds
  
  // Status colors - Muted professional palette
  success: '#2E7D52',        // Forest green (not bright lime)
  warning: '#C27843',        // Muted amber (not neon yellow)
  danger: '#B83A3A',         // Deep red (not bright red)
  info: '#3B5C7D',           // Slate blue
  
  // Backgrounds - Clean slate tones
  background: '#F5F6F8',           // Very light gray (almost white but warmer)
  backgroundSecondary: '#FFFFFF',  // Pure white for cards
  backgroundTertiary: '#E8EAED',   // Medium gray for dividers
  backgroundElevated: '#FAFBFC',   // Slightly elevated white
  
  // Text - High contrast charcoal (easier to read than pure black)
  text: '#1A1D23',              // Charcoal (almost black)
  textSecondary: '#4A5160',     // Medium gray
  textTertiary: '#6B7280',      // Light gray
  textDisabled: '#9CA3AF',      // Very light gray
  textInverse: '#FFFFFF',       // White for dark backgrounds
  
  // Borders - Subtle slate tones
  border: '#D1D5DB',         // Medium border
  borderLight: '#E5E7EB',    // Light border
  borderDark: '#9CA3AF',     // Dark border for emphasis
  
  // Status-specific backgrounds (muted, professional)
  statusEstimateBg: '#FEF3E7',    // Warm cream
  statusEstimateText: '#8B5A2B',   // Warm brown
  
  statusActiveBg: '#E8F0F7',       // Cool slate blue
  statusActiveText: '#1C3B59',     // Navy
  
  statusCompletedBg: '#E8F5EC',    // Soft sage green
  statusCompletedText: '#2E7D52',  // Forest green
  
  statusOnHoldBg: '#F3F4F6',       // Neutral gray
  statusOnHoldText: '#6B7280',     // Medium gray
  
  // Urgent/alert colors (professional red, not alarming)
  urgentBg: '#FEECEC',       // Very soft red
  urgentText: '#B83A3A',     // Deep red
  urgentBorder: '#E5B3B3',   // Muted red border
  
  // Overlay and shadow colors
  overlay: 'rgba(26, 29, 35, 0.4)',      // Dark overlay for modals
  cardShadow: 'rgba(0, 0, 0, 0.06)',     // Subtle card shadow
  elevatedShadow: 'rgba(0, 0, 0, 0.12)', // Elevated element shadow
};

// Dark mode colors (for future implementation)
export const darkColors = {
  primary: '#3B5C7D',
  primaryLight: '#4B6C8D',
  primaryDark: '#2B4C6D',
  
  accent: '#E98752',
  accentLight: '#F99762',
  
  success: '#3E8D62',
  warning: '#D28853',
  danger: '#C84A4A',
  info: '#4B6C8D',
  
  background: '#0F1419',
  backgroundSecondary: '#1A1D23',
  backgroundTertiary: '#252830',
  backgroundElevated: '#2A2D35',
  
  text: '#F5F6F8',
  textSecondary: '#C1C7CD',
  textTertiary: '#8B92A0',
  textDisabled: '#5A5F6A',
  textInverse: '#0F1419',
  
  border: '#3A3F4A',
  borderLight: '#2A2F3A',
  borderDark: '#4A4F5A',
  
  statusEstimateBg: '#2B2419',
  statusEstimateText: '#D2A775',
  
  statusActiveBg: '#1A2530',
  statusActiveText: '#7BA3C9',
  
  statusCompletedBg: '#1A2B22',
  statusCompletedText: '#6EAD87',
  
  statusOnHoldBg: '#252830',
  statusOnHoldText: '#8B92A0',
  
  urgentBg: '#2B1919',
  urgentText: '#E57373',
  urgentBorder: '#4A2A2A',
  
  overlay: 'rgba(0, 0, 0, 0.7)',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  elevatedShadow: 'rgba(0, 0, 0, 0.5)',
};

// Typography - SF Pro optimized for construction industry (clarity, readability)
export const typography = {
  // Large titles - For screen headers
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 41,
  },
  
  // Titles - For section headers
  title1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.35,
    lineHeight: 34,
  },
  title2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.26,
    lineHeight: 28,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.24,
    lineHeight: 25,
  },
  
  // Headlines - For card titles, important labels
  headline: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.43,
    lineHeight: 22,
  },
  headlineLarge: {
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: -0.45,
    lineHeight: 24,
  },
  
  // Body text - For content, descriptions
  body: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.41,
    lineHeight: 22,
  },
  bodyLarge: {
    fontSize: 19,
    fontWeight: '400',
    letterSpacing: -0.43,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    lineHeight: 22,
  },
  
  // Callout - For emphasized content
  callout: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.32,
    lineHeight: 21,
  },
  calloutBold: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.32,
    lineHeight: 21,
  },
  
  // Subhead - For secondary information
  subhead: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.24,
    lineHeight: 20,
  },
  subheadBold: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.24,
    lineHeight: 20,
  },
  
  // Footnote - For tertiary information
  footnote: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.08,
    lineHeight: 18,
  },
  footnoteBold: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.08,
    lineHeight: 18,
  },
  
  // Caption - For labels, timestamps
  caption1: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 16,
  },
  caption1Bold: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 16,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0.06,
    lineHeight: 13,
  },
  caption2Bold: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.06,
    lineHeight: 13,
  },
};

// Spacing - 8pt grid system for consistency
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius - Continuous rounded corners (professional, not playful)
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Shadows - Subtle depth without iOS-style gloss
export const shadows = Platform.select({
  web: {
    none: {
      boxShadow: 'none',
    },
    small: {
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
    },
    medium: {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    large: {
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.06)',
    },
    elevated: {
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.06)',
    },
  },
  default: {
    none: {
      shadowOpacity: 0,
      elevation: 0,
    },
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 8,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 25,
      elevation: 12,
    },
  },
});

// Touch targets - Accessibility and usability (construction workers often wear gloves)
export const touchTargets = {
  minimum: 44,      // iOS minimum
  comfortable: 48,  // Android material minimum
  large: 56,        // Large buttons for primary actions
  xlarge: 64,       // Extra large for critical actions
};

// Status helper functions
export const getStatusColor = (status) => {
  switch (status) {
    case 'estimate':
    case 'needs_estimate':
      return colors.warning;
    case 'active':
    case 'in_progress':
      return colors.primary;
    case 'completed':
      return colors.success;
    case 'on_hold':
      return colors.textTertiary;
    default:
      return colors.textTertiary;
  }
};

export const getStatusBgColor = (status) => {
  switch (status) {
    case 'estimate':
    case 'needs_estimate':
      return colors.statusEstimateBg;
    case 'active':
    case 'in_progress':
      return colors.statusActiveBg;
    case 'completed':
      return colors.statusCompletedBg;
    case 'on_hold':
      return colors.statusOnHoldBg;
    default:
      return colors.backgroundTertiary;
  }
};

export const getStatusTextColor = (status) => {
  switch (status) {
    case 'estimate':
    case 'needs_estimate':
      return colors.statusEstimateText;
    case 'active':
    case 'in_progress':
      return colors.statusActiveText;
    case 'completed':
      return colors.statusCompletedText;
    case 'on_hold':
      return colors.statusOnHoldText;
    default:
      return colors.textSecondary;
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'estimate':
    case 'needs_estimate':
      return 'Needs Estimate';
    case 'active':
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'on_hold':
      return 'On Hold';
    default:
      return status;
  }
};

// Common reusable styles
export const commonStyles = {
  // Card styles
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },
  cardElevated: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.medium,
  },
  cardLarge: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.medium,
  },
  
  // Section styles
  sectionTitle: {
    ...typography.title3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    ...typography.headline,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  
  // Empty state styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: spacing.md,
    opacity: 0.4,
  },
  emptyTitle: {
    ...typography.title3,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
    maxWidth: 280,
  },
  
  // Input styles
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    minHeight: touchTargets.comfortable,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundSecondary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  
  // Button styles - Professional, high contrast
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: touchTargets.large,
    ...shadows.small,
  },
  primaryButtonText: {
    ...typography.headline,
    color: colors.textInverse,
    fontWeight: '600',
  },
  
  secondaryButton: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: touchTargets.large,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    ...typography.headline,
    color: colors.primary,
    fontWeight: '600',
  },
  
  tertiaryButton: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: touchTargets.large,
  },
  tertiaryButtonText: {
    ...typography.headline,
    color: colors.text,
    fontWeight: '600',
  },
  
  // Danger button (for destructive actions)
  dangerButton: {
    backgroundColor: colors.danger,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: touchTargets.large,
  },
  dangerButtonText: {
    ...typography.headline,
    color: colors.textInverse,
    fontWeight: '600',
  },
  
  // Badge/pill styles
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...typography.caption1Bold,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  dividerThick: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
};

export default {
  colors,
  darkColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  touchTargets,
  getStatusColor,
  getStatusBgColor,
  getStatusTextColor,
  getStatusLabel,
  commonStyles,
};
