import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import Fuse from 'fuse.js';
import * as Haptics from '../utils/haptics';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

// Web Speech API (works in Expo web view on modern browsers)
const SpeechRecognition = Platform.OS === 'web' 
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;

export default function VoiceDictation({ onResult, onClose, teamMembers = [], jobs = [] }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [matchSuggestion, setMatchSuggestion] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'web' && SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recog.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (!recognition) {
      Alert.alert(
        'Voice Not Available',
        'Voice dictation is not supported on this device. Please type your note instead.',
        [{ text: 'OK', onPress: onClose }]
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTranscript('');
    setMatchSuggestion(null);
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
    
    if (transcript.trim()) {
      processTranscript(transcript);
    }
  };

  const processTranscript = (text) => {
    setProcessing(true);

    // Fuzzy match for names in the transcript
    const nameMatches = extractAndMatchNames(text);
    
    if (nameMatches.length > 0) {
      const topMatch = nameMatches[0];
      
      if (topMatch.score < 0.3) {
        // High confidence - auto-apply
        const updatedText = replaceNameWithMention(text, topMatch);
        onResult(updatedText);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onClose();
      } else {
        // Low confidence - ask for confirmation
        setMatchSuggestion({
          original: text,
          suggestion: topMatch,
          updated: replaceNameWithMention(text, topMatch),
        });
      }
    } else {
      // No name matches - return as-is
      onResult(text);
      onClose();
    }

    setProcessing(false);
  };

  const extractAndMatchNames = (text) => {
    if (!teamMembers || teamMembers.length === 0) return [];

    // Extract potential names from transcript
    const words = text.toLowerCase().split(' ');
    const potentialNames = words.filter(word => word.length > 2);

    // Fuzzy search configuration
    const fuse = new Fuse(teamMembers, {
      keys: ['name', 'id'],
      threshold: 0.4, // 0 = exact match, 1 = match anything
      distance: 100,
      minMatchCharLength: 3,
    });

    // Find best matches
    const matches = [];
    potentialNames.forEach(name => {
      const results = fuse.search(name);
      if (results.length > 0) {
        matches.push({
          original: name,
          match: results[0].item,
          score: results[0].score,
        });
      }
    });

    // Sort by confidence (lowest score = best match)
    return matches.sort((a, b) => a.score - b.score);
  };

  const replaceNameWithMention = (text, match) => {
    const regex = new RegExp(`\\b${match.original}\\b`, 'gi');
    return text.replace(regex, `@${match.match.id}`);
  };

  const handleAcceptSuggestion = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onResult(matchSuggestion.updated);
    onClose();
  };

  const handleRejectSuggestion = () => {
    Haptics.selectionAsync();
    onResult(matchSuggestion.original);
    onClose();
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>🎤 Voice Dictation</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {matchSuggestion ? (
            // Confirmation Screen
            <View style={styles.confirmationContainer}>
              <Text style={styles.confirmationTitle}>Did you mean?</Text>
              
              <View style={styles.matchCard}>
                <Text style={styles.matchLabel}>I heard:</Text>
                <Text style={styles.matchOriginal}>{matchSuggestion.original}</Text>
                
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>↓</Text>
                </View>
                
                <Text style={styles.matchLabel}>Suggested:</Text>
                <Text style={styles.matchSuggestion}>{matchSuggestion.updated}</Text>
                
                <View style={styles.matchInfo}>
                  <Text style={styles.matchInfoText}>
                    Matched: <Text style={styles.matchName}>{matchSuggestion.suggestion.match.name}</Text>
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAcceptSuggestion}
              >
                <Text style={styles.acceptButtonText}>✓ Yes, Use This</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectButton}
                onPress={handleRejectSuggestion}
              >
                <Text style={styles.rejectButtonText}>Use Original Text</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Recording Screen
            <View style={styles.recordingContainer}>
              {isListening ? (
                <>
                  <View style={styles.pulseContainer}>
                    <View style={[styles.pulse, styles.pulseOuter]} />
                    <View style={[styles.pulse, styles.pulseMiddle]} />
                    <View style={styles.micButton}>
                      <Text style={styles.micIcon}>🎤</Text>
                    </View>
                  </View>

                  <Text style={styles.listeningText}>Listening...</Text>
                  
                  {transcript && (
                    <View style={styles.transcriptContainer}>
                      <Text style={styles.transcriptText}>{transcript}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.stopButton}
                    onPress={stopListening}
                  >
                    <Text style={styles.stopButtonText}>⏸ Stop & Process</Text>
                  </TouchableOpacity>
                </>
              ) : processing ? (
                <>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.processingText}>Processing...</Text>
                </>
              ) : (
                <>
                  <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsTitle}>How to use:</Text>
                    <Text style={styles.instructionText}>
                      1. Tap the microphone to start
                    </Text>
                    <Text style={styles.instructionText}>
                      2. Say: "Tell Joseph to frame bathroom"
                    </Text>
                    <Text style={styles.instructionText}>
                      3. App will auto-convert to "@joseph"
                    </Text>
                    <Text style={styles.instructionText}>
                      4. Tap stop when finished
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={startListening}
                  >
                    <Text style={styles.startButtonIcon}>🎤</Text>
                    <Text style={styles.startButtonText}>Start Recording</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.lg,
    minHeight: 400,
    ...shadows.elevated,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title2,
    color: colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    ...typography.title3,
    color: colors.textSecondary,
  },

  // Recording Screen
  recordingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  pulseContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  pulse: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  pulseOuter: {
    opacity: 0.1,
  },
  pulseMiddle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.2,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  micIcon: {
    fontSize: 48,
  },
  listeningText: {
    ...typography.title2,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  transcriptContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.md,
    minHeight: 60,
    width: '100%',
  },
  transcriptText: {
    ...typography.body,
    color: colors.text,
  },
  processingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  stopButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    minHeight: 56,
    justifyContent: 'center',
  },
  stopButtonText: {
    ...typography.headline,
    color: colors.textInverse,
    fontWeight: '600',
  },

  // Instructions
  instructionsContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
    width: '100%',
  },
  instructionsTitle: {
    ...typography.headline,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  instructionText: {
    ...typography.subhead,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },

  // Start/Cancel Buttons
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.md,
    minHeight: 64,
    justifyContent: 'center',
  },
  startButtonIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  startButtonText: {
    ...typography.headline,
    color: colors.textInverse,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: spacing.md,
  },
  cancelButtonText: {
    ...typography.subhead,
    color: colors.textTertiary,
  },

  // Confirmation Screen
  confirmationContainer: {
    paddingVertical: spacing.lg,
  },
  confirmationTitle: {
    ...typography.title2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  matchCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  matchLabel: {
    ...typography.caption1,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  matchOriginal: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  arrow: {
    fontSize: 24,
    color: colors.primary,
  },
  matchSuggestion: {
    ...typography.bodyLarge,
    color: colors.text,
    fontWeight: '600',
  },
  matchInfo: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  matchInfoText: {
    ...typography.subhead,
    color: colors.textSecondary,
  },
  matchName: {
    fontWeight: '600',
    color: colors.primary,
  },
  acceptButton: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    minHeight: 56,
    justifyContent: 'center',
  },
  acceptButtonText: {
    ...typography.headline,
    color: colors.textInverse,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  rejectButtonText: {
    ...typography.headline,
    color: colors.text,
  },
});
