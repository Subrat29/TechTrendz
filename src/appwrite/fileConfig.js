import conf from '../conf/conf'
import { Client, Storage, ID } from "appwrite";

export class FileService {
    client = new Client();
    storage;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.storage = new Storage(this.client);
    }

    async uploadImage(file) {
        try {
            const response = await this.storage.createFile(conf.appwriteBucketId, ID.unique(), file)
            console.log("appwrite/uploadImage/response: ", response);
            return response
        } catch (error) {
            console.log("appwrite/fileConfig/FileService/uploadImage : ", error)
            return false;
        }
    }

    async downloadImage(fileId) {
        try {
            return this.storage.getFileDownload(conf.appwriteBucketId, fileId)
        } catch (error) {
            console.log("appwrite/fileConfig/FileService/downloadImage : ", error)
            return false;
        }
    }

    async getImagePreview(fileId) {
        try {
            return this.storage.getFilePreview(conf.appwriteBucketId, fileId)
        } catch (error) {
            console.log("appwrite/fileConfig/FileService/getImagePreview : ", error)
            return false;
        }
    }

    async updateImage(fileId) {
        try {
            const response = await this.storage.updateFile(conf.appwriteBucketId, fileId)
            console.log("Fileservice/updateImage/response: ", response);
            return response;
        } catch (error) {
            console.log("appwrite/fileConfig/FileService/updateImage : ", error)
            return false;
        }
    }

    async deleteImage(fileId) {
        try {
            await this.storage.deleteFile(conf.appwriteBucketId, fileId)
            return true
        } catch (error) {
            console.log("appwrite/fileConfig/FileService/deleteImage : ", error)
            return false;
        }
    }
}

const fileservice = new FileService()
export default fileservice;