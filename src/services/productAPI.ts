import { Product } from '@/types';

// Placeholder data
const mockProducts: Product[] = [
  { id: 'p1', name: 'Vintage Camera', price: 150, latitude: 34.05, longitude: -118.24 },
  { id: 'p2', name: 'Acoustic Guitar', price: 200, latitude: 34.058, longitude: -118.245 },
];

export const searchProducts = async (params: { latitude: number; longitude: number; radius: number }): Promise<{ data: { items: Product[] } }> => {
  console.log('Searching for products with params:', params);
  // In a real app, this would be an API call.
  return Promise.resolve({ data: { items: mockProducts } });
};
