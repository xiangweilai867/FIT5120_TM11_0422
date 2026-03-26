import React, { ReactNode } from 'react';
import { Text, TextStyle } from 'react-native';
import { Typography } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';

interface HeadlineProps {
  children: ReactNode;
  size?: 'large' | 'medium' | 'small';
  color?: string;
  style?: TextStyle;
}

/**
 * Headline Text Component
 * 
 * Uses Plus Jakarta Sans for section headings and emphasis.
 * Balances impact with readability.
 */
export const Headline: React.FC<HeadlineProps> = ({
  children,
  size = 'medium',
  color = Colors.on_surface,
  style,
}) => {
  const sizeStyle = 
    size === 'large' ? Typography.headlineLarge :
    size === 'small' ? Typography.headlineSmall :
    Typography.headlineMedium;

  return (
    <Text style={[sizeStyle, { color }, style]}>
      {children}
    </Text>
  );
};
