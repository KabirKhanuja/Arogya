import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "jwt-tokens";

const getJWTToken = async () => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
};

const setJWTToken = async (token: string) => {
    console.log("Setting token: ", token);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
};

const clearJWTToken = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export class Api {
    static readonly BASE_URL = "https://aarogyaapi.vercel.app/";
    // static readonly BASE_URL = "http://192.168.94.4:5000/";

    static readonly LOGIN_URL = `${Api.BASE_URL}/login`;
    static readonly REGISTER_URL = `${Api.BASE_URL}/signup`;
    static readonly CURRENT_USER_URL = `${Api.BASE_URL}/user/profile`;
    static readonly LOGOUT_URL = `${Api.BASE_URL}/logout`;
    static readonly CHATBOT_URL = `${Api.BASE_URL}/chat`;
    static readonly UPDATE_USER_URL = `${Api.BASE_URL}/user/profile`;
    static readonly USER_FORM_FILLED_URL = `${Api.BASE_URL}/user/profile/formFilled`;
    static readonly GENERATE_ROADMAP_URL = `${Api.BASE_URL}/user/generate-roadmap-force`;
    static readonly LOCAL_SERVER_IP_ADDRESS = `http://192.168.94.4:5000`;
    static readonly RECORD_EXERCISE_URL = `${Api.LOCAL_SERVER_IP_ADDRESS}/record-exercise`;

    static async buildHeaders() {
        const token = await getJWTToken();
        console.log("Token: ", token);
        
        return {
            "Content-Type": "application/json",
            Authorization: `${token}`,
        };
    }

    static async get(url: string) {
        try {
            console.log("GET request to: ", url);
            const response = await fetch(url, {
                method: "GET",
                headers: await Api.buildHeaders(),
            });
            const responseJson = await response.json();
            console.log("Response: ", responseJson, response.status);
            return { responseJson, status: response.status };
        } catch (error) {
            console.log("Error in get request: ", error);
            return { responseJson: null, status: 500 };
        }
    }

    static async post(url: string, data: any) {
        try {
            console.log("POST request to: ", url);
            const response = await fetch(url, {
                method: "POST",
                headers: await Api.buildHeaders(),
                body: JSON.stringify(data),
            });
            const responseJson = await response.json();
            console.log("Response: ", responseJson, response.status);
            return { responseJson, status: response.status };
        } catch (error) {
            console.log("Error in post request: ", error);
            return { responseJson: null, status: 500 };
        }
    }

    static async logoutUser() {
        await clearJWTToken();
    }
}

export { setJWTToken, clearJWTToken };
