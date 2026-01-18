import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from '../utils/haptics';
import { useUser, ROLES } from '../contexts/UserContext';
import api from '../utils/api';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

const ALL_ROLES = [
  { value: null, label: 'Real Role', icon: '👤' },
  { value: ROLES.ADMIN, label: 'Admin', icon: '👑' },
  { value: ROLES.TRADE_PAINTER, label: 'Painter', icon: '🎨' },
  { value: ROLES.TRADE_PLUMBER, label: 'Plumber', icon: '🔧' },
  { value: ROLES.TRADE_ELECTRICIAN, label: 'Electrician', icon: '⚡' },
  { value: ROLES.TRADE_HVAC, label: 'HVAC', icon: '❄️' },
  { value: ROLES.TRADE_FLOORING, label: 'Flooring', icon: '🪵' },
  { value: ROLES.TRADE_CABINETS, label: 'Cabinets', icon: '🗄️' },
];

export default function SettingsScreen({ navigation }) {
  const { user, token, mockRole, setTestRole, getEffectiveRole, isAdmin, logout } = useUser();
  
  const [plivoAuthId, setPlivoAuthId] = useState('');
  const [plivoAuthToken, setPlivoAuthToken] = useState('');
  const [plivoPhone, setPlivoPhone] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (isAdmin() && token) {
      loadSettings();
    }
  }, [token]);

  const loadSettings = async () => {
    try {
      const settings = await api.getSettings(token);
      setPlivoAuthId(settings.plivo_auth_id || '');
      setPlivoAuthToken(settings.plivo_auth_token || '');
      setPlivoPhone(settings.plivo_phone_number || '');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSetting = async (key, value) => {
    try {
      setSaving(true);
      await api.updateSetting(token, key, value);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Failed to save setting');
    } finally {
      setSaving(false);
    }
  };

  const handleTestSMS = async () => {
    if (!testPhone) {
      Alert.alert('Missing Info', 'Enter a phone number to test');
      return;
    }
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTesting(true);
      await api.testSMS(token, testPhone);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Test SMS sent!');
    } catch (error) {
      Alert.alert('SMS Failed', 'Check your Plivo settings and try again');
    } finally {
      setTesting(false);
    }
  };

  const handleRoleSelect = (role) => {
    Haptics.selectionAsync();
    setTestRole(role);
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const getRoleDisplay = (role) => {
    if (!role) return 'Not set';
    if (role === 'admin') return 'Administrator';
    if (role.startsWith('trade-')) {
      const trade = role.replace('trade-', '');
      return trade.charAt(0).toUpperCase() + trade.slice(1);
    }
    return role;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'Unknown'}</Text>
                <Text style={styles.profileRole}>{getRoleDisplay(getEffectiveRole())}</Text>
              </View>
            </View>
            
            {mockRole && (
              <View style={styles.mockBanner}>
                <Text style={styles.mockText}>Testing as {getRoleDisplay(mockRole)}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Different Roles</Text>
          <Text style={styles.sectionSubtitle}>
            Preview the app as different user types
          </Text>
          
          <View style={styles.roleGrid}>
            {ALL_ROLES.map((role) => {
              const isActive = mockRole === role.value || (!mockRole && role.value === null);
              return (
                <TouchableOpacity
                  key={role.value || 'real'}
                  style={[styles.roleChip, isActive && styles.roleChipActive]}
                  onPress={() => handleRoleSelect(role.value)}
                >
                  <Text style={styles.roleIcon}>{role.icon}</Text>
                  <Text style={[styles.roleLabel, isActive && styles.roleLabelActive]}>
                    {role.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {isAdmin() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SMS Notifications</Text>
            <Text style={styles.sectionSubtitle}>
              Configure Plivo for trade notifications
            </Text>
            
            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Auth ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Plivo Auth ID"
                  placeholderTextColor={colors.textTertiary}
                  value={plivoAuthId}
                  onChangeText={setPlivoAuthId}
                  onBlur={() => saveSetting('plivo_auth_id', plivoAuthId)}
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Auth Token</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Plivo Auth Token"
                  placeholderTextColor={colors.textTertiary}
                  value={plivoAuthToken}
                  onChangeText={setPlivoAuthToken}
                  onBlur={() => saveSetting('plivo_auth_token', plivoAuthToken)}
                  secureTextEntry
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+1234567890"
                  placeholderTextColor={colors.textTertiary}
                  value={plivoPhone}
                  onChangeText={setPlivoPhone}
                  onBlur={() => saveSetting('plivo_phone_number', plivoPhone)}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Test Phone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone to test SMS"
                  placeholderTextColor={colors.textTertiary}
                  value={testPhone}
                  onChangeText={setTestPhone}
                  keyboardType="phone-pad"
                />
              </View>
              
              <TouchableOpacity
                style={[styles.testButton, testing && styles.testButtonDisabled]}
                onPress={handleTestSMS}
                disabled={testing}
              >
                {testing ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.testButtonText}>Send Test SMS</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.title3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.subhead,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.title2,
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.headline,
    color: colors.text,
  },
  profileRole: {
    ...typography.subhead,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mockBanner: {
    backgroundColor: '#FFF3E0',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginTop: spacing.md,
  },
  mockText: {
    ...typography.footnote,
    color: '#E65100',
    textAlign: 'center',
    fontWeight: '500',
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  roleChipActive: {
    backgroundColor: '#E3F2FD',
    borderColor: colors.primary,
  },
  roleIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  roleLabel: {
    ...typography.subhead,
    color: colors.textSecondary,
  },
  roleLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.subhead,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  testButton: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  testButtonDisabled: {
    opacity: 0.6,
  },
  testButtonText: {
    ...typography.headline,
    color: colors.primary,
  },
  logoutButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    ...typography.headline,
    color: colors.danger,
  },
});
