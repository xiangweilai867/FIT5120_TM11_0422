import AppHeader from '@/components/app_header';
import { router } from 'expo-router';
import { Camera, QrCode, Utensils, Zap } from 'lucide-react-native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScanScreen() {
  const handleStartScan = () => {
    router.push('/scan/camera');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Shared app header used across main pages */}
        <AppHeader />

        {/* Mascot / banner section */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../../../assets/images/nutriheroes_icon.png')}
            style={styles.teamImage}
            resizeMode="contain"
          />

          <View style={styles.missionBadge}>
            <Text style={styles.missionText}>MISSION: BECOME A HERO!</Text>
          </View>
        </View>

        {/* Main card that explains how the scan flow works */}
        <View style={styles.mainCard}>
          <Text style={styles.sectionTitle}>How to Scan</Text>

          <View style={styles.stepsContainer}>
            <StepCard
              number={1}
              icon={<Utensils size={30} color="#FFFFFF" />}
              label="Find some yummy food!"
              iconBackground="#FF8A3D"
              stepColor="#D96A00"
            />

            <StepCard
              number={2}
              icon={<Camera size={30} color="#1B5E20" />}
              label="Point your Hero Lens!"
              iconBackground="#A8E89A"
              stepColor="#2E7D32"
            />

            <StepCard
              number={3}
              icon={<Zap size={30} color="#FFFFFF" />}
              label="Collect Hero Powers!"
              iconBackground="#F59A9A"
              stepColor="#D64545"
            />
          </View>

          <TouchableOpacity style={styles.scanButton} onPress={handleStartScan}>
            <QrCode size={30} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>START SCANNING</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type StepCardProps = {
  number: number;
  icon: React.ReactNode;
  label: string;
  iconBackground: string;
  stepColor: string;
};

function StepCard({
  number,
  icon,
  label,
  iconBackground,
  stepColor,
}: StepCardProps) {
  return (
    <View style={styles.stepCard}>
      <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>
        {icon}
      </View>

      <View style={styles.stepTextContainer}>
        <Text style={[styles.stepLabel, { color: stepColor }]}>STEP {number}</Text>
        <Text style={styles.stepDescription}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8EC',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
    backgroundColor: '#F6F8EC',
    flexGrow: 1,
  },
  bannerContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  teamImage: {
    width: 260,
    height: 140,
    marginBottom: 8,
  },
  missionBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#E8D7C7',
    minWidth: '88%',
    alignItems: 'center',
  },
  missionText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#B45309',
  },
  mainCard: {
    backgroundColor: '#EEF0E8',
    borderRadius: 32,
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    color: '#1F1F1F',
    marginBottom: 28,
  },
  stepsContainer: {
    gap: 18,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1F1F1F',
    lineHeight: 24,
  },
  scanButton: {
    marginTop: 28,
    backgroundColor: '#B45309',
    borderRadius: 26,
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
