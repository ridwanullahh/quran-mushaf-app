'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Hash, 
  X, 
  Loader2,
  ExternalLink,
  Languages,
  GitBranch,
  Eye,
  ChevronRight
} from 'lucide-react';
import { Surah, Translation, Tafseer, Morphology } from '@/types';

interface SearchFilters {
  type: 'all' | 'translations' | 'tafseer' | 'morphology';
  surah?: number;
  language?: string;
  translator?: string;
  scholar?: string;
  root?: string;
  grammar_type?: string;
}

interface SearchResults {
  translations: Translation[];
  tafseer: Tafseer[];
  morphology: Morphology[];
  summary: {
    total: number;
    translations: number;
    tafseer: number;
    morphology: number;
  };
}

interface SearchInterfaceProps {
  onResultSelect?: (result: any, type: string) => void;
  initialQuery?: string;
}

export default function SearchInterface({ onResultSelect, initialQuery = '' }: SearchInterfaceProps) {
  const { t, language } = useTranslation();
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    language: language
  });
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [surahs] = useState<Surah[]>([
    { number: 1, name: 'Al-Fatihah', arabic_name: 'الفاتحة', revelation_place: 'Makkah', ayahs_count: 7 },
    { number: 2, name: 'Al-Baqarah', arabic_name: 'البقرة', revelation_place: 'Madinah', ayahs_count: 286 },
    { number: 3, name: 'Al-Imran', arabic_name: 'آل عمران', revelation_place: 'Madinah', ayahs_count: 200 },
    { number: 4, name: 'An-Nisa', arabic_name: 'النساء', revelation_place: 'Madinah', ayahs_count: 176 },
    { number: 5, name: 'Al-Ma\'idah', arabic_name: 'المائدة', revelation_place: 'Madinah', ayahs_count: 120 },
  ]);

  useEffect(() => {
    // Focus search input on mount
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const performSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const searchParams = new URLSearchParams({
        q: query.trim(),
        type: filters.type,
        language: filters.language || 'en',
        limit: '50'
      });

      if (filters.surah) searchParams.append('surah', filters.surah.toString());

      const response = await fetch(`/api/search?${searchParams}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Network error during search');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setError(null);
    setFilters({ type: 'all', language: language });
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleResultClick = (result: any, type: string) => {
    if (onResultSelect) {
      onResultSelect(result, type);
    }
  };

  const renderTranslationResult = (translation: Translation) => (
    <Card 
      key={translation.id} 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleResultClick(translation, 'translation')}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Languages className="h-4 w-4 text-blue-600" />
          <Badge variant="outline">{translation.language_code.toUpperCase()}</Badge>
          <span className="text-sm text-gray-600">{translation.translator}</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${
            translation.confidence_score >= 0.9 ? 'bg-green-500' :
            translation.confidence_score >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-xs text-gray-500">
            {Math.round(translation.confidence_score * 100)}%
          </span>
        </div>
      </div>
      
      <div className="font-arabic text-lg text-amber-900 mb-2">
        {translation.arabic_text}
      </div>
      
      <p className="text-sm text-gray-700 mb-2 line-clamp-2">
        {translation.translation_text}
      </p>
      
      <div className="text-xs text-gray-500">
        Surah {translation.surah_number}, Ayah {translation.ayah_number}, Word {translation.word_position}
      </div>
    </Card>
  );

  const renderTafseerResult = (tafseer: Tafseer) => (
    <Card 
      key={tafseer.id} 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleResultClick(tafseer, 'tafseer')}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-4 w-4 text-green-600" />
          <Badge variant="outline">{tafseer.language_code.toUpperCase()}</Badge>
          <span className="text-sm text-gray-600">{tafseer.scholar}</span>
          <Badge variant="secondary" className="capitalize text-xs">
            {tafseer.tafseer_type}
          </Badge>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${
            tafseer.confidence_score >= 0.9 ? 'bg-green-500' :
            tafseer.confidence_score >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-xs text-gray-500">
            {Math.round(tafseer.confidence_score * 100)}%
          </span>
        </div>
      </div>
      
      <div className="font-arabic text-lg text-amber-900 mb-2">
        {tafseer.arabic_text}
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">{tafseer.tafseer_source}</span>
      </div>
      
      <p className="text-sm text-gray-700 mb-2 line-clamp-3">
        {tafseer.tafseer_text}
      </p>
      
      <div className="text-xs text-gray-500">
        Surah {tafseer.surah_number}, Ayah {tafseer.ayah_number}, Word {tafseer.word_position}
      </div>
    </Card>
  );

  const renderMorphologyResult = (morphology: Morphology) => (
    <Card 
      key={morphology.id} 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleResultClick(morphology, 'morphology')}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-purple-600" />
          <span className="font-arabic text-lg font-bold">{morphology.word_text}</span>
          <span className="text-sm text-gray-500">{morphology.transliteration}</span>
        </div>
        <Badge variant="outline" className="font-arabic">
          {morphology.root}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
        <div>
          <span className="text-gray-600">Grammar:</span>
          <Badge variant="secondary" className="ml-1 capitalize">
            {morphology.grammar_type}
          </Badge>
        </div>
        <div>
          <span className="text-gray-600">Morphology:</span>
          <span className="ml-1">{morphology.morphology}</span>
        </div>
      </div>
      
      {morphology.etymology && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Etymology:</span> {morphology.etymology}
        </p>
      )}
      
      {morphology.semantic_field && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Semantic field:</span> {morphology.semantic_field}
        </p>
      )}
      
      <div className="text-xs text-gray-500">
        Surah {morphology.surah_number}, Ayah {morphology.ayah_number}, Word {morphology.word_position}
      </div>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-4          <Search class flex items-center">
Name="h-8 w-8 mr-3" />
          {t('common.search_quran')}
        </h1>
        <p className="text-amber-700">
          {t('common.search_quran_desc')}
        </p>
      </div>

      {/* Search Interface */}
      <Card className="p-6 mb-6">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                placeholder={t('common.search_placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-10"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Button onClick={performSearch} disabled={loading || !query.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {t('common.search')}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('common.filters')}
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="search-type">{t('common.search_type')}</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value: any) => setFilters({ ...filters, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all_types')}</SelectItem>
                    <SelectItem value="translations">{t('common.translations')}</SelectItem>
                    <SelectItem value="tafseer">{t('common.tafseer')}</SelectItem>
                    <SelectItem value="morphology">{t('common.morphology')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="search-language">{t('common.language')}</Label>
                <Select
                  value={filters.language}
                  onValueChange={(value) => setFilters({ ...filters, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="ur">اردو</SelectItem>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="tr">Türkçe</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="search-surah">{t('common.surah')}</Label>
                <Select
                  value={filters.surah?.toString() || ''}
                  onValueChange={(value) => setFilters({ ...filters, surah: value ? parseInt(value) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.all_surahs')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('common.all_surahs')}</SelectItem>
                    {surahs.map((surah) => (
                      <SelectItem key={surah.number} value={surah.number.toString()}>
                        {surah.number}. {surah.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {(filters.type === 'translations' || filters.type === 'all') && (
                <div>
                  <Label htmlFor="search-translator">{t('common.translator')}</Label>
                  <Input
                    placeholder={t('common.any_translator')}
                    value={filters.translator || ''}
                    onChange={(e) => setFilters({ ...filters, translator: e.target.value || undefined })}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Search Results */}
      {error && (
        <Card className="p-6 mb-6 border-red-200 bg-red-50">
          <div className="text-red-600">
            <strong>{t('common.error')}:</strong> {error}
          </div>
        </Card>
      )}

      {results && !loading && (
        <div className="space-y-6">
          {/* Results Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {t('common.search_results')} ({results.summary.total})
              </h2>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <Languages className="h-4 w-4 mr-1 text-blue-600" />
                  <span>{results.summary.translations} {t('common.translations')}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1 text-green-600" />
                  <span>{results.summary.tafseer} {t('common.tafseer')}</span>
                </div>
                <div className="flex items-center">
                  <Hash className="h-4 w-4 mr-1 text-purple-600" />
                  <span>{results.summary.morphology} {t('common.morphology')}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Results Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                {t('common.all_results')} ({results.summary.total})
              </TabsTrigger>
              <TabsTrigger value="translations">
                <Languages className="h-4 w-4 mr-1" />
                {t('common.translations')} ({results.summary.translations})
              </TabsTrigger>
              <TabsTrigger value="tafseer">
                <BookOpen className="h-4 w-4 mr-1" />
                {t('common.tafseer')} ({results.summary.tafseer})
              </TabsTrigger>
              <TabsTrigger value="morphology">
                <Hash className="h-4 w-4 mr-1" />
                {t('common.morphology')} ({results.summary.morphology})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {results.translations.map(renderTranslationResult)}
                {results.tafseer.map(renderTafseerResult)}
                {results.morphology.map(renderMorphologyResult)}
              </div>
              {results.summary.total === 0 && (
                <Card className="p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('common.no_results_found')}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {t('common.try_different_terms')}
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="translations">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {results.translations.map(renderTranslationResult)}
              </div>
              {results.translations.length === 0 && (
                <Card className="p-12 text-center">
                  <Languages className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('common.no_translation_results')}</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tafseer">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {results.tafseer.map(renderTafseerResult)}
              </div>
              {results.tafseer.length === 0 && (
                <Card className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('common.no_tafseer_results')}</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="morphology">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {results.morphology.map(renderMorphologyResult)}
              </div>
              {results.morphology.length === 0 && (
                <Card className="p-12 text-center">
                  <Hash className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('common.no_morphology_results')}</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}