import { SortOption } from '@/components/ProductCatalog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

interface ProductSortProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const ProductSort = ({ sortBy, onSortChange }: ProductSortProps) => {
  const sortOptions = [
    { value: 'featured' as SortOption, label: 'Featured' },
    { value: 'price-asc' as SortOption, label: 'Price: Low to High' },
    { value: 'price-desc' as SortOption, label: 'Price: High to Low' },
    { value: 'name-asc' as SortOption, label: 'Name: A to Z' },
    { value: 'name-desc' as SortOption, label: 'Name: Z to A' },
    { value: 'rating-desc' as SortOption, label: 'Highest Rated' },
  ];

  return (
    <div className="flex items-center gap-3">
      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select sorting option" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};