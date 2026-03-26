import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { Radius } from '../constants/Radius';
import { ComponentSpacing } from '../constants/Spacing';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

/**
 * Card Component
 * 
 * Container using surface hierarchy with proper nesting.
 * Should be a surface-container-lowest object on a surface-container background.
 * No divider lines - separation through color blocking.
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevated = false,
}) => {
  return (
    <View style={[styles.container, elevated && styles.elevated, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: Radius.card,
    padding: ComponentSpacing.card.padding,
    gap: ComponentSpacing.card.gap,
  },
  elevated: {
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
});
