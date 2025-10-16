import {
  CreateParams,
  DataProvider,
  DeleteParams,
  fetchUtils,
  GetListParams,
  GetOneParams,
  UpdateParams,
} from "react-admin";
import { keycloak } from "../auth/keycloakAuthProvider";
import {
  extractApiResponseData,
  transformJavaResponse,
} from "../utils/responseMapper";

const API_URL = import.meta.env.VITE_SIMPLE_REST_URL;

// Create authenticated HTTP client
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

// Helper function to build query string from sort parameters
const buildSortQuery = (sort?: { field: string; order: string }): string => {
  if (!sort) return "";
  // Convert React Admin sort format to backend orderBy format
  const direction = sort.order === "DESC" ? "desc" : "asc";
  return `orderBy=${sort.field}:${direction}`;
};

export const customDataProvider: DataProvider = {
  // Generic getList implementation
  getList: async (resource: string, params: GetListParams) => {
    const { sort } = params;
    const sortQuery = buildSortQuery(sort);

    let url = `${API_URL}/admin/${resource}`;
    if (sortQuery) {
      url += `?${sortQuery}`;
    }

    const { json } = await httpClient(url);
    const data = extractApiResponseData<any[]>(json);
    const transformedData = transformJavaResponse(data);

    return {
      data: transformedData,
      total: transformedData.length, // Backend doesn't provide total count
    };
  },

  // Generic getOne implementation
  getOne: async (resource: string, params: GetOneParams) => {
    const url = `${API_URL}/admin/${resource}/id/${params.id}`;
    const { json } = await httpClient(url);
    const data = extractApiResponseData(json);
    const transformedData = transformJavaResponse(data);

    return { data: transformedData };
  },

  // Generic create implementation
  create: async (resource: string, params: CreateParams) => {
    const url = `${API_URL}/admin/${resource}`;
    const { json } = await httpClient(url, {
      method: "POST",
      body: JSON.stringify(params.data),
    });
    const data = extractApiResponseData(json);
    const transformedData = transformJavaResponse(data);

    return { data: transformedData };
  },

  // Generic update implementation (using POST as per Java controllers)
  update: async (resource: string, params: UpdateParams) => {
    const url = `${API_URL}/admin/${resource}/id/${params.id}`;
    const { json } = await httpClient(url, {
      method: "POST", // Java controllers use POST for updates
      body: JSON.stringify(params.data),
    });
    const data = extractApiResponseData(json);
    const transformedData = transformJavaResponse(data);

    return { data: transformedData };
  },

  // Generic delete implementation
  delete: async (resource: string, params: DeleteParams) => {
    const url = `${API_URL}/admin/${resource}/id/${params.id}`;
    await httpClient(url, { method: "DELETE" });

    return { data: params.previousData };
  },

  // Generic deleteMany implementation
  deleteMany: async (resource: string, params: { ids: any[] }) => {
    // Execute individual deletes since backend doesn't support bulk delete
    await Promise.all(
      params.ids.map((id) =>
        httpClient(`${API_URL}/admin/${resource}/id/${id}`, {
          method: "DELETE",
        }),
      ),
    );

    return { data: params.ids };
  },

  // Generic getMany implementation
  getMany: async (resource: string, params: { ids: any[] }) => {
    // Execute individual gets since backend doesn't support bulk get
    const results = await Promise.all(
      params.ids.map(async (id) => {
        const { json } = await httpClient(
          `${API_URL}/admin/${resource}/id/${id}`,
        );
        const data = extractApiResponseData(json);
        return transformJavaResponse(data);
      }),
    );

    return { data: results };
  },

  // Generic getManyReference implementation
  getManyReference: async (resource: string, params: any) => {
    // For now, fall back to getList
    return customDataProvider.getList(resource, params);
  },
};
