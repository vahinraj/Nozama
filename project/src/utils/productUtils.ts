import { Product } from '@/hooks/useProducts';

export const getCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    "men's clothing": "Men's Fashion",
    "women's clothing": "Women's Fashion",
    "jewelery": "Jewelry",
    "electronics": "Electronics"
  };
  
  return categoryMap[category] || category;
};

export const getBrandFromTitle = (title: string): string => {
  // Extract potential brand names from product titles
  const commonBrands = [
    'SanDisk', 'Samsung', 'WD', 'Seagate', 'Acer', 'ASUS', 
    'Fjallraven', 'John Hardy', 'Opna', 'DANVOUY', 'Lock and Love',
    'Rain Jacket', 'MBJ', 'Solid Gold Petite', 'White Gold Plated',
    'Pierced Owl', 'BIYLACLESEN'
  ];
  
  for (const brand of commonBrands) {
    if (title.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  
  // If no known brand, extract first word(s) as potential brand
  const words = title.split(' ');
  if (words.length > 1) {
    return words[0];
  }
  
  return 'Generic';
};

export const isInStock = (product: Product): boolean => {
  // Simulate stock based on rating count - higher rated products more likely in stock
  return product.rating.count > 50;
};

export const getDiscountPrice = (price: number, category: string): number | null => {
  // Simulate discounts for certain categories
  const discountCategories = ["men's clothing", "women's clothing"];
  
  if (discountCategories.includes(category) && Math.random() > 0.5) {
    return Math.round(price * 1.2 * 100) / 100; // 20% discount simulation
  }
  
  return null;
};

export const isFeatured = (product: Product): boolean => {
  // Mark products as featured based on high ratings
  return product.rating.rate >= 4.0 && product.rating.count >= 100;
};