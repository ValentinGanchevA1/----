import { User } from '@/types';

// Placeholder data
const mockUsers: User[] = [
  { id: '1', username: 'Alice', email: 'alice@example.com', latitude: 34.0522, longitude: -118.2437 },
  { id: '2', username: 'Bob', email: 'bob@example.com', latitude: 34.055, longitude: -118.25 },
];

export const searchUsers = async (params: { latitude: number; longitude: number; radius: number }): Promise<{ data: { items: User[] } }> => {
  console.log('Searching for users with params:', params);
  // In a real app, this would be an API call.
  return Promise.resolve({ data: { items: mockUsers } });
};
