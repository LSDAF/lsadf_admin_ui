import {
  CreateParams,
  DeleteParams,
  fetchUtils,
  GetListParams,
  GetOneParams,
  SortPayload,
  UpdateParams,
} from "react-admin";
import { keycloak } from "../../auth/keycloakAuthProvider";
import {
  extractApiResponseData,
  transformJavaResponse,
} from "../../utils/responseMapper";
import { Filter, GameSaveResponse, SearchRequest } from "../../types/api";
import { toSnakeCase } from "../../utils/requestMapper.ts";

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

const transformFiltersToJavaFormat = (
  filters: Record<string, any>,
): Filter[] => {
  const javaFilters: Filter[] = [];

  // Handle nested filters object from React Admin
  if (filters.filters) {
    Object.entries(filters.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        javaFilters.push({
          type: key,
          value: String(value),
        });
      }
    });
  }

  // Handle direct filter properties
  Object.entries(filters).forEach(([key, value]) => {
    if (
      key !== "filters" &&
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      javaFilters.push({
        type: key,
        value: String(value),
      });
    }
  });

  return javaFilters;
};

const buildSortQuery = (sort?: { field: string; order: string }): string => {
  if (!sort) return "";
  // if field contains dot, then take the part after the dot else take the whole field
  const field = sort.field.includes(".")
    ? sort.field.split(".")[1]
    : sort.field;
  const snakeCaseField = toSnakeCase(field).toUpperCase();
  const direction = sort.order === "DESC" ? "_DESC" : "";
  return `order_by=${snakeCaseField}${direction}`;
};

const searchGameSaves = async (sort: SortPayload | undefined, filter: any) => {
  const sortQuery = buildSortQuery(sort);
  const searchUrl = `${API_URL}/admin/search/game_saves${sortQuery ? `?${sortQuery}` : ""}`;

  // Transform filters to Java Filter structure
  const javaFilters = transformFiltersToJavaFormat(filter);
  console.log({ javaFilters });
  const searchRequest: SearchRequest = {
    filters: javaFilters,
  };

  const { json } = await httpClient(searchUrl, {
    method: "POST",
    body: JSON.stringify(searchRequest),
  });

  const data = extractApiResponseData<GameSaveResponse[]>(json);
  const transformedData = transformJavaResponse(data);

  const dataWithIds = transformedData.map((item: GameSaveResponse) => ({
    id: item.metadata.id, // use a fallback if no real id
    ...item,
  }));

  return {
    data: dataWithIds,
    total: dataWithIds.length,
  };
};

const getGameSaves = async (sort: SortPayload | undefined) => {
  // Regular list endpoint
  const sortQuery = buildSortQuery(sort);
  const url = `${API_URL}/admin/game_save${sortQuery ? `?${sortQuery}` : ""}`;

  const { json } = await httpClient(url);
  const data = extractApiResponseData<GameSaveResponse[]>(json);
  const transformedData = transformJavaResponse(data);

  const dataWithIds = transformedData.map((item: GameSaveResponse) => ({
    id: item.metadata.id, // use a fallback if no real id
    ...item,
  }));

  return {
    data: dataWithIds,
    total: dataWithIds.length,
  };
};

export const gameSavesResource = {
  getList: async (params: GetListParams) => {
    const { sort, filter } = params;

    // Use search endpoint if filters are provided
    if (filter && Object.keys(filter).length > 0) {
      return await searchGameSaves(sort, filter);
    }
    return await getGameSaves(sort);
  },

  getOne: async (params: GetOneParams) => {
    const url = `${API_URL}/admin/game_save/id/${params.id}`;
    const { json } = await httpClient(url);
    const data = extractApiResponseData<GameSaveResponse>(json);
    const transformedData = transformJavaResponse(data);
    transformedData.id = transformedData.metadata.id; // Ensure id field is set
    return { data: transformedData };
  },

  create: async (params: CreateParams) => {
    const url = `${API_URL}/admin/game_save`;
    const { json } = await httpClient(url, {
      method: "POST",
      body: JSON.stringify(params.data),
    });
    const data = extractApiResponseData<GameSaveResponse>(json);
    const transformedData = transformJavaResponse(data);
    return { data: transformedData };
  },

  update: async (params: UpdateParams) => {
    const url = `${API_URL}/admin/game_save/id/${params.id}`;
    const { json } = await httpClient(url, {
      method: "POST", // Backend uses POST for updates
      body: JSON.stringify(params.data),
    });
    const data = extractApiResponseData<GameSaveResponse>(json);
    const transformedData = transformJavaResponse(data);

    return { data: transformedData };
  },

  delete: async (params: DeleteParams) => {
    const url = `${API_URL}/admin/game_save/id/${params.id}`;
    await httpClient(url, { method: "DELETE" });

    return { data: params.previousData };
  },

  // Custom method to get user's game saves
  getUserGameSaves: async (username: string) => {
    const url = `${API_URL}/admin/game_save/user/${encodeURIComponent(username)}`;
    const { json } = await httpClient(url);
    const data = extractApiResponseData<GameSaveResponse[]>(json);
    return transformJavaResponse(data);
  },
};
