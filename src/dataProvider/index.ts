import { DataProvider } from "react-admin";
import { customDataProvider } from "./customDataProvider";
import { usersResource } from "./resources/users";
import { gameSavesResource } from "./resources/gameSaves";
import { inventoryResource } from "./resources/inventory";

// Resource name mappings to backend endpoints
const RESOURCE_MAPPINGS: Record<string, string> = {
  users: "user",
  gameSaves: "game_save",
  // inventory is handled differently as it's nested
};

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    switch (resource) {
      case "users":
        return usersResource.getList(params);
      case "gameSaves":
        return gameSavesResource.getList(params);
      default: {
        // Fall back to generic implementation with resource mapping
        const backendResource = RESOURCE_MAPPINGS[resource] || resource;
        return customDataProvider.getList(backendResource, params);
      }
    }
  },

  getOne: async (resource, params) => {
    switch (resource) {
      case "users":
        return usersResource.getOne(params);
      case "gameSaves":
        return gameSavesResource.getOne(params);
      default: {
        const backendResource = RESOURCE_MAPPINGS[resource] || resource;
        return customDataProvider.getOne(backendResource, params);
      }
    }
  },

  create: async (resource, params) => {
    switch (resource) {
      case "users":
        return usersResource.create(params);
      case "gameSaves":
        return gameSavesResource.create(params);
      default: {
        const backendResource = RESOURCE_MAPPINGS[resource] || resource;
        return customDataProvider.create(backendResource, params);
      }
    }
  },

  update: async (resource, params) => {
    switch (resource) {
      case "users":
        return usersResource.update(params);
      case "gameSaves":
        return gameSavesResource.update(params);
      default: {
        const backendResource = RESOURCE_MAPPINGS[resource] || resource;
        return customDataProvider.update(backendResource, params);
      }
    }
  },

  delete: async (resource, params) => {
    switch (resource) {
      case "users":
        return usersResource.delete(params);
      case "gameSaves":
        return gameSavesResource.delete(params);
      default: {
        const backendResource = RESOURCE_MAPPINGS[resource] || resource;
        return customDataProvider.delete(backendResource, params);
      }
    }
  },

  deleteMany: async (resource, params) => {
    const backendResource = RESOURCE_MAPPINGS[resource] || resource;
    return customDataProvider.deleteMany(backendResource, params);
  },

  getMany: async (resource, params) => {
    const backendResource = RESOURCE_MAPPINGS[resource] || resource;
    return customDataProvider.getMany(backendResource, params);
  },

  getManyReference: async (resource, params) => {
    const backendResource = RESOURCE_MAPPINGS[resource] || resource;
    return customDataProvider.getManyReference(backendResource, params);
  },
};

// Export resource-specific functions for custom components
export { usersResource, gameSavesResource, inventoryResource };
