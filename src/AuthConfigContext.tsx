import React, {createContext, ReactNode, useContext} from "react";

interface AuthConfig {
    getAuthState: () => boolean;
    unauthenticatedAction: () => void;
    authenticatedAction: () => void;
}

const AuthConfigContext = createContext<AuthConfig | undefined>(undefined);

export const useAuthConfig = (): AuthConfig => {
    const context = useContext(AuthConfigContext);
    if (!context) {
        throw new Error("useAuthConfig must be used within an AuthConfigProvider");
    }
    return context;
};

export const AuthConfigProvider = ({
                                       getAuthState,
                                       unauthenticatedAction,
                                       authenticatedAction,
                                       children
                                   }: AuthConfig & {children: ReactNode}) => (
    <AuthConfigContext.Provider
        value={{getAuthState, unauthenticatedAction, authenticatedAction}}
    >
        {children}
    </AuthConfigContext.Provider>
);
