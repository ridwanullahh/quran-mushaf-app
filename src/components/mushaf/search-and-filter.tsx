import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  className?: string;
}

export function SearchAndFilter({ onSearch, onFilterChange, className }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onFilterChange(value);
  };

  return (
    <div className={`flex items-center space-x-4 p-4 bg-gray-50 rounded-lg ${className}`}>
      <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search in Quran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>
      
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={selectedFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ayahs</SelectItem>
            <SelectItem value="short">Short Ayahs</SelectItem>
            <SelectItem value="long">Long Ayahs</SelectItem>
            <SelectItem value="with-tajweed">With Tajweed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}