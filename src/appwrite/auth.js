import { Client, Account, ID } from "appwrite";
import conf from '../conf/conf'

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async signUp({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount)
                return this.logIn({ email, password })
            else
                return userAccount
        } catch (error) {
            console.log("Appwrite/Auth/AuthService/signUp: ", error);
            throw error
        }
    }

    async logIn({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            console.log("Appwrite/Auth/AuthService/logIn: ", error);
            throw error;
        }

    }

    async getCurrentUser() {
        try {
            const response = await this.account.get();
            // console.log("getCurrentUser/response: ", response);
            return response
        } catch (error) {
            console.log("Appwrite/Auth/AuthService/getCurrentUser: ", error);
        }
        return null;
    }

    async logOut() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite/Auth/AuthService/logOut: ", error);
        }
    }
}

const authservice = new AuthService()
export default authservice