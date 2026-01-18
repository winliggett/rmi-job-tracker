import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from '../utils/haptics';
import { login as apiLogin } from '../utils/api';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Missing Info', 'Please enter your username and password');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    
    try {
      const response = await apiLogin(username, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onLogin(response.user, response.token);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Sign In Failed', 'Please check your username and password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🏗️</Text>
          </View>
          <Text style={styles.appName}>RMI Construction</Text>
          <Text style={styles.tagline}>Job Tracker</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.instructionText}>Sign in to manage your jobs</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username or email"
              placeholderTextColor={colors.textTertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => {
                  Haptics.selectionAsync();
                  setShowPassword(!showPassword);
                }}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signInButton, loading && styles.signInButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          Secure login for RMI team members
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoIcon: {
    fontSize: 52,
  },
  appName: {
    ...typography.largeTitle,
    color: '#fff',
    textAlign: 'center',
  },
  tagline: {
    ...typography.title3,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
  formCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.large,
  },
  welcomeText: {
    ...typography.title2,
    color: colors.text,
    textAlign: 'center',
  },
  instructionText: {
    ...typography.subhead,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.subhead,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    minHeight: 52,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  passwordInput: {
    flex: 1,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    minHeight: 52,
  },
  showPasswordButton: {
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 52,
    minHeight: 52,
  },
  showPasswordText: {
    fontSize: 24,
  },
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    minHeight: 56,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    ...typography.headline,
    color: '#fff',
    fontWeight: '600',
  },
  footerText: {
    ...typography.footnote,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
