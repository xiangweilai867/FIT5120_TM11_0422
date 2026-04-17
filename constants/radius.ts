/**
 * NutriHealth Design System - Border Radius (Squircle Values)
 * 
 * Rounded corners for a child-friendly, organic feel.
 * No sharp corners - minimum sm (0.5rem) radius.
 */

export const Radius = {
  // None (strictly forbidden in this design system)
  none: 0,
  
  // Standard radii (in pixels, converted from rem)
  sm: 8,      // 0.5rem - Minimum radius
  md: 12,     // 0.75rem
  lg: 16,     // 1rem
  xl: 48,     // 3rem - For large buttons
  
  // Full rounded (for pills, badges)
  full: 9999, // Complete circle/pill shape
  
  // Named radii for semantic purposes
  button_primary: 48,     // xl - Large squircle buttons
  button_secondary: 16,   // lg - Action chips
  card: 16,               // lg - Cards and containers
  input: 8,               // sm - Text fields
  badge: 9999,            // full - Pills and tags
  modal: 24,              // Custom - Modals and overlays
} as const;

/**
 * Component-specific radius configurations
 */
export const ComponentRadius = {
  button: {
    primary: Radius.button_primary,
    secondary: Radius.button_secondary,
  },
  
  card: {
    default: Radius.card,
    elevated: Radius.lg,
  },
  
  input: {
    textField: Radius.input,
    textArea: Radius.md,
  },
  
  badge: {
    pill: Radius.badge,
    rounded: Radius.md,
  },
  
  image: {
    avatar: Radius.full,
    thumbnail: Radius.md,
    card: Radius.lg,
  },
} as const;
