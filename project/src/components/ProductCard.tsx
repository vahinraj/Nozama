import { Product } from '@/hooks/useProducts';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { getCategoryName, getBrandFromTitle, isInStock, getDiscountPrice, isFeatured } from '@/utils/productUtils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  
  const brand = getBrandFromTitle(product.title);
  const inStock = isInStock(product);
  const featured = isFeatured(product);
  const originalPrice = getDiscountPrice(product.price, product.category);
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : index < rating
            ? 'text-yellow-400 fill-yellow-400/50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="product-card overflow-hidden group">
      {/* Image Container */}
      <div className="relative aspect-square p-4 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {featured && (
            <Badge className="bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 text-white">
              -{discountPercentage}%
            </Badge>
          )}
          {!inStock && (
            <Badge variant="secondary" className="bg-gray-500 text-white">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-300 opacity-0 group-hover:opacity-100"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${
              isWishlisted
                ? 'text-red-500 fill-red-500'
                : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <p className="text-sm text-muted-foreground font-medium">
          {brand}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(product.rating.rate)}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating.rate} ({product.rating.count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold price-current">
            ₹{(product.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          {originalPrice && (
            <span className="text-lg price-original line-through">
              ₹{(originalPrice * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Add to Cart Button */}
        <Button
          className="w-full mt-4 shadow-[--shadow-button] hover:shadow-lg transition-all duration-300"
          disabled={!inStock}
          onClick={() => addToCart(product)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
};