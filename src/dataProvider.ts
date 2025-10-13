import simpleRestProvider from "ra-data-simple-rest";
import { keycloak } from "./auth/keycloakAuthProvider";
import { fetchUtils } from "react-admin";

// Create a custom httpClient that includes authentication headers
const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  // Add authentication header if token is available
  if (keycloak.token) {
    (options.headers as Headers).set(
      "Authorization",
      `Bearer ${keycloak.token}`,
    );
  }

  return fetchUtils.fetchJson(url, options);
};

export const dataProvider = simpleRestProvider(
  import.meta.env.VITE_SIMPLE_REST_URL,
  httpClient,
);
