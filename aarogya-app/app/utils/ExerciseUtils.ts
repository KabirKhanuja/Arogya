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
    }

    save(){
        let totalAttempts = 30;
        const wrongs = Math.floor(Math.random() * 10);

        Localdb.appendExerciseToHistory({
            name: this.exerciseName,
            // date: new Date().toISOString(),
            duration: "2 min",
            correctMovementsCount: totalAttempts - wrongs,
            wrongMovementsCount: wrongs,
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
