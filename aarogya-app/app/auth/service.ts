import { Api, setJWTToken } from "../utils/ApiConstants";

type CreateUserAccount = {
    name: string;
    email: string;
    password: string;
};

type LoginUserAccount = {
    email: string;
    password: string;
};

class AuthenticationService {
    constructor() {}

    async createUserAccount(data: CreateUserAccount) {
        try {
            const response = await Api.post(Api.REGISTER_URL, data);
            if (response.status >= 200 && response.status < 300) {
                return response.responseJson;
            }
            return null;
        } catch (error) {
            console.log("Error in creating user account: ", error);
            return error;
        }
    }

    async loginUserAccount(data: LoginUserAccount) {
        console.log("Data: ", data);
        
        try {
            const response = await Api.post(Api.LOGIN_URL, {
                username: data.email,
                password: data.password
            });
            if (response.status >= 200 && response.status < 300) {
                const token = response.responseJson.token;
                await setJWTToken(token);
                return response.responseJson;
            }
            return null;
        } catch (error) {
            console.log("Error in logging in user account: ", error);
            return null;
        }
    }

    async getCurrentUser() {
        try {
            const response = await Api.get(Api.CURRENT_USER_URL);
            if (response.status >= 200 && response.status < 300) {
                return response.responseJson;
            }
            return null;
        } catch (error) {
            console.log("Error in getting current user: ", error);
            return null;
        }
    }

    async logoutUser() {
        try {
            // TODO: Call the logout API
            await Api.logoutUser();
            return true;
        } catch (error) {
            console.log("Error in logging out user: ", error);
            return false;
        }
    }
}

export default AuthenticationService;
