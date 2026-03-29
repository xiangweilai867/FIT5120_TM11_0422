/**
 * Story Viewer Screen
 * Displays story pages with images and audio playback
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Radius } from '../../constants/Radius';
import { Spacing } from '../../constants/Spacing';
import {
  getStories,
  getStoryPageImageUrl,
  getStoryPageAudioUrl,
  getAuthHeaders,
  Story,
  ApiError,
} from '../../services/stories';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function StoryViewerScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [authHeaders, setAuthHeaders] = useState<{ Authorization: string } | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadStory();
    loadAuthHeaders();
    setupAudio();

    return () => {
      // Cleanup audio on unmount
      cleanupAudio();
    };
  }, []);

  useEffect(() => {
    // Stop audio when navigating away
    return () => {
      cleanupAudio();
    };
  }, [router]);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (err) {
      console.error('Failed to setup audio:', err);
    }
  };

  const cleanupAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(false);
    } catch (err) {
      console.error('Failed to cleanup audio:', err);
    }
  };

  const loadAuthHeaders = async () => {
    try {
      const headers = await getAuthHeaders();
      setAuthHeaders(headers);
    } catch (err) {
      console.error('Failed to load auth headers:', err);
    }
  };

  const loadStory = async () => {
    try {
      setLoading(true);
      setError(null);
      const stories = await getStories();
      const foundStory = stories.find(s => s.id === storyId);
      
      if (!foundStory) {
        setError('Story not found');
      } else {
        setStory(foundStory);
      }
    } catch (err) {
      console.error('Failed to load story:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load story. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (pageNumber: number) => {
    try {
      // Stop any currently playing audio
      await cleanupAudio();

      const audioUrl = getStoryPageAudioUrl(storyId, pageNumber);
      
      // Create and load the sound
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: audioUrl,
          headers: authHeaders || undefined,
        },
        { shouldPlay: true }
      );

      soundRef.current = sound;
      setIsPlaying(true);
      setCurrentPage(pageNumber);

      // Set up callback for when audio finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          handleAudioFinished(pageNumber);
        }
      });
    } catch (err) {
      console.error('Failed to play audio:', err);
      setIsPlaying(false);
    }
  };

  const handleAudioFinished = async (pageNumber: number) => {
    setIsPlaying(false);
    
    // Auto-advance to next page if available
    if (story && pageNumber < story.pageCount) {
      const nextPage = pageNumber + 1;
      
      // Scroll to next page
      scrollViewRef.current?.scrollTo({
        y: (nextPage - 1) * SCREEN_HEIGHT,
        animated: true,
      });
      
      // Start playing audio for next page after a short delay
      setTimeout(() => {
        playAudio(nextPage);
      }, 500);
    }
  };

  const stopAudio = async () => {
    await cleanupAudio();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading story...</Text>
      </View>
    );
  }

  if (error || !story) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Story not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const pageNumber = Math.round(event.nativeEvent.contentOffset.y / SCREEN_HEIGHT) + 1;
          setCurrentPage(pageNumber);
        }}
      >
        {Array.from({ length: story.pageCount }, (_, index) => {
          const pageNumber = index + 1;
          const imageUrl = getStoryPageImageUrl(storyId, pageNumber);

          return (
            <View key={pageNumber} style={styles.page}>
              <Image
                source={{
                  uri: imageUrl,
                  headers: authHeaders || undefined,
                }}
                style={styles.pageImage}
                resizeMode="contain"
              />
              
              <View style={styles.pageControls}>
                <Text style={styles.pageIndicator}>
                  Page {pageNumber} of {story.pageCount}
                </Text>
                
                {isPlaying && currentPage === pageNumber ? (
                  <TouchableOpacity
                    style={styles.audioButton}
                    onPress={stopAudio}
                  >
                    <Text style={styles.audioButtonText}>Stop</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.audioButton}
                    onPress={() => playAudio(pageNumber)}
                  >
                    <Text style={styles.audioButtonText}>Listen</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
  },
  page: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  pageImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
  pageControls: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  pageIndicator: {
    ...Typography.bodyMedium,
    color: Colors.on_surface_variant,
    marginBottom: Spacing.md,
  },
  audioButton: {
    backgroundColor: Colors.primary_container,
    paddingHorizontal: Spacing.xl * 2,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    minWidth: 120,
    alignItems: 'center',
    // Add gradient effect (can be enhanced with linear-gradient library)
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  audioButtonText: {
    ...Typography.labelLarge,
    color: Colors.on_primary_container,
    fontWeight: '600',
  },
  loadingText: {
    ...Typography.bodyLarge,
    color: Colors.on_surface_variant,
    marginTop: Spacing.md,
  },
  errorText: {
    ...Typography.bodyLarge,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  backButtonText: {
    ...Typography.labelLarge,
    color: Colors.on_primary,
  },
});
