import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import type { Goal } from './types';

const { width } = Dimensions.get('window');

export default function FightGermsDetail({ goal, onBack }: { goal: Goal; onBack?: () => void }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Custom Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft color="#E91E63" size={28} />
        <Text style={styles.backButtonText}>Back to Goals</Text>
      </TouchableOpacity>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Foods for 🛡️ {goal.title}</Text>
          <Text style={styles.heroSubtitle}>{goal.description}</Text>
          <View style={styles.tipRow}>
            <ShieldCheck color="#E91E63" size={24} />
            <Text style={styles.tipText}>{goal.mascotTip}</Text>
          </View>
        </View>
      </View>

      {/* Super Power Foods */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>Super Power Foods</Text>
        </View>

        <View style={styles.grid}>
          {goal.superFoods.map((food, i) => (
            <View key={food.name} style={styles.foodCard}>
              <View style={styles.foodInfo}>
                <View style={styles.starRow}>
                  {[...Array(food.rating || 2)].map((_, starIdx) => (
                    <Text key={starIdx} style={styles.star}>★</Text>
                  ))}
                </View>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.goodChoiceText}>Good Choice</Text>
              </View>
              <View style={styles.foodImageContainer}>
                <Image 
                  source={{ uri: food.image }} 
                  style={styles.foodImage} 
                  resizeMode="contain"
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Try Less Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIndicator, { backgroundColor: '#FF8A65' }]} />
          <Text style={styles.sectionTitle}>Try Less</Text>
        </View>

        <View style={styles.tryLessCard}>
          <View style={styles.tryLessContent}>
            <View style={styles.badChoiceColumn}>
              <Image 
                source={{ uri: goal.tryLess.image }} 
                style={styles.badImage} 
                resizeMode="contain"
              />
              <Text style={styles.badName}>{goal.tryLess.name}</Text>
            </View>
            <View style={styles.tryLessInfo}>
              <View style={styles.tryThisRow}>
                <View style={styles.divider} />
                <Text style={styles.tryThisText}>Try this instead!</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.goodChoiceRow}>
                <Image 
                  source={{ uri: goal.tryLess.alternative.image }} 
                  style={styles.goodImage} 
                  resizeMode="contain"
                />
                <View style={styles.goodChoiceInfo}>
                  <Text style={styles.goodName}>{goal.tryLess.alternative.name}</Text>
                  <Text style={styles.goodTip}>{goal.tryLess.alternative.tip}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FCE4EC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E91E63',
  },
  heroSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  heroCard: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    width: '100%',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#36392c',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#E91E63',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  tipRow: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#36392c',
    flex: 1,
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIndicator: {
    width: 6,
    height: 32,
    borderRadius: 3,
    backgroundColor: '#E91E63',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#36392c',
  },
  grid: {
    gap: 16,
  },
  foodCard: {
    backgroundColor: '#f1f5f9',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  foodInfo: {
    flex: 1,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  star: {
    color: '#E91E63',
    fontSize: 18,
    marginRight: 2,
  },
  foodName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#36392c',
    marginBottom: 2,
  },
  goodChoiceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E91E63',
  },
  foodImageContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  tryLessCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,0.1)',
  },
  tryLessContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  badChoiceColumn: {
    alignItems: 'center',
  },
  badImage: {
    width: 80,
    height: 80,
    opacity: 0.7,
    marginBottom: 8,
  },
  badName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#64748b',
  },
  tryLessInfo: {
    width: '100%',
    alignItems: 'center',
  },
  alternativeTip: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  tryThisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  tryThisText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#E91E63',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginHorizontal: 16,
  },
  goodChoiceRow: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FCE4EC',
  },
  goodImage: {
    width: 48,
    height: 48,
  },
  goodChoiceInfo: {
    flex: 1,
  },
  goodName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#36392c',
    marginBottom: 2,
  },
  goodTip: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E91E63',
  },
});
