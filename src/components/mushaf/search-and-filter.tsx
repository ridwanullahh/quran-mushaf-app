import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onSortChange?: (sort: 'number' | 'page') => void;
  currentSort?: 'number' | 'page';
  totalResults?: number;
  placeholder?: string;
  className?: string;
}

export function SearchAndFilter({ 
  onSearch, 
  onSortChange, 
  currentSort = 'number',
  totalResults = 0,
  placeholder = "Search in Quran...",
  className 
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSortChange = (value: 'number' | 'page') => {
    onSortChange?.(value);
  };

  return (
    <div className={`flex items-center space-x-4 p-4 bg-gray-50 rounded-lg ${className}`}>
      <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>
      
      {onSortChange && (
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">By Verse Number</SelectItem>
              <SelectItem value="page">By Page Number</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {totalResults > 0 && (
        <div className="text-sm text-gray-600">
          {totalResults} results
        </div>
      )}
    </div>
  );
}