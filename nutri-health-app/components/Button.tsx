import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Radius } from '../constants/Radius';
import { ComponentSpacing } from '../constants/Spacing';

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Primary Button Component
 * 
 * Large, child-friendly button with gradient background.
 * Uses xl (3rem) roundedness for squircle effect.
 */
export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={disabled ? [Colors.surface_dim, Colors.surface_dim] : [Colors.primary, Colors.primary_container]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={[styles.text, disabled && styles.disabledText, textStyle]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.button_primary,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gradient: {
    paddingVertical: ComponentSpacing.button.vertical + 8, // Extra padding for child-friendly size
    paddingHorizontal: ComponentSpacing.button.horizontal + 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.headlineMedium,
    color: Colors.on_primary,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: Colors.on_surface_variant,
  },
});
