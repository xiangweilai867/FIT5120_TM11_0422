import { getStoryById } from '@/constants/mock-stories';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { ArrowLeft, Pause, Play } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function StoryReaderScreen() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();

  const [story, setStory] = useState<ReturnType<typeof getStoryById> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const loadStory = () => {
    setLoading(true);
    setLoadFailed(false);

    try {
      const foundStory = getStoryById(storyId);

      // Simulate a real loading flow so the UI can show feedback instead of a blank screen.
      setTimeout(() => {
        if (!foundStory) {
          setStory(null);
          setLoadFailed(true);
        } else {
          setStory(foundStory);
        }
        setLoading(false);
      }, 400);
    } catch {
      setStory(null);
      setLoadFailed(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStory();
  }, [storyId]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const handleToggleListen = () => {
    if (!story) return;

    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    const fullStoryText = story.pages.map((page) => page.text).join(' ');

    if (!fullStoryText.trim()) {
      Alert.alert('Audio unavailable', 'Audio is unavailable at the moment.');
      return;
    }

    try {
      Speech.speak(fullStoryText, {
        language: 'en-US',
        rate: 0.9,
        pitch: 1.0,
        onStart: () => setIsSpeaking(true),
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => {
          setIsSpeaking(false);
          Alert.alert('Audio unavailable', 'Audio is unavailable at the moment.');
        },
      });
    } catch {
      setIsSpeaking(false);
      Alert.alert('Audio unavailable', 'Audio is unavailable at the moment.');
    }
  };

  const handleOpenFoodFact = () => {
    if (!story) return;

    router.push({
      pathname: '/stories/food-fact',
      params: { storyId: story.id },
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E77A1F" />
        <Text style={styles.feedbackTitle}>Loading story...</Text>
        <Text style={styles.feedbackText}>
          Please wait while we get your adventure ready.
        </Text>
      </View>
    );
  }

  if (loadFailed || !story) {
    return (
      <View style={styles.centered}>
        <Text style={styles.feedbackTitle}>Unable to load story</Text>
        <Text style={styles.feedbackText}>
          We could not open this story right now.
        </Text>

        <TouchableOpacity style={styles.primaryAction} onPress={loadStory}>
          <Text style={styles.primaryActionText}>Retry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryAction} onPress={() => router.replace('/stories')}>
          <Text style={styles.secondaryActionText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Image
          source={{ uri: story.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />

        <View style={styles.heroOverlay} />

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#2D241F" />
        </TouchableOpacity>

        <View style={styles.heroContent}>
          <View style={styles.titleBubble}>
            <Text style={styles.storyTitle}>{story.title}</Text>
          </View>

          <TouchableOpacity
            style={[styles.listenButton, { backgroundColor: story.accentColor }]}
            onPress={handleToggleListen}
          >
            {isSpeaking ? (
              <Pause size={18} color="#FFFFFF" />
            ) : (
              <Play size={18} color="#FFFFFF" />
            )}
            <Text style={styles.listenButtonText}>
              {isSpeaking ? 'Pause' : 'Listen'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.introCard}>
        <Text style={styles.introText}>
          Scroll down to read the story and see the pictures.
        </Text>
      </View>

      <View style={styles.pagesContainer}>
        {story.pages.map((page) => (
          <View key={page.id} style={styles.pageCard}>
            <Text style={styles.pageNumber}>
              Page {page.pageNumber}/{story.totalPages}
            </Text>

            <Text style={styles.pageText}>{page.text}</Text>

            {page.image ? (
              <Image
                source={{ uri: page.image }}
                style={styles.pageImage}
                resizeMode="cover"
              />
            ) : null}
          </View>
        ))}

        <View style={styles.factPromptCard}>
          <Text style={styles.factPromptTitle}>Want to know more?</Text>

          <Text style={styles.factPromptText}>
            Tap to discover something new about this healthy food.
          </Text>

          <TouchableOpacity style={styles.factButton} onPress={handleOpenFoodFact}>
            <Text style={styles.factButtonText}>Let&apos;s Explore!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5E9',
  },
  content: {
    paddingBottom: 120,
  },
  heroCard: {
    height: 330,
    margin: 16,
    marginTop: 34,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#DDD',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 72,
  },
  titleBubble: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: '90%',
  },
  storyTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2D241F',
    textAlign: 'center',
    lineHeight: 32,
  },
  listenButton: {
    alignSelf: 'center',
    minWidth: 150,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  listenButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  introCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#F2DFC0',
  },
  introText: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    color: '#705D50',
    fontWeight: '700',
  },
  pagesContainer: {
    paddingHorizontal: 16,
  },
  pageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 2,
    borderColor: '#F1E3C8',
    marginBottom: 16,
  },
  pageNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8B6F47',
    marginBottom: 12,
  },
  pageText: {
    fontSize: 22,
    lineHeight: 34,
    color: '#2D241F',
    fontWeight: '500',
    marginBottom: 16,
  },
  pageImage: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    backgroundColor: '#EAEAEA',
  },
  factPromptCard: {
    backgroundColor: '#FFF8E8',
    borderRadius: 24,
    padding: 18,
    borderWidth: 2,
    borderColor: '#F2DFC0',
    marginBottom: 12,
  },
  factPromptTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2D241F',
    marginBottom: 8,
    textAlign: 'center',
  },
  factPromptText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6C5B4F',
    textAlign: 'center',
    marginBottom: 14,
  },
  factButton: {
    backgroundColor: '#E77A1F',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  factButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  centered: {
    flex: 1,
    backgroundColor: '#F8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2D241F',
    marginTop: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 16,
    color: '#6C5B4F',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  primaryAction: {
    backgroundColor: '#E77A1F',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginBottom: 10,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryAction: {
    backgroundColor: '#FFF3E3',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#F1E3C8',
  },
  secondaryActionText: {
    color: '#B45309',
    fontSize: 16,
    fontWeight: '900',
  },
});
