import React from 'react';
import {render} from '@testing-library/react';
import {AuthRequirement} from './authTypes';
import {withAuthGuard} from './withAuthGuard';

// Mock authentication-related actions
const getAuthStateMock = jest.fn();
const unauthenticatedActionMock = jest.fn();
const authenticatedActionMock = jest.fn();

// Mock the useAuthConfig hook
jest.mock('./AuthConfigContext', () => ({
    useAuthConfig: () => ({
        getAuthState: getAuthStateMock,
        unauthenticatedAction: unauthenticatedActionMock,
        authenticatedAction: authenticatedActionMock,
    }),
}));

// Mock a simple component for testing
const MockComponent: React.FC = () => <div>Protected Content</div>;

// Helper function to create the guarded component
const createGuardedComponent = (authRequirement: AuthRequirement) =>
    withAuthGuard(MockComponent, { authRequirement });

describe('withAuthGuard HOC', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test to ensure clean states
    });

    test('renders component if requirement is AUTHENTICATED and user is authenticated', () => {
        getAuthStateMock.mockReturnValueOnce(true);

        const GuardedComponent = createGuardedComponent(AuthRequirement.Authenticated);
        const { getByText } = render(<GuardedComponent />);

        expect(getByText('Protected Content')).toBeInTheDocument();
        expect(unauthenticatedActionMock).not.toHaveBeenCalled();
        expect(authenticatedActionMock).not.toHaveBeenCalled();
    });

    test('calls unauthenticated action if requirement is AUTHENTICATED and user is not authenticated', () => {
        getAuthStateMock.mockReturnValueOnce(false);

        const GuardedComponent = createGuardedComponent(AuthRequirement.Authenticated);
        render(<GuardedComponent />);

        expect(unauthenticatedActionMock).toHaveBeenCalledTimes(1);
        expect(authenticatedActionMock).not.toHaveBeenCalled();
    });

    test('renders component if requirement is UNAUTHENTICATED and user is not authenticated', () => {
        getAuthStateMock.mockReturnValueOnce(false);

        const GuardedComponent = createGuardedComponent(AuthRequirement.Unauthenticated);
        const { getByText } = render(<GuardedComponent />);

        expect(getByText('Protected Content')).toBeInTheDocument();
        expect(unauthenticatedActionMock).not.toHaveBeenCalled();
        expect(authenticatedActionMock).not.toHaveBeenCalled();
    });

    test('calls authenticated action if requirement is UNAUTHENTICATED and user is authenticated', () => {
        getAuthStateMock.mockReturnValueOnce(true);

        const GuardedComponent = createGuardedComponent(AuthRequirement.Unauthenticated);
        render(<GuardedComponent />);

        expect(authenticatedActionMock).toHaveBeenCalledTimes(1);
        expect(unauthenticatedActionMock).not.toHaveBeenCalled();
    });
});