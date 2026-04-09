/**
 * NutriHealth Design System - Color Palette
 * 
 * Nature-based palette: leafy greens (primary), sun-ripened oranges (secondary), 
 * and berry reds (tertiary). Using tonal layering for elevation instead of shadows.
 */

export const Colors = {
  // Primary Colors (Greens)
  primary: '#006b1b',
  primary_container: '#91f78e',
  primary_dim: '#005215',
  primary_fixed: '#91f78e',
  on_primary: '#ffffff',
  on_primary_container: '#002106',

  // Secondary Colors (Oranges)
  secondary: '#ff8a00',
  secondary_container: '#ffd699',
  secondary_dim: '#cc6e00',
  on_secondary: '#ffffff',
  on_secondary_container: '#4d2900',

  // Tertiary Colors (Berry Reds)
  tertiary: '#e63946',
  tertiary_container: '#ffb3ba',
  tertiary_dim: '#b02500',
  on_tertiary: '#ffffff',
  on_tertiary_container: '#4a0000',

  // Error Colors
  error: '#b02500',
  error_container: '#ffdad6',
  on_error: '#ffffff',
  on_error_container: '#410002',

  // Surface Hierarchy (Tonal Layering)
  surface: '#f2f9ea',
  surface_dim: '#ccd8c4',
  surface_bright: '#ffffff',
  surface_container_lowest: '#ffffff',
  surface_container_low: '#ebf3e3',
  surface_container: '#e5efdc',
  surface_container_high: '#dce6d4',
  surface_container_highest: '#d6e0ce',

  // On-Surface Colors
  on_surface: '#2a3127',
  on_surface_variant: '#5a6155',
  
  // Outline
  outline: '#8a9185',
  outline_variant: '#a8afa2',

  // Inverse Colors
  inverse_surface: '#2f3330',
  inverse_on_surface: '#f0f1ec',
  inverse_primary: '#75da74',

  // Shadow (using on_surface instead of pure black)
  shadow: '#2a3127',
  scrim: '#000000',
} as const;

/**
 * Gradient configurations for buttons and interactive elements
 */
export const Gradients = {
  primary: {
    colors: [Colors.primary, Colors.primary_container],
    angle: 135,
  },
  secondary: {
    colors: [Colors.secondary, Colors.secondary_container],
    angle: 135,
  },
} as const;

/**
 * Opacity values for glassmorphism effects
 */
export const Opacity = {
  glassmorphism: 0.7,
  ghost_border: 0.15,
  overlay: 0.4,
} as const;
