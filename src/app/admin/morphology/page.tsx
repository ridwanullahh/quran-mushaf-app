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
import { Hash, Plus, Trash2, Search, Filter, Edit, BookOpen, GitBranch, Type } from 'lucide-react';
import { QuranWord, Morphology, Surah, Ayah } from '@/types';

interface MorphologyWithContext extends Morphology {
  word: QuranWord;
  surah: Surah;
  ayah: Ayah;
}

export default function MorphologyAdmin() {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState('');
  const [selectedMorphType, setSelectedMorphType] = useState('');
  const [selectedRoot, setSelectedRoot] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMorphology, setEditingMorphology] = useState<MorphologyWithContext | null>(null);
  const [formData, setFormData] = useState({
    word_text: '',
    root: '',
    transliteration: '',
    morphology: '',
    grammar_type: 'noun',
    tense_mood: '',
    person: '',
    number: '',
    gender: '',
    case: '',
    etymology: '',
    semantic_field: '',
    linguistic_notes: '',
    confidence_score: 0.9,
    language_code: language,
    notes: '',
  });

  // Mock data - In production, this would come from API
  const [morphologyItems] = useState<MorphologyWithContext[]>([
    {
      id: '1',
      surah_number: 1,
      ayah_number: 1,
      word_position: 1,
      word_text: 'بِسْمِ',
      root: 'س م و',
      transliteration: 'Bismi',
      morphology: 'noun:genitive:3rd person',
      grammar_type: 'noun',
      tense_mood: '',
      person: '3rd',
      number: 'singular',
      gender: 'masculine',
      case: 'genitive',
      etymology: 'From س م و (to name)',
      semantic_field: 'names and attributes',
      linguistic_notes: 'Genitive construction indicating ownership or association',
      confidence_score: 0.98,
      language_code: 'ar',
      notes: 'Preposition + noun construct state',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      word: {
        position: 1,
        text: 'بِسْمِ',
        root: 'س م و',
        transliteration: 'Bismi',
        morphology: 'noun:genitive:3rd person',
        meaning: 'In the name'
      },
      surah: { number: 1, name: 'Al-Fatihah', arabic_name: 'الفاتحة', revelation_place: 'Makkah', ayahs_count: 7 },
      ayah: { number: 1, text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', words_count: 4 }
    },
    {
      id: '2',
      surah_number: 2,
      ayah_number: 255,
      word_position: 1,
      word_text: 'ٱللَّهُ',
      root: 'إ ل ه',
      transliteration: 'Allahu',
      morphology: 'noun:nominative:3rd person',
      grammar_type: 'noun',
      tense_mood: '',
      person: '3rd',
      number: 'singular',
      gender: 'masculine',
      case: 'nominative',
      etymology: 'From إ ل ه (to worship, to be worshipped)',
      semantic_field: 'divine names and attributes',
      linguistic_notes: 'Definite noun with emphatic -u ending',
      confidence_score: 0.99,
      language_code: 'ar',
      notes: 'Divine name, most frequently used in Quran',
      created_at: '2024-01-15T11:00:00Z',
      updated_at: '2024-01-15T11:00:00Z',
      word: {
        position: 1,
        text: 'ٱللَّهُ',
        root: 'إ ل ه',
        transliteration: 'Allahu',
        morphology: 'noun:nominative:3rd person',
        meaning: 'Allah'
      },
      surah: { number: 2, name: 'Al-Baqarah', arabic_name: 'البقرة', revelation_place: 'Madinah', ayahs_count: 286 },
      ayah: { number: 255, text: 'ٱللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ', words_count: 7 }
    }
  ]);

  const [surahs] = useState<Surah[]>([
    { number: 1, name: 'Al-Fatihah', arabic_name: 'الفاتحة', revelation_place: 'Makkah', ayahs_count: 7 },
    { number: 2, name: 'Al-Baqarah', arabic_name: 'البقرة', revelation_place: 'Madinah', ayahs_count: 286 },
    { number: 3, name: 'Al-Imran', arabic_name: 'آل عمران', revelation_place: 'Madinah', ayahs_count: 200 },
  ]);

  const uniqueRoots = [...new Set(morphologyItems.map(item => item.root))];

  const filteredMorphology = morphologyItems.filter((item) => {
    const matchesSearch = item.word_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.root.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.morphology.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSurah = !selectedSurah || item.surah_number.toString() === selectedSurah;
    const matchesMorphType = !selectedMorphType || item.grammar_type === selectedMorphType;
    const matchesRoot = !selectedRoot || item.root === selectedRoot;
    return matchesSearch && matchesSurah && matchesMorphType && matchesRoot;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMorphology) {
      console.log('Updating morphology:', editingMorphology.id, formData);
    } else {
      console.log('Creating new morphology:', formData);
    }
    
    setIsDialogOpen(false);
    setEditingMorphology(null);
    setFormData({
      word_text: '',
      root: '',
      transliteration: '',
      morphology: '',
      grammar_type: 'noun',
      tense_mood: '',
      person: '',
      number: '',
      gender: '',
      case: '',
      etymology: '',
      semantic_field: '',
      linguistic_notes: '',
      confidence_score: 0.9,
      language_code: language,
      notes: '',
    });
  };

  const handleEdit = (morphology: MorphologyWithContext) => {
    setEditingMorphology(morphology);
    setFormData({
      word_text: morphology.word_text,
      root: morphology.root,
      transliteration: morphology.transliteration,
      morphology: morphology.morphology,
      grammar_type: morphology.grammar_type,
      tense_mood: morphology.tense_mood || '',
      person: morphology.person || '',
      number: morphology.number || '',
      gender: morphology.gender || '',
      case: morphology.case || '',
      etymology: morphology.etymology || '',
      semantic_field: morphology.semantic_field || '',
      linguistic_notes: morphology.linguistic_notes || '',
      confidence_score: morphology.confidence_score,
      language_code: morphology.language_code,
      notes: morphology.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('admin.confirm_delete'))) {
      console.log('Deleting morphology:', id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Hash className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-amber-900">
                {t('admin.morphology_management')}
              </h1>
              <p className="text-amber-700">
                {t('admin.morphology_desc')}
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
            <DialogContent className="max-w-5xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMorphology ? t('admin.edit_morphology') : t('admin.add_morphology')}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="word" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="word">{t('admin.word_info')}</TabsTrigger>
                    <TabsTrigger value="grammar">{t('admin.grammar')}</TabsTrigger>
                    <TabsTrigger value="etymology">{t('admin.etymology')}</TabsTrigger>
                    <TabsTrigger value="details">{t('admin.details')}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="word" className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="word_position">{t('admin.word_position')}</Label>
                        <Input
                          id="word_position"
                          type="number"
                          min="1"
                          placeholder={t('admin.word_position_placeholder')}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="word_text">{t('admin.arabic_word')} *</Label>
                        <Input
                          id="word_text"
                          value={formData.word_text}
                          onChange={(e) => setFormData({ ...formData, word_text: e.target.value })}
                          placeholder="بِسْمِ"
                          required
                          className="font-arabic text-right"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="root">{t('admin.root')} *</Label>
                        <Input
                          id="root"
                          value={formData.root}
                          onChange={(e) => setFormData({ ...formData, root: e.target.value })}
                          placeholder="س م و"
                          required
                          className="font-arabic text-right"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="transliteration">{t('admin.transliteration')} *</Label>
                        <Input
                          id="transliteration"
                          value={formData.transliteration}
                          onChange={(e) => setFormData({ ...formData, transliteration: e.target.value })}
                          placeholder="Bismi"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="morphology">{t('admin.morphology_analysis')} *</Label>
                      <Input
                        id="morphology"
                        value={formData.morphology}
                        onChange={(e) => setFormData({ ...formData, morphology: e.target.value })}
                        placeholder="noun:genitive:3rd person"
                        required
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="grammar" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="grammar_type">{t('admin.grammar_type')} *</Label>
                        <Select
                          value={formData.grammar_type}
                          onValueChange={(value) => setFormData({ ...formData, grammar_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="noun">{t('admin.noun')}</SelectItem>
                            <SelectItem value="verb">{t('admin.verb')}</SelectItem>
                            <SelectItem value="adjective">{t('admin.adjective')}</SelectItem>
                            <SelectItem value="adverb">{t('admin.adverb')}</SelectItem>
                            <SelectItem value="preposition">{t('admin.preposition')}</SelectItem>
                            <SelectItem value="particle">{t('admin.particle')}</SelectItem>
                            <SelectItem value="pronoun">{t('admin.pronoun')}</SelectItem>
                            <SelectItem value="conjunction">{t('admin.conjunction')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="tense_mood">{t('admin.tense_mood')}</Label>
                        <Select
                          value={formData.tense_mood}
                          onValueChange={(value) => setFormData({ ...formData, tense_mood: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('admin.select_tense_mood')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t('admin.none')}</SelectItem>
                            <SelectItem value="present">{t('admin.present')}</SelectItem>
                            <SelectItem value="past">{t('admin.past')}</SelectItem>
                            <SelectItem value="future">{t('admin.future')}</SelectItem>
                            <SelectItem value="imperative">{t('admin.imperative')}</SelectItem>
                            <SelectItem value="subjunctive">{t('admin.subjunctive')}</SelectItem>
                            <SelectItem value="jussive">{t('admin.jussive')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="person">{t('admin.person')}</Label>
                        <Select
                          value={formData.person}
                          onValueChange={(value) => setFormData({ ...formData, person: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('admin.select_person')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t('admin.none')}</SelectItem>
                            <SelectItem value="1st">{t('admin.first')}</SelectItem>
                            <SelectItem value="2nd">{t('admin.second')}</SelectItem>
                            <SelectItem value="3rd">{t('admin.third')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="number">{t('admin.number')}</Label>
                        <Select
                          value={formData.number}
                          onValueChange={(value) => setFormData({ ...formData, number: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('admin.select_number')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t('admin.none')}</SelectItem>
                            <SelectItem value="singular">{t('admin.singular')}</SelectItem>
                            <SelectItem value="dual">{t('admin.dual')}</SelectItem>
                            <SelectItem value="plural">{t('admin.plural')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="gender">{t('admin.gender')}</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('admin.select_gender')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t('admin.none')}</SelectItem>
                            <SelectItem value="masculine">{t('admin.masculine')}</SelectItem>
                            <SelectItem value="feminine">{t('admin.feminine')}</SelectItem>
                            <SelectItem value="common">{t('admin.common')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="case">{t('admin.case')}</Label>
                      <Select
                        value={formData.case}
                        onValueChange={(value) => setFormData({ ...formData, case: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('admin.select_case')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">{t('admin.none')}</SelectItem>
                          <SelectItem value="nominative">{t('admin.nominative')}</SelectItem>
                          <SelectItem value="accusative">{t('admin.accusative')}</SelectItem>
                          <SelectItem value="genitive">{t('admin.genitive')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="etymology" className="space-y-4">
                    <div>
                      <Label htmlFor="etymology">{t('admin.etymology')}</Label>
                      <Textarea
                        id="etymology"
                        value={formData.etymology}
                        onChange={(e) => setFormData({ ...formData, etymology: e.target.value })}
                        placeholder={t('admin.etymology_placeholder')}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="semantic_field">{t('admin.semantic_field')}</Label>
                      <Input
                        id="semantic_field"
                        value={formData.semantic_field}
                        onChange={(e) => setFormData({ ...formData, semantic_field: e.target.value })}
                        placeholder={t('admin.semantic_field_placeholder')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="linguistic_notes">{t('admin.linguistic_notes')}</Label>
                      <Textarea
                        id="linguistic_notes"
                        value={formData.linguistic_notes}
                        onChange={(e) => setFormData({ ...formData, linguistic_notes: e.target.value })}
                        placeholder={t('admin.linguistic_notes_placeholder')}
                        rows={4}
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
                    {editingMorphology ? t('common.update') : t('common.create')}
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
                  placeholder={t('admin.search_morphology')}
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

            <Select value={selectedMorphType} onValueChange={setSelectedMorphType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t('admin.filter_grammar')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('admin.all_types')}</SelectItem>
                <SelectItem value="noun">{t('admin.noun')}</SelectItem>
                <SelectItem value="verb">{t('admin.verb')}</SelectItem>
                <SelectItem value="adjective">{t('admin.adjective')}</SelectItem>
                <SelectItem value="particle">{t('admin.particle')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRoot} onValueChange={setSelectedRoot}>
              <SelectTrigger className="w-full md:w-48">
                <GitBranch className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('admin.filter_root')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('admin.all_roots')}</SelectItem>
                {uniqueRoots.map((root) => (
                  <SelectItem key={root} value={root}>
                    {root}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Morphology Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.word')}</TableHead>
                  <TableHead>{t('admin.root')}</TableHead>
                  <TableHead>{t('admin.transliteration')}</TableHead>
                  <TableHead>{t('admin.morphology')}</TableHead>
                  <TableHead>{t('admin.grammar_type')}</TableHead>
                  <TableHead>{t('admin.context')}</TableHead>
                  <TableHead>{t('admin.confidence')}</TableHead>
                  <TableHead>{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMorphology.map((morphology) => (
                  <TableRow key={morphology.id}>
                    <TableCell>
                      <div className="font-arabic text-xl text-amber-900">
                        {morphology.word_text}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="font-arabic">
                        {morphology.root}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm font-medium">
                        {morphology.transliteration}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {morphology.morphology}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className="capitalize">
                        {morphology.grammar_type}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {morphology.surah.name}
                        </div>
                        <div className="text-gray-500">
                          Ayah {morphology.ayah_number}, Word {morphology.word_position}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          morphology.confidence_score >= 0.9 ? 'bg-green-500' :
                          morphology.confidence_score >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm">
                          {Math.round(morphology.confidence_score * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(morphology)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(morphology.id)}
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
          
          {filteredMorphology.length === 0 && (
            <div className="text-center py-12">
              <Hash className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t('admin.no_morphology_found')}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}