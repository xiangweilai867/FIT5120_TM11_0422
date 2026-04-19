/**
 * Profile Page Screen
 *
 * Shows the user's profile information. Allows deleting the profile.
 * If no profile exists, shows a button to create one.
 */

import React, { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/fonts';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/radius';
import {
  UserProfile,
  getUserProfile,
  deleteUserProfile,
  getAvatarEmoji,
} from '@/services/userProfile';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const p = await getUserProfile();
      setProfile(p);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleDeleteProfile = () => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete your profile? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteUserProfile();
            setProfile(null);
            router.replace('/profile-create' as any);
          },
        },
      ]
    );
  };

  const handleCreateProfile = () => {
    router.push('/profile-create');
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>👤</Text>
            <Text style={styles.emptyTitle}>No Profile Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create a profile to track your progress and earn rewards!
            </Text>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateProfile} activeOpacity={0.85}>
              <Text style={styles.createButtonText}>✨ Create Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const avatarEmoji = getAvatarEmoji(profile.avatarId);
  const mealMakerHighScore = profile.highScores['meal-maker'] ?? 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Avatar & Name */}
        <View style={styles.heroSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
          </View>
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.ageLabel}>Age {profile.age}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsSectionTitle}>🏆 Stats</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={styles.statValue}>{profile.totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🍽️</Text>
              <Text style={styles.statValue}>{mealMakerHighScore}</Text>
              <Text style={styles.statLabel}>Meal Maker Best</Text>
            </View>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>👤 Profile Info</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Username</Text>
              <Text style={styles.infoValue}>{profile.username}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Avatar</Text>
              <Text style={styles.infoValue}>
                {avatarEmoji} {profile.avatarId.charAt(0).toUpperCase() + profile.avatarId.slice(1)}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Age</Text>
              <Text style={styles.infoValue}>{profile.age}</Text>
            </View>
          </View>
        </View>

        {/* Delete Profile */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteProfile}
          activeOpacity={0.85}
        >
          <Text style={styles.deleteButtonText}>🗑️ Delete Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.base,
    paddingBottom: Spacing['4xl'],
    gap: Spacing['2xl'],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  backButtonText: {
    ...Typography.bodyLarge,
    color: Colors.primary,
    fontWeight: '700',
  },
  heroSection: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary_container,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarEmoji: {
    fontSize: 64,
  },
  username: {
    ...Typography.headlineLarge,
    color: Colors.on_surface,
    fontWeight: '900',
  },
  ageLabel: {
    ...Typography.bodyLarge,
    color: Colors.on_surface_variant,
  },
  statsSection: {
    gap: Spacing.md,
  },
  statsSectionTitle: {
    ...Typography.titleLarge,
    color: Colors.on_surface,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: Radius.card,
    padding: Spacing.base,
    alignItems: 'center',
    gap: Spacing.xs,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statEmoji: {
    fontSize: 32,
  },
  statValue: {
    ...Typography.headlineMedium,
    color: Colors.primary,
    fontWeight: '900',
  },
  statLabel: {
    ...Typography.labelSmall,
    color: Colors.on_surface_variant,
    textAlign: 'center',
  },
  infoSection: {
    gap: Spacing.md,
  },
  infoSectionTitle: {
    ...Typography.titleLarge,
    color: Colors.on_surface,
  },
  infoCard: {
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: Radius.card,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.outline_variant,
    marginHorizontal: Spacing.base,
  },
  infoKey: {
    ...Typography.bodyMedium,
    color: Colors.on_surface_variant,
  },
  infoValue: {
    ...Typography.bodyMedium,
    color: Colors.on_surface,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: Colors.error_container,
    borderRadius: Radius.button_primary,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  deleteButtonText: {
    ...Typography.labelLarge,
    color: Colors.on_error_container,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingTop: Spacing['4xl'],
  },
  emptyEmoji: {
    fontSize: 80,
  },
  emptyTitle: {
    ...Typography.headlineMedium,
    color: Colors.on_surface,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.bodyMedium,
    color: Colors.on_surface_variant,
    textAlign: 'center',
    maxWidth: 280,
  },
  createButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.button_primary,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing['2xl'],
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  createButtonText: {
    ...Typography.labelLarge,
    color: Colors.on_primary,
    fontSize: 18,
  },
});
