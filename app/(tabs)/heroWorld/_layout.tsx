import { Stack } from 'expo-router';

export default function HeroWorldLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="meal-maker"
        options={{
          title: 'Meal Maker',
          animation: 'slide_from_right',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="daily-challenge"
        options={{
          title: 'Daily Challenge',
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
