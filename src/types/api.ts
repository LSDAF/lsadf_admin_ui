// API Response types matching the Java backend structure
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export const isResponseSuccess = (response: ApiResponse<any>): boolean => {
  console.log(response);
  return response && response.status == 200;
};

// User types
export interface UserResponse {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserCreationRequest {
  username: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
}

export interface AdminUserUpdateRequest {
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
}

// Game Save types
export interface GameSaveResponse {
  id: string;
  name: string;
  username: string;
  gold: number;
  healthPoints: number;
  attack: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminGameSaveCreationRequest {
  name: string;
  username: string;
  gold?: number;
  healthPoints?: number;
  attack?: number;
}

export interface AdminGameSaveUpdateRequest {
  name?: string;
  gold?: number;
  healthPoints?: number;
  attack?: number;
}

// Inventory types
export interface ItemResponse {
  clientId: string;
  itemType: string;
  quantity: number;
  characteristics?: Record<string, any>;
}

export interface ItemRequest {
  clientId: string;
  itemType: string;
  quantity: number;
  characteristics?: Record<string, any>;
}

// Search types
export interface SearchRequest {
  searchTerms?: Record<string, any>;
  filters?: Record<string, any>;
}
