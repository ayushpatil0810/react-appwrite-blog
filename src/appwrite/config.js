import config from "../config/config.js";
import { Client, ID, TablesDB, Storage, Query } from "appwrite";

export class AppwriteService {
  client = new Client();
  databases;
  bucket;
  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.databases = new TablesDB(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createRow(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        },
      );
    } catch (error) {
      console.log("Appwrite service :: createPost :: ", error);
    }
  }

  async updatePost(slug, { postId, title, content, featuredImage, status }) {
    try {
      return await this.databases.updateRow(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        },
      );
    } catch (error) {
      console.log("Appwrite service :: updatePost :: ", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteRow(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
      );
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: ", error);
      return false;
    }
  }

  async getPosts(slug) {
    try {
      return await this.databases.getRow(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
      );
    } catch (error) {
      console.log("Appwrite service :: getPosts :: ", error);
      return false;
    }
  }

  async getPosts() {
    try {
      const queries = [Query.equal("status", "active")];
      return await this.databases.listRows(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        queries,
      );
    } catch (error) {
      console.log("Appwrite service :: getPosts :: ", error);
      return false;
    }
  }

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: ", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.bucket.deleteFile(fileId);
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: ", error);
      return false;
    }
  }

  async getFilePreview(fileId) {
    try {
      return this.bucket.getFilePreview(fileId, 400, 400);
    } catch (error) {
      console.log("Appwrite service :: getFilePreview :: ", error);
      return false;
    }
  }

  
}

const service = new AppwriteService();
export default service;
