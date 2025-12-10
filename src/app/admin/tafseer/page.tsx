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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Trash2, Search, Filter, Edit, BookOpen, Hash } from 'lucide-react';
import { QuranWord, Tafseer, Surah, Ayah } from '@/types';

interface TafseerWithContext extends Tafseer {
  surah: Surah;
  ayah: Ayah;
  words: QuranWord[];
}

export default function TafseerAdmin() {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState('');
  const [selectedTafseerType, setSelectedTafseerType] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTafseer, setEditingTafseer] = useState<TafseerWithContext | null>(null);
  const [formData, setFormData] = useState({
    tafseer_text: '',
    tafseer_source: '',
    scholar: '',
    language_code: language,
    tafseer_type: 'exegesis',
    confidence_score: 0.9,
    references: '',
    notes: '',
  });

  // Mock data - In production, this would come from API
  const [tafseerItems] = useState<TafseerWithContext[]>([
    {
      id: '1',
      surah_number: 1,
      ayah_number: 1,
      word_position: 1,
      tafseer_text: 'The verse begins with the declaration of the oneness of Allah, emphasizing that all forms of worship and devotion should be directed solely to Allah. The name "Ar-Rahman" (The Most Gracious) indicates Allah\'s infinite mercy and generosity, while "Ar-Raheem" (The Most Merciful) refers to His specific mercy upon His servants.',
      tafseer_source: 'Tafsir Ibn Kathir',
      scholar: 'Ibn Kathir',
      language_code: 'en',
      tafseer_type: 'exegesis',
      confidence_score: 0.95,
      references: 'Quran 1:1, Hadith Bukhari 1123',
      notes: 'Key verse for understanding Allah\'s attributes',
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
      tafseer_text: 'This is Ayat al-Kursi, the most magnificent verse in the Quran. It establishes the fundamental concept of Allah\'s sovereignty, eternal existence, and absolute authority. The verse declares that Allah is self-subsisting and the source of all existence, emphasizing His independence from any need while all creation depends upon Him.',
      tafseer_source: 'Tafsir al-Jalalayn',
      scholar: 'Jalal ad-Din al-Mahalli',
      language_code: 'en',
      tafseer_type: 'exegesis',
      confidence_score: 0.98,
      references: 'Quran 2:255, Sahih Muslim 908',
      notes: 'Most important verse in Quran',
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

  const filteredTafseer = tafseerItems.filter((item) => {
    const matchesSearch = item.tafseer_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.scholar.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tafseer_source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSurah = !selectedSurah || item.surah_number.toString() === selectedSurah;
    const matchesType = !selectedTafseerType || item.tafseer_type === selectedTafseerType;
    return matchesSearch && matchesSurah && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTafseer) {
      console.log('Updating tafseer:', editingTafseer.id, formData);
    } else {
      console.log('Creating new tafseer:', formData);
    }
    
    setIsDialogOpen(false);
    setEditingTafseer(null);
    setFormData({
      tafseer_text: '',
      tafseer_source: '',
      scholar: '',
      language_code: language,
      tafseer_type: 'exegesis',
      confidence_score: 0.9,
      references: '',
      notes: '',
    });
  };

  const handleEdit = (tafseer: TafseerWithContext) => {
    setEditingTafseer(tafseer);
    setFormData({
      tafseer_text: tafseer.tafseer_text,
      tafseer_source: tafseer.tafseer_source,
      scholar: tafseer.scholar,
      language_code: tafseer.language_code,
      tafseer_type: tafseer.tafseer_type,
      confidence_score: tafseer.confidence_score,
      references: tafseer.references || '',
      notes: tafseer.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('admin.confirm_delete'))) {
      console.log('Deleting tafseer:', id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-amber-900">
                {t('admin.tafseer_management')}
              </h1>
              <p className="text-amber-700">
                {t('admin.tafseer_desc')}
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
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTafseer ? t('admin.edit_tafseer') : t('admin.add_tafseer')}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">{t('admin.content')}</TabsTrigger>
                    <TabsTrigger value="source">{t('admin.source')}</TabsTrigger>
                    <TabsTrigger value="details">{t('admin.details')}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="space-y-4">
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
                      <Label htmlFor="tafseer_text">{t('admin.tafseer_text')} *</Label>
                      <Textarea
                        id="tafseer_text"
                        value={formData.tafseer_text}
                        onChange={(e) => setFormData({ ...formData, tafseer_text: e.target.value })}
                        placeholder={t('admin.enter_tafseer')}
                        required
                        rows={8}
                        className="text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tafseer_type">{t('admin.tafseer_type')}</Label>
                      <Select
                        value={formData.tafseer_type}
                        onValueChange={(value) => setFormData({ ...formData, tafseer_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exegesis">{t('admin.exegesis')}</SelectItem>
                          <SelectItem value="commentary">{t('admin.commentary')}</SelectItem>
                          <SelectItem value="explanation">{t('admin.explanation')}</SelectItem>
                          <SelectItem value="interpretation">{t('admin.interpretation')}</SelectItem>
                          <SelectItem value="verse_meaning">{t('admin.verse_meaning')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="source" className="space-y-4">
                    <div>
                      <Label htmlFor="tafseer_source">{t('admin.tafseer_source')} *</Label>
                      <Select
                        value={formData.tafseer_source}
                        onValueChange={(value) => setFormData({ ...formData, tafseer_source: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('admin.select_tafseer_source')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tafsir Ibn Kathir">Tafsir Ibn Kathir</SelectItem>
                          <SelectItem value="Tafsir al-Jalalayn">Tafsir al-Jalalayn</SelectItem>
                          <SelectItem value="Tafsir al-Tabari">Tafsir al-Tabari</SelectItem>
                          <SelectItem value="Tafsir al-Qurtubi">Tafsir al-Qurtubi</SelectItem>
                          <SelectItem value="Tafsir al-Mizan">Tafsir al-Mizan</SelectItem>
                          <SelectItem value="Tafsir al-Kashif">Tafsir al-Kashif</SelectItem>
                          <SelectItem value="Modern Commentary">Modern Commentary</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="scholar">{t('admin.scholar')} *</Label>
                      <Input
                        id="scholar"
                        value={formData.scholar}
                        onChange={(e) => setFormData({ ...formData, scholar: e.target.value })}
                        placeholder={t('admin.scholar_name')}
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

                    <div>
                      <Label htmlFor="references">{t('admin.references')}</Label>
                      <Textarea
                        id="references"
                        value={formData.references}
                        onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                        placeholder={t('admin.references_placeholder')}
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4">
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
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit">
                    {editingTafseer ? t('common.update') : t('common.create')}
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
                  placeholder={t('admin.search_tafseer')}
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

            <Select value={selectedTafseerType} onValueChange={setSelectedTafseerType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t('admin.filter_type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('admin.all_types')}</SelectItem>
                <SelectItem value="exegesis">{t('admin.exegesis')}</SelectItem>
                <SelectItem value="commentary">{t('admin.commentary')}</SelectItem>
                <SelectItem value="explanation">{t('admin.explanation')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Tafseer Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.surah_ayah')}</TableHead>
                  <TableHead>{t('admin.arabic_text')}</TableHead>
                  <TableHead>{t('admin.tafseer_preview')}</TableHead>
                  <TableHead>{t('admin.scholar')}</TableHead>
                  <TableHead>{t('admin.source')}</TableHead>
                  <TableHead>{t('admin.type')}</TableHead>
                  <TableHead>{t('admin.confidence')}</TableHead>
                  <TableHead>{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTafseer.map((tafseer) => (
                  <TableRow key={tafseer.id}>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {tafseer.surah.name}
                        </div>
                        <div className="text-gray-500">
                          Ayah {tafseer.ayah_number}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-arabic text-right text-lg text-amber-900">
                        {tafseer.ayah.text}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-3">
                          {tafseer.tafseer_text}
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {tafseer.scholar}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {tafseer.tafseer_source}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {tafseer.tafseer_type}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          tafseer.confidence_score >= 0.9 ? 'bg-green-500' :
                          tafseer.confidence_score >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm">
                          {Math.round(tafseer.confidence_score * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(tafseer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(tafseer.id)}
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
          
          {filteredTafseer.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t('admin.no_tafseer_found')}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}