import Keycloak, {KeycloakInitOptions} from "keycloak-js";
import {keycloakAuthProvider} from "ra-keycloak";
import type {KeycloakUser} from "./types";

// Initialize Keycloak instance
export const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

// Configure Keycloak initialization options
const keycloakInitOptions: KeycloakInitOptions = {
    onLoad: "login-required" as const,
    //checkLoginIframe: false,
    //pkceMethod: "S256" as const,
    flow: "standard" as const,
    redirectUri: import.meta.env.VITE_LSADF_ADMIN_UI_URL,
};

// Helper function to extract user profile from Keycloak
const getUserProfile = (): KeycloakUser | null => {
    if (!keycloak.tokenParsed || !keycloak.authenticated) {
        return null;
    }

    const token = keycloak.tokenParsed;
    return {
        id: token.sub || "",
        username: token.preferred_username || "",
        email: token.email,
        firstName: token.given_name,
        lastName: token.family_name,
        emailVerified: token.email_verified || false,
        roles: token.realm_access?.roles || [],
    };
};

// Create the authentication provider
export const authProvider = keycloakAuthProvider(keycloak, {
    initOptions: keycloakInitOptions,
    loginRedirectUri: import.meta.env.VITE_LSADF_ADMIN_UI_URL,
    onPermissions: (token) => {
        // Extract roles from token for permission management
        const roles = token?.realm_access?.roles || [];
        return Promise.resolve(roles);
    },
});

export {getUserProfile};
