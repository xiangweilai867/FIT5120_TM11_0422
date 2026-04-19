/**
 * Profile Creation Screen
 *
 * Shown when no user profile exists. Collects username, avatar, and age.
 * All data is stored locally — no backend calls.
 */

import React, { useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/fonts';
import { Spacing } from '@/constants/spacing';
import { Radius } from '@/constants/radius';
import { AvatarId, AVATAR_OPTIONS, createUserProfile, getAvatarEmoji } from '@/services/userProfile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AVATAR_ITEM_WIDTH = 120;

// ─── Age Carousel ─────────────────────────────────────────────────────────────

const AGE_MIN = 1;
const AGE_MAX = 99;
const AGES = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => i + AGE_MIN);
const AGE_ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 5;

interface AgeCarouselProps {
  selectedAge: number;
  onAgeChange: (age: number) => void;
}

function AgeCarousel({ selectedAge, onAgeChange }: AgeCarouselProps) {
  const flatListRef = useRef<FlatList>(null);

  const scrollToAge = (age: number) => {
    const index = age - AGE_MIN;
    flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
  };

  const handleScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / AGE_ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, AGES.length - 1));
    const newAge = AGES[clampedIndex];
    onAgeChange(newAge);
  };

  return (
    <View style={ageStyles.container}>
      {/* Selection highlight */}
      <View style={ageStyles.selectionHighlight} pointerEvents="none" />

      <FlatList
        ref={flatListRef}
        data={AGES}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={AGE_ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(_, index) => ({
          length: AGE_ITEM_HEIGHT,
          offset: AGE_ITEM_HEIGHT * index,
          index,
        })}
        initialScrollIndex={selectedAge - AGE_MIN}
        contentContainerStyle={{
          paddingVertical: AGE_ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
        }}
        renderItem={({ item }) => {
          const isSelected = item === selectedAge;
          return (
            <TouchableOpacity
              style={ageStyles.ageItem}
              onPress={() => {
                onAgeChange(item);
                scrollToAge(item);
              }}
              activeOpacity={0.7}
            >
              <Text style={[ageStyles.ageText, isSelected && ageStyles.ageTextSelected]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const ageStyles = StyleSheet.create({
  container: {
    height: AGE_ITEM_HEIGHT * VISIBLE_ITEMS,
    width: 100,
    alignSelf: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  selectionHighlight: {
    position: 'absolute',
    top: AGE_ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
    left: 0,
    right: 0,
    height: AGE_ITEM_HEIGHT,
    backgroundColor: Colors.primary_container,
    borderRadius: Radius.md,
    zIndex: 0,
  },
  ageItem: {
    height: AGE_ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageText: {
    ...Typography.titleLarge,
    color: Colors.on_surface_variant,
  },
  ageTextSelected: {
    color: Colors.primary,
    fontWeight: '900',
  },
});

// ─── Avatar Carousel ──────────────────────────────────────────────────────────

interface AvatarCarouselProps {
  selectedAvatar: AvatarId;
  onAvatarChange: (avatarId: AvatarId) => void;
}

function AvatarCarousel({ selectedAvatar, onAvatarChange }: AvatarCarouselProps) {
  return (
    <View style={avatarStyles.container}>
      {AVATAR_OPTIONS.map((avatarId) => {
        const isSelected = avatarId === selectedAvatar;
        return (
          <TouchableOpacity
            key={avatarId}
            style={[avatarStyles.avatarItem, isSelected && avatarStyles.avatarItemSelected]}
            onPress={() => onAvatarChange(avatarId)}
            activeOpacity={0.8}
          >
            <Text style={avatarStyles.avatarEmoji}>{getAvatarEmoji(avatarId)}</Text>
            <Text style={[avatarStyles.avatarLabel, isSelected && avatarStyles.avatarLabelSelected]}>
              {avatarId.charAt(0).toUpperCase() + avatarId.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  avatarItem: {
    width: AVATAR_ITEM_WIDTH,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.card,
    borderWidth: 2,
    borderColor: Colors.outline_variant,
    backgroundColor: Colors.surface_container_lowest,
  },
  avatarItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary_container,
  },
  avatarEmoji: {
    fontSize: 52,
    marginBottom: Spacing.xs,
  },
  avatarLabel: {
    ...Typography.labelMedium,
    color: Colors.on_surface_variant,
  },
  avatarLabelSelected: {
    color: Colors.on_primary_container,
    fontWeight: '900',
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProfileCreateScreen() {
  const [username, setUsername] = useState('');
  const [avatarId, setAvatarId] = useState<AvatarId>('apple');
  const [age, setAge] = useState(10);
  const [usernameError, setUsernameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [creating, setCreating] = useState(false);

  const validateUsername = (value: string): string => {
    if (!value.trim()) return 'Username is required.';
    if (value.length > 16) return 'Username must be 16 characters or fewer.';
    if (!/^[a-zA-Z0-9]+$/.test(value)) return 'Username must be alphanumeric only.';
    return '';
  };

  const validateAge = (value: number): string => {
    if (!Number.isInteger(value) || value < 1 || value > 99) {
      return 'Age must be between 1 and 99.';
    }
    return '';
  };

  const handleCreate = async () => {
    const uErr = validateUsername(username);
    const aErr = validateAge(age);
    setUsernameError(uErr);
    setAgeError(aErr);

    if (uErr || aErr) return;

    setCreating(true);
    try {
      await createUserProfile(username.trim(), avatarId, age);
      router.replace('/scan');
    } catch {
      Alert.alert('Error', 'Could not create profile. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleSkip = () => {
    router.replace('/scan');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🌟</Text>
          <Text style={styles.title}>Create Your Hero!</Text>
          <Text style={styles.subtitle}>
            Set up your profile to track your progress and earn rewards.
          </Text>
        </View>

        {/* Username */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Hero Name</Text>
          <TextInput
            style={[styles.textInput, usernameError ? styles.textInputError : null]}
            placeholder="Enter your name..."
            placeholderTextColor={Colors.on_surface_variant}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (usernameError) setUsernameError(validateUsername(text));
            }}
            maxLength={16}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {!!usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
          <Text style={styles.hintText}>Max 16 characters, letters and numbers only.</Text>
        </View>

        {/* Avatar */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Choose Your Avatar</Text>
          <AvatarCarousel selectedAvatar={avatarId} onAvatarChange={setAvatarId} />
        </View>

        {/* Age */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your Age</Text>
          <AgeCarousel selectedAge={age} onAgeChange={setAge} />
          {!!ageError && <Text style={styles.errorText}>{ageError}</Text>}
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createButton, creating && styles.createButtonDisabled]}
          onPress={handleCreate}
          activeOpacity={0.85}
          disabled={creating}
        >
          <Text style={styles.createButtonText}>
            {creating ? 'Creating...' : '✨ Create Profile'}
          </Text>
        </TouchableOpacity>

        {/* Skip */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
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
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing['4xl'],
    gap: Spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    ...Typography.displaySmall,
    color: Colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.on_surface_variant,
    textAlign: 'center',
    maxWidth: 280,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    ...Typography.titleMedium,
    color: Colors.on_surface,
  },
  textInput: {
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: Radius.input,
    borderWidth: 1.5,
    borderColor: Colors.outline_variant,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    ...Typography.bodyLarge,
    color: Colors.on_surface,
  },
  textInputError: {
    borderColor: Colors.error,
  },
  errorText: {
    ...Typography.labelSmall,
    color: Colors.error,
  },
  hintText: {
    ...Typography.labelSmall,
    color: Colors.on_surface_variant,
  },
  createButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.button_primary,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    ...Typography.labelLarge,
    color: Colors.on_primary,
    fontSize: 18,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  skipButtonText: {
    ...Typography.bodyMedium,
    color: Colors.on_surface_variant,
    textDecorationLine: 'underline',
  },
});
