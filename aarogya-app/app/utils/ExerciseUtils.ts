import Localdb from "./Localdb";

type ExerciseData = {
    exercise: string;
    state: { message?: string };
    current_reps_count: number;
    speak_text: string;
};

export default class ExerciseUtils {
    exerciseName: string;
    currentExerciseData: ExerciseData;

    constructor(exerciseName: string) {
        this.exerciseName = exerciseName;
        this.currentExerciseData = {
            exercise: exerciseName,
            state: {},
            current_reps_count: 0,
            speak_text: "",
        };
        const totalAttempts = Math.floor(Math.random() * 100);
        const corrects = Math.floor(Math.random() * 50);
        Localdb.appendExerciseToHistory({
            name: exerciseName,
            date: new Date().toISOString(),
            duration: Math.floor(Math.random() * 100),
            correctMovementsCount: corrects,
            wrongMovementsCount: totalAttempts - corrects,
            totalAttempts: totalAttempts,
        });
    }

    saveExerciseDataFromResponse(response: Object) {
        this.currentExerciseData = {
            ...this.currentExerciseData,
            state: response,
        };
    }

    getExerciseData() {
        if(this.currentExerciseData.state) return this.currentExerciseData.state;
        return null;
    }

    getMessage(): string {
        return this.currentExerciseData.state.message || "";
    }

    getRepsCount() {
        return this.currentExerciseData.current_reps_count;
    }

    getSpeakText() {
        return this.currentExerciseData.speak_text;
    }

    buildRequestData() {
        return {
            exercise: this.exerciseName,
            ...this.currentExerciseData.state,
            current_reps_count: this.currentExerciseData.current_reps_count,
        };
    }
}
