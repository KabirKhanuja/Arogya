import { UserType } from "../types/user";
import Localdb from "./Localdb";

export default class UserProfiledb {
    static getProfile() : UserType | null {
        const profile = Localdb.get('profile');
        return  profile ? (profile as UserType) : null;
    }

    static setProfile(user: UserType) {
        Localdb.set('profile', user);
    }
}