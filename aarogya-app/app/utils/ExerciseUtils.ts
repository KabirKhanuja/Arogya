type ExerciseData = {
    exercise: string;
    data: Object;
    current_reps_count: number;
    speak_text: string;
}

export default class ExerciseUtils {
    exerciseName:string;
    currentExerciseData: ExerciseData;

    constructor(exerciseName:string) {
        this.exerciseName = exerciseName;
        this.currentExerciseData = {
            exercise: exerciseName,
            data: {},
            current_reps_count: 0,
            speak_text: ''
        }
    }

    saveExerciseDataFromResponse(response: Object) {
        this.currentExerciseData = {
            ...this.currentExerciseData,
            data: {
                ...response
            }
        }
    }

    getExerciseData() {
        return this.currentExerciseData.data;
    }

    getRepsCount() {
        return this.currentExerciseData.current_reps_count;
    }

    getSpeakText() {
        return this.currentExerciseData.speak_text;
    }
}