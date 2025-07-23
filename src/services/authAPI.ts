import { LoginRequest, RegisterRequest, RegisterResponse, AuthUser } from '@/types';

const mockUser: AuthUser = {
  id: 'user-123',
  username: 'testuser',
  email: 'test@example.com',
};

export const login = async (credentials: LoginRequest): Promise<RegisterResponse> => {
  console.log('Logging in with:', credentials);
  if (credentials.email && credentials.password) {
    return Promise.resolve({
      data: {
        user: { ...mockUser, email: credentials.email },
        token: 'fake-jwt-token',
      },
    });
  }
  return Promise.reject({ error: { code: 'invalid_credentials', message: 'Invalid email or password.' } });
};

export const register = async (credentials: RegisterRequest): Promise<RegisterResponse> => {
  console.log('Registering with:', credentials);
  if (credentials.email && credentials.password && credentials.username) {
    return Promise.resolve({
      data: {
        user: { ...mockUser, email: credentials.email, username: credentials.username },
        token: 'fake-jwt-token-new-user',
      },
    });
  }
  return Promise.reject({ error: { code: 'registration_failed', message: 'Could not create account.' } });
};
