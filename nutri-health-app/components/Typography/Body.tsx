import React, { ReactNode } from 'react';
import { Text, TextStyle } from 'react-native';
import { Typography } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';

interface BodyProps {
  children: ReactNode;
  size?: 'large' | 'medium' | 'small';
  color?: string;
  style?: TextStyle;
}

/**
 * Body Text Component
 * 
 * Uses Be Vietnam Pro for readable, instructional content.
 * This is our "Guide" with generous x-height for early readers.
 */
export const Body: React.FC<BodyProps> = ({
  children,
  size = 'medium',
  color = Colors.on_surface,
  style,
}) => {
  const sizeStyle = 
    size === 'large' ? Typography.bodyLarge :
    size === 'small' ? Typography.bodySmall :
    Typography.bodyMedium;

  return (
    <Text style={[sizeStyle, { color }, style]}>
      {children}
    </Text>
  );
};
