import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { ArrowLeft, Pause, Play } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const FOOD_FACTS = {
  'broccoli-shield': {
    title: 'Broccoli helps you grow strong',
    shortTitle: 'Broccoli has Vitamin C',
    description:
      'Broccoli gives your body vitamins that help you stay strong and healthy. It helps your body fight sickness and keeps you ready for playtime.',
    image:
      'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#2F9E44',
  },
  'emma-forest-friends': {
    title: 'Fruits and veggies help',
    shortTitle: 'Fruits and veggies help',
    description:
      'Colorful foods like apples, carrots, and greens help your body grow, learn, and play. Healthy bites can help every little hero feel amazing.',
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#E8792F',
  },
  default: {
    title: 'Healthy food helps your body',
    shortTitle: 'NutriHero Fact',
    description:
      'Healthy foods can help you grow strong, think clearly, and have energy for fun adventures every day.',
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#E77A1F',
  },
} as const;

export default function FoodFactScreen() {
  const { storyId } = useLocalSearchParams<{ storyId?: string }>();

  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fact = useMemo(() => {
    if (storyId && storyId in FOOD_FACTS) {
      return FOOD_FACTS[storyId as keyof typeof FOOD_FACTS];
    }
    return null;
  }, [storyId]);

  useEffect(() => {
    setLoading(true);
    setLoadFailed(false);

    const timer = setTimeout(() => {
      if (!fact) {
        setLoadFailed(true);
      }
      setLoading(false);
    }, 350);

    return () => {
      clearTimeout(timer);
      Speech.stop();
    };
  }, [fact]);

const handleToggleReadFact = () => {
  if (!fact) {
    Alert.alert('Audio unavailable', 'Audio is unavailable at the moment.');
    return;
  }

  if (isSpeaking) {
    Speech.stop();
    setIsSpeaking(false);
    return;
  }

  const factText = `${fact.title}. ${fact.description}`;

  // Show a clear message if there is no readable content.
  if (!factText.trim()) {
    Alert.alert('Audio unavailable', 'Audio is unavailable at the moment.');
    return;
  }

  try {
    Speech.speak(factText, {
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


  const handleGoHome = () => {
    Speech.stop();
    setIsSpeaking(false);
    router.replace('/stories');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E77A1F" />
        <Text style={styles.feedbackTitle}>Loading explanation...</Text>
        <Text style={styles.feedbackText}>
          Please wait while we prepare this healthy fact.
        </Text>
      </View>
    );
  }

  if (loadFailed || !fact) {
    return (
      <View style={styles.centered}>
        <Text style={styles.feedbackTitle}>Oops! Let&apos;s try again!</Text>
        <Text style={styles.feedbackText}>
          We could not show the explanation right now.
        </Text>

        <TouchableOpacity style={styles.primaryAction} onPress={() => router.replace('/stories')}>
          <Text style={styles.primaryActionText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={20} color="#B45309" />
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: fact.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          <View style={styles.titleBubble}>
            <Text style={styles.titleText}>{fact.shortTitle}</Text>
          </View>

          <Text style={styles.description}>{fact.description}</Text>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: fact.accentColor }]}
            onPress={handleToggleReadFact}
          >
            {isSpeaking ? (
              <View style={styles.buttonContent}>
                <Pause size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Pause Reading</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Play size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Read This To Me</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
            <Text style={styles.secondaryButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F5E9',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  backButton: {
    position: 'absolute',
    top: 58,
    left: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  card: {
    backgroundColor: '#F6F9E8',
    borderRadius: 32,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  imageWrap: {
    height: 300,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#DDE8D2',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    alignItems: 'center',
  },
  titleBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#F1E3C8',
    alignSelf: 'stretch',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2D241F',
    textAlign: 'center',
    lineHeight: 30,
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    color: '#5F5148',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 6,
    fontWeight: '600',
  },
  primaryButton: {
    alignSelf: 'stretch',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  secondaryButton: {
    alignSelf: 'stretch',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFF3E3',
    borderWidth: 2,
    borderColor: '#F1E3C8',
  },
  secondaryButtonText: {
    color: '#B45309',
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
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
