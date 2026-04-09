import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Radius } from '../constants/Radius';
import { ComponentSpacing } from '../constants/Spacing';

interface SecondaryButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Secondary Button Component (Action Chip)
 * 
 * Feels like a "sticker" placed on the page.
 * Uses secondary_container with on_secondary_container text.
 */
export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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
      style={[
        styles.container,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, disabled && styles.disabledText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary_container,
    borderRadius: Radius.button_secondary,
    paddingVertical: ComponentSpacing.button.vertical,
    paddingHorizontal: ComponentSpacing.button.horizontal,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  text: {
    ...Typography.titleMedium,
    color: Colors.on_secondary_container,
    textAlign: 'center',
  },
  disabled: {
    backgroundColor: Colors.surface_dim,
    opacity: 0.5,
  },
  disabledText: {
    color: Colors.on_surface_variant,
  },
});
