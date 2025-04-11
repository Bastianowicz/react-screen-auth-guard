import React, { useEffect, useRef } from "react";
import { AuthRequirement } from "./authTypes";
import { useAuthConfig } from "./AuthConfigContext";
import { StackScreenProps } from "@react-navigation/stack";
import { useIsFocused } from "@react-navigation/native";

interface WithAuthGuardOptions {
    authRequirement?: AuthRequirement;
}

export function withAuthGuard<P extends Partial<StackScreenProps<any>>>(
    WrappedComponent: React.ComponentType<P>,
    options: WithAuthGuardOptions = { authRequirement: AuthRequirement.Authenticated }
): React.ComponentType<P> {
    const { authRequirement } = options;

    return (props: P) => {
        const { getAuthState, unauthenticatedAction, authenticatedAction } = useAuthConfig();
        const isAuthenticated = getAuthState();
        const isFocused = useIsFocused();

        const hasRedirectedRef = useRef(false);

        useEffect(() => {
            if (!isFocused || hasRedirectedRef.current) return;

            if (authRequirement === AuthRequirement.Authenticated && !isAuthenticated) {
                hasRedirectedRef.current = true;
                unauthenticatedAction();
            }

            if (authRequirement === AuthRequirement.Unauthenticated && isAuthenticated) {
                hasRedirectedRef.current = true;
                authenticatedAction();
            }
        }, [isAuthenticated, isFocused]);

        if (
            (authRequirement === AuthRequirement.Authenticated && !isAuthenticated) ||
            (authRequirement === AuthRequirement.Unauthenticated && isAuthenticated)
        ) {
            // Screen is not allowed → don't render anything
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}