import { ApiResponse, isResponseSuccess } from "../types/api";

/**
 * Extracts data from the Java ApiResponse wrapper format
 */
export const extractApiResponseData = <T>(response: any): T => {
  // If response is already unwrapped or doesn't have the ApiResponse structure
  if (!response || typeof response !== "object") {
    return response;
  }

  // Check if it's wrapped in ApiResponse format
  if ("data" in response) {
    const apiResponse = response as ApiResponse<T>;
    if (!isResponseSuccess(apiResponse)) {
      throw new Error(apiResponse?.message);
    }
    return apiResponse.data;
  }

  // Return as-is if not wrapped
  return response;
};

/**
 * Transforms Java naming conventions to JavaScript camelCase
 */
export const transformJavaResponse = <T>(data: any): T => {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformJavaResponse(item)) as unknown as T;
  }

  const transformed: any = {};

  for (const [key, value] of Object.entries(data)) {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );

    if (value && typeof value === "object" && !Array.isArray(value)) {
      transformed[camelKey] = transformJavaResponse(value);
    } else if (Array.isArray(value)) {
      transformed[camelKey] = value.map((item) =>
        typeof item === "object" ? transformJavaResponse(item) : item,
      );
    } else {
      transformed[camelKey] = value;
    }
  }

  return transformed;
};
