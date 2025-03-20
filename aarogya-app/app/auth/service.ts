import { Api, setJWTToken, hasToken } from "../utils/ApiConstants";
import Localdb from "../utils/Localdb";
import UserProfiledb from "../utils/UserProfiledb";

type CreateUserAccount = {
    name: string;
    email: string;
    password: string;
};

type LoginUserAccount = {
    email: string;
    password: string;
};

type UpdateUserData = {
    age: number;
    gender: string;
    weight: string;
    height: string;
    doYouSmoke: string;
    doYouDrink: string;
    problems: string;
    medicalHistory: string;
};

type AuthResponse<T> = {
    response: T | null;
    error: string | null;
};

class AuthenticationService {
    constructor() {}

    async createUserAccount(
        data: CreateUserAccount
    ): Promise<AuthResponse<any>> {
        try {
            const response = await Api.post(Api.REGISTER_URL, {
                name: data.name,
                username: data.email,
                password: data.password,
            });
            console.log("REGISTER Response: ", response);

            if (response.status >= 200 && response.status < 300) {
                const token = response.responseJson.token;
                await setJWTToken(token);
                return {
                    response: response.responseJson,
                    error: null,
                };
            }
            return {
                response: null,
                error: response.responseJson
                    ? response.responseJson.message
                    : "Unknown error",
            };
        } catch (error) {
            console.log("Error in creating user account: ", error);
            return {
                response: null,
                error: "Unknown error",
            };
        }
    }

    async loginUserAccount(
        data: LoginUserAccount
    ): Promise<AuthResponse<string>> {
        try {
            const response = await Api.post(Api.LOGIN_URL, {
                username: data.email,
                password: data.password,
            });
            console.log("LOGIN Response: ", response);

            if (response.status >= 200 && response.status < 300) {
                const token = response.responseJson.token;
                await setJWTToken(token);
                return {
                    response: response.responseJson,
                    error: null,
                };
            }
            return {
                response: null,
                error: response.responseJson
                    ? response.responseJson.message
                    : "Unknown error",
            };
        } catch (error) {
            console.log("Error in logging in user account: ", error);
            return {
                response: null,
                error: "Unknown error",
            };
        }
    }

    async getCurrentUser() {
        try {
            if (await hasToken()) {
                const user = UserProfiledb.getProfile();
                if (user) return { user: user };
            } else return null;

            const response = await Api.get(Api.CURRENT_USER_URL);
            if (response.status >= 200 && response.status < 300) {
                UserProfiledb.setProfile(response.responseJson.user);
                return response.responseJson;
            }
            return null;
        } catch (error) {
            console.log("Error in getting current user: ", error);
            return null;
        }
    }

    async updateUserAccount(data: UpdateUserData) {
        try {
            const response = await Api.post(Api.UPDATE_USER_URL, {
                age: data.age,
                gender: data.gender,
                weight: data.weight,
                height: data.height,
                doYouSmoke: data.doYouSmoke,
                doYouDrink: data.doYouDrink,
                problems: data.problems,
                medicalHistory: data.medicalHistory,
            });
            if (response.status >= 200 && response.status < 300) {
                return response.responseJson;
            }
            return null;
        } catch (error) {
            console.log("Error in updating user account: ", error);
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
