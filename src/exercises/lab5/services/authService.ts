export interface User {
    id: string;
    username: string;
    email: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        // Simulate network delay
        await sleep(1500);

        // Simple mock validation (any password works for demo)
        if (username && password) {
            return {
                user: {
                    id: '1',
                    username: username,
                    email: `${username}@example.com`,
                },
                token: 'mock-jwt-token-' + Math.random().toString(36).substring(7),
            };
        }
        throw new Error('Invalid credentials');
    },

    logout: async (): Promise<void> => {
        await sleep(500);
    }
};
