import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from '../utils/haptics';
import { useUser } from '../contexts/UserContext';
import { AdminOnly } from '../components/Protected';
import api from '../utils/api';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

const STATUS_CONFIG = {
  estimate: { label: 'Needs Estimate', color: colors.warning, bgColor: colors.statusEstimateBg },
  active: { label: 'In Progress', color: colors.primary, bgColor: colors.statusActiveBg },
  completed: { label: 'Completed', color: colors.success, bgColor: colors.statusCompletedBg },
};

// Memoized Job Card Component for performance
const JobCard = React.memo(({ item, onPress }) => {
  const statusConfig = useMemo(
    () => STATUS_CONFIG[item.status] || STATUS_CONFIG.active,
    [item.status]
  );

  return (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.clientName} numberOfLines={1}>
            {item.client_name}
          </Text>
          {item.urgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>⚠️</Text>
            </View>
          )}
        </View>

        <Text style={styles.addressText} numberOfLines={1}>
          📍 {item.address}
        </Text>

        {item.description && (
          <Text style={styles.descriptionText} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.cardFooter}>
          <View style={[styles.statusPill, { backgroundColor: statusConfig.bgColor }]}>
            <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>

          {item.active_tasks > 0 && (
            <View style={styles.taskBadge}>
              <Text style={styles.taskBadgeText}>{item.active_tasks}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Memoized Filter Button
const FilterButton = React.memo(({ value, label, icon, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.filterChip, isActive && styles.filterChipActive]}
    onPress={onPress}
  >
    {icon && <Text style={styles.filterIcon}>{icon}</Text>}
    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
));

export default function DashboardScreen({ navigation }) {
  const { user, token, isAdmin, isTrade } = useUser();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!token) return;

    try {
      const filters = {};
      if (filter !== 'all' && filter !== 'urgent') {
        filters.status = filter;
      }
      if (filter === 'urgent') {
        filters.urgent = 'true';
      }

      const jobsData = await api.getJobs(token, filters);
      setJobs(jobsData || []);

      const statsData = await api.getDashboardStats(token);
      if (isAdmin()) {
        setStats(statsData);
      } else {
        setMyTasks(statsData.myTasks || []);
      }
    } catch (error) {
      console.error('Load error:', error);
      Alert.alert('Unable to Load', 'Please pull down to refresh');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, filter, isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleCardPress = useCallback((item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('JobDetails', { jobId: item.id, onRefresh: loadData });
  }, [navigation, loadData]);

  const handleFilterChange = useCallback((newFilter) => {
    Haptics.selectionAsync();
    setFilter(newFilter);
  }, []);

  const handleCreateJob = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('CreateJob', { onRefresh: loadData });
  }, [navigation, loadData]);

  const renderStatCard = useCallback((value, label, colorKey) => {
    const bgColors = {
      estimate: colors.statusEstimateBg,
      active: colors.statusActiveBg,
      urgent: colors.urgentBg,
      tasks: colors.backgroundTertiary,
    };
    return (
      <View style={[styles.statCard, { backgroundColor: bgColors[colorKey] }]}>
        <Text style={styles.statNumber}>{value || 0}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    );
  }, []);

  const renderJobCard = useCallback(({ item }) => (
    <JobCard item={item} onPress={handleCardPress} />
  ), [handleCardPress]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🏗️</Text>
          <Text style={styles.appTitle}>RMI Job Tracker</Text>
        </View>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </SafeAreaView>
    );
  }

  const numColumns = isAdmin() ? 2 : 1;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.headerLogoEmoji}>🏗️</Text>
          </View>
          <View>
            <Text style={styles.appName}>RMI Job Tracker</Text>
            <Text style={styles.greeting}>
              {isAdmin() ? `Hello, ${user?.name || 'Admin'}` : `Hello, ${user?.name || 'there'}`}
            </Text>
          </View>
        </View>
      </View>

      {isAdmin() && stats?.jobs && (
        <View style={styles.statsContainer}>
          {renderStatCard(stats.jobs.needs_estimate, 'Estimates', 'estimate')}
          {renderStatCard(stats.jobs.active_jobs, 'Active', 'active')}
          {renderStatCard(stats.jobs.urgent_jobs, 'Urgent', 'urgent')}
          {renderStatCard(stats.tasks?.pending_tasks, 'Tasks', 'tasks')}
        </View>
      )}

      {isTrade() && myTasks.length > 0 && (
        <View style={styles.myTasksContainer}>
          <Text style={styles.sectionTitle}>My Tasks</Text>
          {myTasks.slice(0, 3).map(task => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskCheckbox}>
                <View style={styles.checkboxInner} />
              </View>
              <View style={styles.taskContent}>
                <Text style={styles.taskText} numberOfLines={2}>{task.description}</Text>
                <Text style={styles.taskMeta}>{task.client_name} • {task.address}</Text>
              </View>
            </View>
          ))}
          {myTasks.length > 3 && (
            <Text style={styles.moreTasksText}>
              +{myTasks.length - 3} more tasks
            </Text>
          )}
        </View>
      )}

      <View style={styles.filterContainer}>
        <FilterButton
          value="all"
          label="All"
          isActive={filter === 'all'}
          onPress={() => handleFilterChange('all')}
        />
        <FilterButton
          value="urgent"
          label="Urgent"
          icon="⚡"
          isActive={filter === 'urgent'}
          onPress={() => handleFilterChange('urgent')}
        />
        <FilterButton
          value="active"
          label="Active"
          isActive={filter === 'active'}
          onPress={() => handleFilterChange('active')}
        />
        <FilterButton
          value="estimate"
          label="Estimate"
          isActive={filter === 'estimate'}
          onPress={() => handleFilterChange('estimate')}
        />
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Jobs Found</Text>
            <Text style={styles.emptySubtitle}>
              {isTrade()
                ? 'No jobs assigned to you yet'
                : 'Tap + below to create your first job'}
            </Text>
          </View>
        }
      />

      <AdminOnly>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreateJob}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </AdminOnly>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.md * 3) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  appTitle: {
    ...typography.title1,
    color: colors.text,
    fontWeight: '700',
  },
  loadingText: {
    marginTop: spacing.md,
    ...typography.body,
    color: colors.textTertiary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerLogoEmoji: {
    fontSize: 24,
  },
  appName: {
    ...typography.headline,
    color: colors.text,
    fontWeight: '700',
  },
  greeting: {
    ...typography.subhead,
    color: colors.textTertiary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.title1,
    color: colors.text,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.caption1,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  myTasksContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sectionTitle: {
    ...typography.title3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    ...typography.body,
    color: colors.text,
  },
  taskMeta: {
    ...typography.footnote,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  moreTasksText: {
    ...typography.footnote,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundTertiary,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  filterChipText: {
    ...typography.subhead,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  jobCard: {
    width: cardWidth,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.small,
    overflow: 'hidden',
  },
  cardContent: {
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  clientName: {
    ...typography.headline,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
    fontWeight: '600',
  },
  urgentBadge: {
    backgroundColor: colors.urgentBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.urgentBorder,
  },
  urgentText: {
    fontSize: 16,
  },
  addressText: {
    ...typography.subhead,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    ...typography.subhead,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  statusText: {
    ...typography.caption1Bold,
  },
  taskBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  taskBadgeText: {
    ...typography.caption1Bold,
    color: colors.textInverse,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
    opacity: 0.4,
  },
  emptyTitle: {
    ...typography.title2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  fabIcon: {
    fontSize: 36,
    color: colors.textInverse,
    fontWeight: '300',
    marginTop: -4,
  },
});
