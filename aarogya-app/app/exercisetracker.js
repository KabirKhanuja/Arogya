import AsyncStorage from '@react-native-async-storage/async-storage';

const EXERCISES_KEY = 'completed_exercises';

export async function markExerciseCompleted(exerciseName) {
  let completedExercises = JSON.parse(await AsyncStorage.getItem(EXERCISES_KEY)) || [];
  if (!completedExercises.includes(exerciseName)) {
    completedExercises.push(exerciseName);
    await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(completedExercises));
  }
}

export async function getIncompleteExercises() {
  const allExercises = ['Exercise 1', 'Exercise 2', 'Exercise 3', 'Exercise 4', 'Exercise 5', 'Exercise 6'];
  let completedExercises = JSON.parse(await AsyncStorage.getItem(EXERCISES_KEY)) || [];
  return allExercises.filter(exercise => !completedExercises.includes(exercise));
}
