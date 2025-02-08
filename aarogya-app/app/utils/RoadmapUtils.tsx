import { Api } from "./ApiConstants";
import * as SecureStorage from "expo-secure-store";

export default class RoadmapUtils {
    userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    async generateRoadmap() {
        try {
            const localRoadmap = await SecureStorage.getItemAsync('roadmap');
            if (localRoadmap && localRoadmap != "") {
                const localRoadmapObj = JSON.parse(localRoadmap);
                if (localRoadmapObj) return;
            }

            const response = await Api.post(Api.GENERATE_ROADMAP_URL, {});
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

}