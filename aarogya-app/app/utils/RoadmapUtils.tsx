import { Api } from "./ApiConstants";
import * as SecureStorage from "expo-secure-store";

export default class RoadmapUtils {
    userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    async generateRoadmap({ force }: { force: boolean } = { force: false }) {
        try {
            if (!force) {
                const localRoadmap = await SecureStorage.getItemAsync('roadmap');
                if (localRoadmap && localRoadmap != "") {
                    const localRoadmapObj = JSON.parse(localRoadmap);
                    if (localRoadmapObj) return localRoadmapObj;
                }
            } else console.log("[Warning] Generating roadmap forcefully");
            const url = force ? Api.GENERATE_ROADMAP_FORCE_URL : Api.GENERATE_ROADMAP_URL;
            const response = await Api.post(url, {});
            if (response.status >= 200 && response.status < 300) {
                const responseJson = response.responseJson;
                console.log("Roadmap response: ", responseJson);
                await SecureStorage.setItemAsync('roadmap', JSON.stringify(responseJson));
                return responseJson;
            }
            return null;
        } catch (error) {
            console.log("Error in getting chatbot response: ", error);
            return null;
        }
    }


    static async clearRoadmapFromStorage() {
        await SecureStorage.deleteItemAsync('roadmap');
    }

}