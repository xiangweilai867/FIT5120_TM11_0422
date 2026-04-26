// Simplified types for goal components - only what's needed for API responses
// All hardcoded food data has been removed; data now comes from API

export interface Food {
  name: string;
  description?: string;
  image: string;
  rating?: number;
}

// Alias for backward compatibility with existing code using SuperFood
export type SuperFood = Food;

// Goal metadata interface - only navigation info, no hardcoded food data
export interface GoalMeta {
  id: string;
  title: string;
  subtitle: string;
  emoji?: string;
}
