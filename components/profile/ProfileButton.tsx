/**
 * ProfileButton — Round avatar button shown in the app header.
 *
 * Navigates to the profile page when pressed.
 * Shows the avatar button emoji if a profile exists, or a generic user icon.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { getUserProfile, getAvatarButtonEmoji, AvatarId } from '@/services/userProfile';

export default function ProfileButton() {
  const [avatarEmoji, setAvatarEmoji] = useState<string>('👤');

  const loadAvatar = useCallback(async () => {
    const profile = await getUserProfile();
    if (profile) {
      setAvatarEmoji(getAvatarButtonEmoji(profile.avatarId as AvatarId));
    } else {
      setAvatarEmoji('👤');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAvatar();
    }, [loadAvatar])
  );

  const handlePress = () => {
    router.push('/profile');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.8}>
      <Text style={styles.emoji}>{avatarEmoji}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary_container,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  emoji: {
    fontSize: 22,
  },
});
