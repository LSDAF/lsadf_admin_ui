import {
  GetListParams,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  fetchUtils,
} from "react-admin";
import { keycloak } from "../../auth/keycloakAuthProvider";
import {
  extractApiResponseData,
  transformJavaResponse,
} from "../../utils/responseMapper";
import {
  UserResponse,
  AdminUserCreationRequest,
  AdminUserUpdateRequest,
  SearchRequest,
} from "../../types/api";

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

const buildSortQuery = (sort?: { field: string; order: string }): string => {
  if (!sort) return "";
  const direction = sort.order === "DESC" ? "_DESC" : "";
  return `order_by=${sort.field}${direction}`;
};

export const usersResource = {
  getList: async (params: GetListParams) => {
    const { sort, filter } = params;

    // Use search endpoint if filters are provided
    if (filter && Object.keys(filter).length > 0) {
      const sortQuery = buildSortQuery(sort);
      const searchUrl = `${API_URL}/admin/search/users${sortQuery ? `?${sortQuery}` : ""}`;

      const searchRequest: SearchRequest = {
        searchTerms: filter,
      };

      const { json } = await httpClient(searchUrl, {
        method: "POST",
        body: JSON.stringify(searchRequest),
      });
      console.log({ json });
      const data = extractApiResponseData<UserResponse[]>(json);
      const transformedData = transformJavaResponse(data);

      return {
        data: transformedData,
        total: transformedData.length,
      };
    }

    // Regular list endpoint
    const sortQuery = buildSortQuery(sort);
    const url = `${API_URL}/admin/user${sortQuery ? `?${sortQuery}` : ""}`;

    const { json } = await httpClient(url);
    const data = extractApiResponseData<UserResponse[]>(json);
    const transformedData = transformJavaResponse(data);

    return {
      data: transformedData,
      total: transformedData.length,
    };
  },

  getOne: async (params: GetOneParams) => {
    const url = `${API_URL}/admin/user/id/${params.id}`;
    const { json } = await httpClient(url);
    const data = extractApiResponseData<UserResponse>(json);
    const transformedData = transformJavaResponse(data);

    return { data: transformedData };
  },

  create: async (params: CreateParams) => {
    const url = `${API_URL}/admin/user`;
    const { json } = await httpClient(url, {
      method: "POST",
      body: JSON.stringify(params.data),
    });
    const data = extractApiResponseData<UserResponse>(json);
    const transformedData = transformJavaResponse(data);

    return { data: transformedData };
  },

  update: async (params: UpdateParams) => {
    const url = `${API_URL}/admin/user/id/${params.id}`;
    const { json } = await httpClient(url, {
      method: "POST", // Backend uses POST for updates
      body: JSON.stringify(params.data),
    });
    const data = extractApiResponseData<UserResponse>(json);
    const transformedData = transformJavaResponse(data);

    return { data: transformedData };
  },

  delete: async (params: DeleteParams) => {
    const url = `${API_URL}/admin/user/id/${params.id}`;
    await httpClient(url, { method: "DELETE" });

    return { data: params.previousData };
  },

  // Custom method to get user by username
  getUserByUsername: async (username: string) => {
    const url = `${API_URL}/admin/user/username/${encodeURIComponent(username)}`;
    const { json } = await httpClient(url);
    const data = extractApiResponseData<UserResponse>(json);
    return transformJavaResponse(data);
  },
};
