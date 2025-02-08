import { Api } from "./ApiConstants";

export default class RoadmapUtils {
    userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    async generateRoadmap() {
        try {            
            const response = await Api.post(Api.GENERATE_ROADMAP_URL, {});
            if (response.status >= 200 && response.status < 300) {
                const responseJson = response.responseJson;
                return responseJson;
            }
            return null;
        } catch (error) {
            console.log("Error in getting chatbot response: ", error);
            return null;
        }
    }

}