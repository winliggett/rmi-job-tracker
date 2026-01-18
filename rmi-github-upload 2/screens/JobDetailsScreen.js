import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from '../utils/haptics';
import { useUser } from '../contexts/UserContext';
import api from '../utils/api';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';
import VoiceDictation from '../components/VoiceDictation';

export default function JobDetailsScreen({ route, navigation }) {
  const { jobId, onRefresh } = route.params || {};
  const { user, token, isAdmin } = useUser();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  const loadJob = useCallback(async () => {
    if (!token || !jobId) return;
    
    try {
      const data = await api.getJobDetails(token, jobId);
      setJob(data);
    } catch (error) {
      console.error('Load job error:', error);
      Alert.alert('Error', 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  }, [token, jobId]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      Alert.alert('Empty Note', 'Please enter a note before submitting');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitting(true);

    try {
      await api.addNote(token, jobId, noteText);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setNoteText('');
      await loadJob();
      if (onRefresh) onRefresh();
    } catch (error) {
      Alert.alert('Error', 'Failed to add note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoiceResult = (text) => {
    setNoteText(text);
    setShowVoice(false);
  };

  const handleToggleTask = async (taskId) => {
    if (!isAdmin()) {
      Alert.alert('Permission Denied', 'Only admin can mark tasks complete');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await api.toggleTask(token, taskId);
      await loadJob();
      if (onRefresh) onRefresh();
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      await uploadPhoto(result.assets[0].uri);
    }
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Photo library access is needed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      await uploadPhoto(result.assets[0].uri);
    }
  };

  const uploadPhoto = async (uri) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('photo', {
        uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      await fetch(`${api.BASE_URL}/api/jobs/${jobId}/photos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await loadJob();
    } catch (error) {
      Alert.alert('Error', 'Failed to upload photo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCall = () => {
    if (job?.phone) {
      Linking.openURL(`tel:${job.phone}`);
    }
  };

  const handleNavigate = () => {
    if (job?.address) {
      const query = encodeURIComponent(job.address);
      Linking.openURL(`https://maps.google.com/?q=${query}`);
    }
  };

  // Group tasks by assignee
  const tasksByPerson = useMemo(() => {
    if (!job?.tasks) return {};
    
    return job.tasks.reduce((acc, task) => {
      const assignee = task.assignee_name || 'Unassigned';
      if (!acc[assignee]) {
        acc[assignee] = [];
      }
      acc[assignee].push(task);
      return acc;
    }, {});
  }, [job?.tasks]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading job...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>Job not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* JOB INFO CARD */}
          <View style={styles.jobCard}>
            <View style={styles.cardHeader}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoEmoji}>🏗️</Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.appName}>RMI Job Tracker</Text>
                <Text style={styles.statusBadge}>{job.status || 'Active'}</Text>
              </View>
            </View>

            <Text style={styles.clientName}>{job.client_name}</Text>

            <TouchableOpacity style={styles.infoRow} onPress={handleNavigate}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText}>{job.address}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
              <Text style={styles.infoIcon}>📱</Text>
              <Text style={[styles.infoText, styles.linkText]}>{job.phone}</Text>
            </TouchableOpacity>

            {/* DOOR CODE - HUGE & PROMINENT */}
            <View style={styles.doorCodeCard}>
              <Text style={styles.doorCodeLabel}>Door Code / Key Location:</Text>
              <Text style={styles.doorCodeText}>
                {job.door_code || job.lockbox_key || 'Not specified'}
              </Text>
            </View>
          </View>

          {/* TASKS BY PERSON */}
          {Object.keys(tasksByPerson).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 Tasks</Text>
              {Object.entries(tasksByPerson).map(([person, tasks]) => (
                <View key={person} style={styles.personGroup}>
                  <Text style={styles.personName}>{person}</Text>
                  {tasks.map((task) => (
                    <TouchableOpacity
                      key={task.id}
                      style={styles.taskItem}
                      onPress={() => handleToggleTask(task.id)}
                      disabled={!isAdmin()}
                    >
                      <View style={[
                        styles.checkbox,
                        task.completed && styles.checkboxCompleted
                      ]}>
                        {task.completed && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <View style={styles.taskContent}>
                        <Text style={[
                          styles.taskText,
                          task.completed && styles.taskTextCompleted
                        ]}>
                          {task.description}
                        </Text>
                        {task.completed && task.completed_at && (
                          <Text style={styles.completedDate}>
                            ✅ Done {new Date(task.completed_at).toLocaleDateString()}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* NOTES / ACTIVITY */}
          {job.notes && job.notes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💬 Notes & Activity</Text>
              {job.notes.map((note) => (
                <View key={note.id} style={styles.noteItem}>
                  <View style={styles.noteHeader}>
                    <Text style={styles.noteAuthor}>{note.author_name}</Text>
                    <Text style={styles.noteDate}>
                      {new Date(note.timestamp).toLocaleString()}
                    </Text>
                  </View>
                  <Text style={styles.noteText}>{note.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* PHOTOS */}
          {job.photos && job.photos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📷 Photos</Text>
              <View style={styles.photoGrid}>
                {job.photos.map((photo) => (
                  <Image
                    key={photo.id}
                    source={{ uri: `${api.BASE_URL}${photo.path}` }}
                    style={styles.photoThumb}
                  />
                ))}
              </View>
            </View>
          )}

          {/* ADD NOTE SECTION */}
          <View style={styles.addNoteSection}>
            <Text style={styles.sectionTitle}>✏️ Add Note</Text>
            
            <TextInput
              style={styles.noteInput}
              placeholder="Type note or use @joseph to assign task..."
              placeholderTextColor={colors.textTertiary}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.secondaryButton, { flex: 1, marginRight: spacing.sm }]}
                onPress={() => setShowVoice(true)}
              >
                <Text style={styles.secondaryButtonText}>🎤 Voice</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { flex: 1, marginRight: spacing.sm }]}
                onPress={handleTakePhoto}
              >
                <Text style={styles.secondaryButtonText}>📷 Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { flex: 1 }]}
                onPress={handlePickPhoto}
              >
                <Text style={styles.secondaryButtonText}>🖼️ Gallery</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.addButton, (submitting || !noteText.trim()) && styles.addButtonDisabled]}
              onPress={handleAddNote}
              disabled={submitting || !noteText.trim()}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={colors.textInverse} />
              ) : (
                <Text style={styles.addButtonText}>Add Note</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* VOICE DICTATION MODAL */}
      {showVoice && (
        <VoiceDictation
          onResult={handleVoiceResult}
          onClose={() => setShowVoice(false)}
          teamMembers={job.team_members || []}
          jobs={[job]}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    color: colors.textTertiary,
    marginTop: spacing.md,
  },
  emptyText: {
    ...typography.headline,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  
  // Job Info Card
  jobCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  logoEmoji: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
  },
  appName: {
    ...typography.headline,
    color: colors.textInverse,
    fontWeight: '600',
  },
  statusBadge: {
    ...typography.caption1,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
    textTransform: 'capitalize',
  },
  clientName: {
    ...typography.title1,
    color: colors.textInverse,
    marginBottom: spacing.md,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.textInverse,
    flex: 1,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  doorCodeCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  doorCodeLabel: {
    ...typography.subhead,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.xs,
  },
  doorCodeText: {
    ...typography.largeTitle,
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 32,
  },

  // Sections
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.title3,
    color: colors.text,
    marginBottom: spacing.md,
  },

  // Tasks
  personGroup: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  personName: {
    ...typography.headline,
    color: colors.primary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: '700',
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    ...typography.body,
    color: colors.text,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
    opacity: 0.6,
  },
  completedDate: {
    ...typography.footnote,
    color: colors.success,
    marginTop: spacing.xs,
  },

  // Notes
  noteItem: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  noteAuthor: {
    ...typography.subheadBold,
    color: colors.text,
  },
  noteDate: {
    ...typography.caption1,
    color: colors.textTertiary,
  },
  noteText: {
    ...typography.body,
    color: colors.textSecondary,
  },

  // Photos
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoThumb: {
    width: (100 - spacing.md * 4) / 3,
    height: 100,
    borderRadius: borderRadius.sm,
  },

  // Add Note
  addNoteSection: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },
  noteInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    minHeight: 100,
    marginBottom: spacing.md,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    ...typography.subheadBold,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
    ...shadows.small,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    ...typography.headline,
    color: colors.textInverse,
    fontWeight: '600',
  },
});
