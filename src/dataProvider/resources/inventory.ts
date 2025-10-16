import { fetchUtils } from "react-admin";
import { keycloak } from "../../auth/keycloakAuthProvider";
import {
  extractApiResponseData,
  transformJavaResponse,
} from "../../utils/responseMapper";
import { ItemResponse, ItemRequest } from "../../types/api";

const API_URL = import.meta.env.VITE_SIMPLE_REST_URL;

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  if (keycloak.token) {
    (options.headers as Headers).set(
      "Authorization",
      `Bearer ${keycloak.token}`,
    );
  }
  return fetchUtils.fetchJson(url, options);
};

export const inventoryResource = {
  // Get inventory for a specific game save
  getInventory: async (gameSaveId: string) => {
    const url = `${API_URL}/admin/inventory/${gameSaveId}`;
    const { json } = await httpClient(url);
    const data = extractApiResponseData<ItemResponse[]>(json);
    return transformJavaResponse(data);
  },

  // Create an item in the inventory
  createItem: async (gameSaveId: string, itemRequest: ItemRequest) => {
    const url = `${API_URL}/admin/inventory/${gameSaveId}/item`;
    const { json } = await httpClient(url, {
      method: "POST",
      body: JSON.stringify(itemRequest),
    });
    const data = extractApiResponseData<ItemResponse>(json);
    return transformJavaResponse(data);
  },

  // Update an item in the inventory
  updateItem: async (
    gameSaveId: string,
    clientId: string,
    itemRequest: ItemRequest,
  ) => {
    const url = `${API_URL}/admin/inventory/${gameSaveId}/item/${encodeURIComponent(clientId)}`;
    const { json } = await httpClient(url, {
      method: "PUT",
      body: JSON.stringify(itemRequest),
    });
    const data = extractApiResponseData<ItemResponse>(json);
    return transformJavaResponse(data);
  },

  // Delete an item from the inventory
  deleteItem: async (gameSaveId: string, clientId: string) => {
    const url = `${API_URL}/admin/inventory/${gameSaveId}/item/${encodeURIComponent(clientId)}`;
    await httpClient(url, { method: "DELETE" });
    return { success: true };
  },

  // Clear entire inventory
  clearInventory: async (gameSaveId: string) => {
    const url = `${API_URL}/admin/inventory/${gameSaveId}`;
    await httpClient(url, { method: "DELETE" });
    return { success: true };
  },
};
