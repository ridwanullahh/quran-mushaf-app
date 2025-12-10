'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, Trash2, Search, Filter, BookOpen, Eye } from 'lucide-react';
import { QuranWord, Translation, Surah, Ayah } from '@/types';

interface TranslationWithContext extends Translation {
  surah: Surah;
  ayah: Ayah;
  words: QuranWord[];
}

export default function TranslationsAdmin() {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState('');
  const [selectedAyah, setSelectedAyah] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<TranslationWithContext | null>(null);
  const [formData, setFormData] = useState({
    translation_text: '',
    translator: '',
    language_code: language,
    confidence_score: 0.9,
    notes: '',
  });

  // Mock data - In production, this would come from API
  const [translations] = useState<TranslationWithContext[]>([
    {
      id: '1',
      surah_number: 1,
      ayah_number: 1,
      word_position: 1,
      translation_text: 'In the name of Allah, the Most Gracious, the Most Merciful',
      translator: 'Dr. Muhammad Ali',
      language_code: 'en',
      confidence_score: 0.98,
      notes: 'Standard translation by Dr. Muhammad Ali',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      surah: { number: 1, name: 'Al-Fatihah', arabic_name: 'الفاتحة', revelation_place: 'Makkah', ayahs_count: 7 },
      ayah: { number: 1, text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', words_count: 4 },
      words: [
        { position: 1, text: 'بِسْمِ', root: 'س م و', transliteration: 'Bismi', morphology: 'noun:genitive:3rd person', meaning: 'In the name' }
      ]
    },
    {
      id: '2',
      surah_number: 2,
      ayah_number: 255,
      word_position: 1,
      translation_text: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence',
      translator: 'Dr. Muhammad Ali',
      language_code: 'en',
      confidence_score: 0.95,
      notes: 'Ayat al-Kursi - key verse',
      created_at: '2024-01-15T11:00:00Z',
      updated_at: '2024-01-15T11:00:00Z',
      surah: { number: 2, name: 'Al-Baqarah', arabic_name: 'البقرة', revelation_place: 'Madinah', ayahs_count: 286 },
      ayah: { number: 255, text: 'ٱللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ', words_count: 7 },
      words: [
        { position: 1, text: 'ٱللَّهُ', root: 'إ ل ه', transliteration: 'Allahu', morphology: 'noun:nominative:3rd person', meaning: 'Allah' }
      ]
    }
  ]);

  const [surahs] = useState<Surah[]>([
    { number: 1, name: 'Al-Fatihah', arabic_name: 'الفاتحة', revelation_place: 'Makkah', ayahs_count: 7 },
    { number: 2, name: 'Al-Baqarah', arabic_name: 'البقرة', revelation_place: 'Madinah', ayahs_count: 286 },
    { number: 3, name: 'Al-Imran', arabic_name: 'آل عمران', revelation_place: 'Madinah', ayahs_count: 200 },
  ]);

  const filteredTranslations = translations.filter((translation) => {
    const matchesSearch = translation.translation_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         translation.translator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSurah = !selectedSurah || translation.surah_number.toString() === selectedSurah;
    return matchesSearch && matchesSurah;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTranslation) {
      // Update existing translation
      console.log('Updating translation:', editingTranslation.id, formData);
    } else {
      // Create new translation
      console.log('Creating new translation:', formData);
    }
    
    setIsDialogOpen(false);
    setEditingTranslation(null);
    setFormData({
      translation_text: '',
      translator: '',
      language_code: language,
      confidence_score: 0.9,
      notes: '',
    });
  };

  const handleEdit = (translation: TranslationWithContext) => {
    setEditingTranslation(translation);
    setFormData({
      translation_text: translation.translation_text,
      translator: translation.translator,
      language_code: translation.language_code,
      confidence_score: translation.confidence_score,
      notes: translation.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('admin.confirm_delete'))) {
      console.log('Deleting translation:', id);
      // API call to delete translation
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-amber-900">
                {t('admin.translations_management')}
              </h1>
              <p className="text-amber-700">
                {t('admin.translations_desc')}
              </p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('common.add_new')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTranslation ? t('admin.edit_translation') : t('admin.add_translation')}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="surah">{t('admin.surah')}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.select_surah')} />
                      </SelectTrigger>
                      <SelectContent>
                        {surahs.map((surah) => (
                          <SelectItem key={surah.number} value={surah.number.toString()}>
                            {surah.number}. {surah.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="ayah">{t('admin.ayah')}</Label>
                    <Input
                      id="ayah"
                      type="number"
                      min="1"
                      max={selectedSurah === '1' ? 7 : 286}
                      placeholder={t('admin.ayah_number')}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="translation_text">{t('admin.translation_text')} *</Label>
                  <Textarea
                    id="translation_text"
                    value={formData.translation_text}
                    onChange={(e) => setFormData({ ...formData, translation_text: e.target.value })}
                    placeholder={t('admin.enter_translation')}
                    required
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="translator">{t('admin.translator')} *</Label>
                    <Input
                      id="translator"
                      value={formData.translator}
                      onChange={(e) => setFormData({ ...formData, translator: e.target.value })}
                      placeholder={t('admin.translator_name')}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="language_code">{t('admin.language')}</Label>
                    <Select
                      value={formData.language_code}
                      onValueChange={(value) => setFormData({ ...formData, language_code: value })}
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
                </div>

                <div>
                  <Label htmlFor="confidence_score">
                    {t('admin.confidence_score')} ({Math.round(formData.confidence_score * 100)}%)
                  </Label>
                  <Input
                    id="confidence_score"
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={formData.confidence_score}
                    onChange={(e) => setFormData({ ...formData, confidence_score: parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">{t('admin.notes')}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={t('admin.additional_notes')}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit">
                    {editingTranslation ? t('common.update') : t('common.create')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm border-amber-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('admin.search_translations')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedSurah} onValueChange={setSelectedSurah}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('admin.filter_surah')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('admin.all_surahs')}</SelectItem>
                {surahs.map((surah) => (
                  <SelectItem key={surah.number} value={surah.number.toString()}>
                    {surah.number}. {surah.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Translations Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.surah_ayah')}</TableHead>
                  <TableHead>{t('admin.arabic_text')}</TableHead>
                  <TableHead>{t('admin.translation_text')}</TableHead>
                  <TableHead>{t('admin.translator')}</TableHead>
                  <TableHead>{t('admin.language')}</TableHead>
                  <TableHead>{t('admin.confidence')}</TableHead>
                  <TableHead>{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTranslations.map((translation) => (
                  <TableRow key={translation.id}>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {translation.surah.name}
                        </div>
                        <div className="text-gray-500">
                          Ayah {translation.ayah_number}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-arabic text-right text-lg text-amber-900">
                        {translation.ayah.text}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-3">
                          {translation.translation_text}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {translation.translator}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline">
                        {translation.language_code.toUpperCase()}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          translation.confidence_score >= 0.9 ? 'bg-green-500' :
                          translation.confidence_score >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm">
                          {Math.round(translation.confidence_score * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(translation)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(translation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredTranslations.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t('admin.no_translations_found')}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}