import React from "react";
import {AuthRequirement} from "./authTypes";
import {useAuthConfig} from "./AuthConfigContext";
import {StackScreenProps} from "@react-navigation/stack";


interface WithAuthGuardOptions {
    authRequirement?: AuthRequirement;
}

export function withAuthGuard<P extends Partial<StackScreenProps<any>>>(
    WrappedComponent: React.ComponentType<P>,
    options: WithAuthGuardOptions = {authRequirement: AuthRequirement.Authenticated}
): React.ComponentType<P> {
    const {authRequirement} = options;

    return (props: P) => {
        const {
                  getAuthState,
                  unauthenticatedAction,
                  authenticatedAction
              } = useAuthConfig();

        const isAuthenticated = getAuthState();

        // Use a ref to prevent multiple redirects
        const hasRedirectedRef = React.useRef(false);

        if (authRequirement === AuthRequirement.Authenticated && !isAuthenticated) {
            if (!hasRedirectedRef.current) {
                hasRedirectedRef.current = true;
                unauthenticatedAction();
            }
            return null;
        }

        if (authRequirement === AuthRequirement.Unauthenticated && isAuthenticated) {
            if (!hasRedirectedRef.current) {
                hasRedirectedRef.current = true;
                authenticatedAction();
            }
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}
