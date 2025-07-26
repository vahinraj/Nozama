import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/hooks/useProducts';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { ProductSort } from './ProductSort';
import { SearchBar } from './SearchBar';
import { CartDrawer } from './CartDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Filter, Grid3X3, Grid2X2, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getCategoryName, getBrandFromTitle, isInStock, isFeatured } from '@/utils/productUtils';

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-desc' | 'featured';

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  rating: number;
  brands: string[];
  inStock: boolean;
}

export const ProductCatalog = () => {
  const { products, loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [gridSize, setGridSize] = useState<'small' | 'large'>('large');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
    brands: [],
    inStock: false,
  });

  // Process products to get categories and brands
  const { categories, brands, maxPrice } = useMemo(() => {
    if (!products.length) return { categories: [], brands: [], maxPrice: 1000 };
    
    const categorySet = new Set(products.map(p => getCategoryName(p.category)));
    const brandSet = new Set(products.map(p => getBrandFromTitle(p.title)));
    const priceArray = products.map(p => p.price);
    const maxPrice = Math.max(...priceArray);
    
    return {
      categories: Array.from(categorySet),
      brands: Array.from(brandSet),
      maxPrice: Math.ceil(maxPrice)
    };
  }, [products]);

  // Update price range when max price changes
  useEffect(() => {
    if (maxPrice > 0 && filters.priceRange[1] === 1000) {
      setFilters(prev => ({
        ...prev,
        priceRange: [0, Math.ceil(maxPrice * 83)]
      }));
    }
  }, [maxPrice]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Search query filter
      if (searchQuery && 
          !product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !getBrandFromTitle(product.title).toLowerCase().includes(searchQuery.toLowerCase()) &&
          !getCategoryName(product.category).toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && 
          !filters.categories.includes(getCategoryName(product.category))) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && 
          !filters.brands.includes(getBrandFromTitle(product.title))) {
        return false;
      }

      // Price range filter - Fixed to use actual price values
      const priceInINR = product.price * 83;
      if (priceInINR < filters.priceRange[0] || priceInINR > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (product.rating.rate < filters.rating) {
        return false;
      }

      // In stock filter
      if (filters.inStock && !isInStock(product)) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'rating-desc':
          return b.rating.rate - a.rating.rate;
        case 'featured':
          return (isFeatured(b) ? 1 : 0) - (isFeatured(a) ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, Math.ceil(maxPrice * 83)],
      rating: 0,
      brands: [],
      inStock: false,
    });
    setSearchQuery('');
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < Math.ceil(maxPrice * 83) ||
    filters.rating > 0 ||
    filters.inStock ||
    searchQuery.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">Error loading products</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                TechStore
              </h1>
            </div>
            <div className="flex items-center justify-center w-full max-w-2xl">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
            <p className="text-muted-foreground text-center">
              Discover amazing products from around the world
            </p>
            <div className="flex items-center gap-4">
              <CartDrawer />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              categories={categories}
              brands={brands}
              maxPrice={maxPrice}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-card rounded-lg shadow-[--shadow-card]">
              <div className="flex items-center gap-4">
                {/* Mobile Filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                          !
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <ProductFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClearFilters={clearFilters}
                      categories={categories}
                      brands={brands}
                      maxPrice={maxPrice}
                    />
                  </SheetContent>
                </Sheet>

                {/* Results count */}
                <div className="text-sm text-muted-foreground">
                  {filteredAndSortedProducts.length} products found
                  {hasActiveFilters && (
                    <Button
                      variant="link"
                      className="h-auto p-0 ml-2 text-primary"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Grid Size Toggle */}
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={gridSize === 'large' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setGridSize('large')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={gridSize === 'small' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setGridSize('small')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Sort */}
                <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {filters.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
                {filters.brands.map((brand) => (
                  <Badge key={brand} variant="secondary">
                    {brand}
                  </Badge>
                ))}
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < Math.ceil(maxPrice * 83)) && (
                  <Badge variant="secondary">
                    ₹{filters.priceRange[0].toLocaleString('en-IN')} - ₹{filters.priceRange[1].toLocaleString('en-IN')}
                  </Badge>
                )}
                {filters.rating > 0 && (
                  <Badge variant="secondary">
                    {filters.rating}+ stars
                  </Badge>
                )}
                {filters.inStock && (
                  <Badge variant="secondary">
                    In Stock Only
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  gridSize === 'large'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                }`}
              >
                {filteredAndSortedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};