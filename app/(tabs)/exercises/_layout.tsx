import { Stack } from 'expo-router';

export default function ExerciseLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Add Exercise',
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{
          title: 'Edit Exercise',
        }} 
      />
    </Stack>
  );
}