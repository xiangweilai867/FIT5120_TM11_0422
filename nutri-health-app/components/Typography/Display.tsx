import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Typography } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';

interface DisplayProps {
  children: ReactNode;
  size?: 'large' | 'medium' | 'small';
  color?: string;
  style?: TextStyle;
}

/**
 * Display Text Component
 * 
 * Uses Plus Jakarta Sans for high-impact, friendly displays.
 * These are our "Voice" - the rounded terminals mirror the squircle shapes.
 */
export const Display: React.FC<DisplayProps> = ({
  children,
  size = 'medium',
  color = Colors.on_surface,
  style,
}) => {
  const sizeStyle = 
    size === 'large' ? Typography.displayLarge :
    size === 'small' ? Typography.displaySmall :
    Typography.displayMedium;

  return (
    <Text style={[sizeStyle, { color }, style]}>
      {children}
    </Text>
  );
};
