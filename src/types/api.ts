// API Response types matching the Java backend structure
import {
  Characteristics,
  Currency,
  GameMetadata,
  Stage,
} from "../model/GameSave.ts";

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

// Game Save Types
export interface GameSaveResponse {
  metadata: GameMetadata;
  characteristics: Characteristics;
  currency: Currency;
  stage: Stage;
}

// Inventory types
export interface ItemResponse {
  clientId: string;
  itemType: string;
  quantity: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  characteristics?: Record<string, any>;
}

export interface ItemRequest {
  clientId: string;
  itemType: string;
  quantity: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  characteristics?: Record<string, any>;
}

// Java Filter structure matching backend
export interface Filter {
  type: string;
  value: string;
}

// Search types
export interface SearchRequest {
  filters?: Filter[];
}
