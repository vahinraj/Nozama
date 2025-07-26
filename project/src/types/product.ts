export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  brand: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
}

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  rating: number;
  brands: string[];
  inStock: boolean;
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-desc' | 'featured';