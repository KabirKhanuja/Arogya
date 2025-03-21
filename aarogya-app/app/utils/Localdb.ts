import * as SecureStore from "expo-secure-store";

export default class Localdb {
    static set(key: string, value: any) {
        SecureStore.setItem(key, JSON.stringify(value));
    }
    static get(key: string) {
        const value = SecureStore.getItem(key);
        return value ? JSON.parse(value) : null;
    }
    static async remove(key: string) {
        await SecureStore.deleteItemAsync(key);
    }
    static async clear() {
        const keys = ['exerciseHistory', 'profile'];
        keys.forEach(async key => {
            await SecureStore.deleteItemAsync(key);
        });
    }

    static getExerciseHistory() {
        return Localdb.get('exerciseHistory') || [];
    }
    
    static appendExerciseToHistory(exercise: any) {
        const history = Localdb.getExerciseHistory();
        history.push(exercise);
        Localdb.setExerciseHistory(history);
    }

    static setExerciseHistory(history: any) {
        Localdb.set('exerciseHistory', history);
    }

    static setStepCount(count: number){
        Localdb.set('stepcount', count);
    }

    static getStepCount(){
        return Localdb.get('stepcount') || 0;
    }

    static getProfile() {
        return Localdb.get('profile') || {};
    }

    static setProfile(profile: any) {
        Localdb.set('profile', profile);
    }
    
}