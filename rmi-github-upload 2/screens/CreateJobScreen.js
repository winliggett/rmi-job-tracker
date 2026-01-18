import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
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
import { useUser } from '../contexts/UserContext';
import { createJob } from '../utils/api';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

export default function CreateJobScreen({ navigation, route }) {
  const { user, token, isAdmin } = useUser();
  const { onRefresh } = route.params || {};

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [doorCode, setDoorCode] = useState('');
  const [lockboxKey, setLockboxKey] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAdmin()) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.accessDenied}>
          <Text style={styles.accessDeniedIcon}>🚫</Text>
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            Only administrators can create new jobs
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCreate = async () => {
    if (!clientName.trim()) {
      Alert.alert('Missing Info', 'Please enter the client name');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Missing Info', 'Please enter the job address');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    
    try {
      await createJob(token, {
        client_name: clientName,
        phone,
        address,
        door_code: doorCode,
        lockbox_key: lockboxKey,
        description,
        notes,
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Job Created',
        `New job for ${clientName} has been created.`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (onRefresh) onRefresh();
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Client Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Client Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter client name"
                placeholderTextColor={colors.textTertiary}
                value={clientName}
                onChangeText={setClientName}
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor={colors.textTertiary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter job address"
                placeholderTextColor={colors.textTertiary}
                value={address}
                onChangeText={setAddress}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Access Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Door Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter door code"
                placeholderTextColor={colors.textTertiary}
                value={doorCode}
                onChangeText={setDoorCode}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Lockbox Key</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter lockbox key"
                placeholderTextColor={colors.textTertiary}
                value={lockboxKey}
                onChangeText={setLockboxKey}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Job Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the scope of work"
                placeholderTextColor={colors.textTertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Initial Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any initial notes"
                placeholderTextColor={colors.textTertiary}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.createButtonText}>Create Job</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  cardTitle: {
    ...typography.headline,
    color: colors.text,
    marginBottom: spacing.md,
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
  required: {
    color: colors.danger,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    minHeight: 48,
  },
  textArea: {
    minHeight: 80,
    paddingTop: spacing.md,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 56,
    ...shadows.medium,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    ...typography.headline,
    color: '#fff',
    fontWeight: '600',
  },
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  accessDeniedIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  accessDeniedTitle: {
    ...typography.title2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  accessDeniedText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    ...typography.headline,
    color: '#fff',
  },
});
