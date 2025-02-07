import { Api } from "./ApiConstants";

export default class Chatbot {
    conversationId: string | null;

    constructor() {
        this.conversationId = null;
    }

    async getChatbotResponse(message: string) {
        try {
            console.log("Message: ", message, "TO:", this.conversationId);
            
            const response = await Api.post(Api.CHATBOT_URL, {
                message: message,
                conversation_id: this.conversationId
            });
            if (response.status >= 200 && response.status < 300) {
                const responseJson = response.responseJson;
                this.conversationId = responseJson.conversation_id;
                return responseJson.message;
            }
            return null;
        } catch (error) {
            console.log("Error in getting chatbot response: ", error);
            return null;
        }
    }

}