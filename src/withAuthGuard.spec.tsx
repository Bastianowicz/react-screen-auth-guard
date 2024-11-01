import React from "react";
import {render} from "@testing-library/react-native";
import {AuthConfigProvider, AuthRequirement, withAuthGuard} from ".";

const getAuthStateMock = jest.fn();
const unauthenticatedActionMock = jest.fn();
const authenticatedActionMock = jest.fn();

const TestScreen: React.FC = () => <></>;

const WrappedAuthenticatedScreen = withAuthGuard(TestScreen, {
    authRequirement: AuthRequirement.Authenticated
});

const WrappedUnauthenticatedScreen = withAuthGuard(TestScreen, {
    authRequirement: AuthRequirement.Unauthenticated
});

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <AuthConfigProvider
            getAuthState={getAuthStateMock}
            unauthenticatedAction={unauthenticatedActionMock}
            authenticatedAction={authenticatedActionMock}
        >
            {ui}
        </AuthConfigProvider>
    );
};

describe("withAuthGuard HOC", () => {
    beforeEach(() => {
        getAuthStateMock.mockReset();
        unauthenticatedActionMock.mockReset();
        authenticatedActionMock.mockReset();
    });

    test("calls unauthenticatedAction when user is not authenticated and requirement is Authenticated", () => {
        getAuthStateMock.mockReturnValue(false);

        renderWithProviders(<WrappedAuthenticatedScreen />);

        expect(unauthenticatedActionMock).toHaveBeenCalledTimes(1);
        expect(authenticatedActionMock).not.toHaveBeenCalled();
    });

    test("calls authenticatedAction when user is authenticated and requirement is Unauthenticated", () => {
        getAuthStateMock.mockReturnValue(true);

        renderWithProviders(<WrappedUnauthenticatedScreen />);

        expect(authenticatedActionMock).toHaveBeenCalledTimes(1);
        expect(unauthenticatedActionMock).not.toHaveBeenCalled();
    });

    test("renders component when user is authenticated and requirement is Authenticated", () => {
        getAuthStateMock.mockReturnValue(true);

        const {UNSAFE_getByType} = renderWithProviders(<WrappedAuthenticatedScreen />);

        expect(UNSAFE_getByType(TestScreen)).toBeTruthy();
    });

    test("renders component when user is not authenticated and requirement is Unauthenticated", () => {
        getAuthStateMock.mockReturnValue(false);

        const {UNSAFE_getByType} = renderWithProviders(<WrappedUnauthenticatedScreen />);

        expect(UNSAFE_getByType(TestScreen)).toBeTruthy();
    });
});
