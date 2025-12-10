'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Hash, 
  FileText, 
  Volume2, 
  Info, 
  X,
  ExternalLink,
  GitBranch,
  Type,
  Languages,
  Star
} from 'lucide-react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { 
  QuranWord, 
  Translation, 
  Morphology, 
  Tafseer, 
  Surah, 
  Ayah 
} from '@/types';

interface WordAnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  word: QuranWord | null;
  surah: Surah | null;
  ayah: Ayah | null;
  currentLanguage: string;
}

interface WordAnalysisData {
  word: QuranWord;
  translations: Translation[];
  morphology: Morphology[];
  tafseer: Tafseer[];
  relatedWords: QuranWord[];
  statistics: {
    frequency: number;
    rootWords: string[];
    similarWords: QuranWord[];
  };
}

export default function WordAnalysisPanel({
  isOpen,
  onClose,
  word,
  surah,
  ayah,
  currentLanguage
}: WordAnalysisPanelProps) {
  const { t } = useTranslation();
  const [analysisData, setAnalysisData] = useState<WordAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && word) {
      fetchWordAnalysis();
    }
  }, [isOpen, word, currentLanguage]);

  const fetchWordAnalysis = async () => {
    if (!word) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch translations
      const translationsRes = await fetch(
        `/api/translations?surah=${word.surah_number}&ayah=${word.ayah_number}&word_position=${word.position}&language=${currentLanguage}`
      );
      const translationsData = await translationsRes.json();
      
      // Fetch morphology
      const morphologyRes = await fetch(
        `/api/morphology?surah=${word.surah_number}&ayah=${word.ayah_number}&word_position=${word.position}&language=${currentLanguage}`
      );
      const morphologyData = await morphologyRes.json();
      
      // Fetch tafseer
      const tafseerRes = await fetch(
        `/api/tafseer?surah=${word.surah_number}&ayah=${word.ayah_number}&word_position=${word.position}&language=${currentLanguage}`
      );
      const tafseerData = await tafseerRes.json();
      
      // Fetch related words (same root)
      const relatedWordsRes = await fetch(
        `/api/morphology?root=${word.root}&language=${currentLanguage}&limit=10`
      );
      const relatedWordsData = await relatedWordsRes.json();
      
      setAnalysisData({
        word,
        translations: translationsData.success ? translationsData.data : [],
        morphology: morphologyData.success ? morphologyData.data : [],
        tafseer: tafseerData.success ? tafseerData.data : [],
        relatedWords: relatedWordsData.success ? relatedWordsData.data : [],
        statistics: {
          frequency: Math.floor(Math.random() * 100) + 10, // Mock frequency
          rootWords: [word.root],
          similarWords: []
        }
      });
    } catch (err) {
      setError('Failed to fetch word analysis data');
      console.error('Error fetching word analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!word || !surah || !ayah) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hash className="h-5 w-5 text-purple-600" />
              <span className="font-arabic text-2xl">{word.text}</span>
              <Badge variant="outline">{word.transliteration}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              <span className="font-medium">{surah.name}</span> - {t('common.ayah')} {ayah.number}, {t('common.word')} {word.position}
            </div>
            <div className="font-arabic text-lg text-amber-900">
              {ayah.text}
            </div>
          </div>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2">{t('common.loading')}</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            {error}
          </div>
        )}

        {analysisData && !loading && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">
                <Info className="h-4 w-4 mr-2" />
                {t('common.overview')}
              </TabsTrigger>
              <TabsTrigger value="translation">
                <Languages className="h-4 w-4 mr-2" />
                {t('common.translation')}
              </TabsTrigger>
              <TabsTrigger value="morphology">
                <Hash className="h-4 w-4 mr-2" />
                {t('common.morphology')}
              </TabsTrigger>
              <TabsTrigger value="tafseer">
                <BookOpen className="h-4 w-4 mr-2" />
                {t('common.tafseer')}
              </TabsTrigger>
              <TabsTrigger value="related">
                <GitBranch className="h-4 w-4 mr-2" />
                {t('common.related')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Type className="h-4 w-4 mr-2" />
                    {t('common.basic_info')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('common.arabic_text')}:</span>
                      <span className="font-arabic font-bold">{word.text}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('common.transliteration')}:</span>
                      <span className="font-mono">{word.transliteration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('common.root')}:</span>
                      <Badge variant="outline" className="font-arabic">{word.root}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('common.meaning')}:</span>
                      <span>{word.meaning}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('common.morphology')}:</span>
                      <span className="text-xs">{word.morphology}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    {t('common.statistics')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('common.frequency')}:</span>
                      <span>{analysisData.statistics.frequency} {t('common.times')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('common.total_translations')}:</span>
                      <span>{analysisData.translations.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('common.morphology_entries')}:</span>
                      <span>{analysisData.morphology.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('common.tafseer_references')}:</span>
                      <span>{analysisData.tafseer.length}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {analysisData.morphology.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">{t('common.detailed_morphology')}</h3>
                  <div className="text-sm space-y-2">
                    {analysisData.morphology[0].etymology && (
                      <div>
                        <span className="font-medium text-gray-700">{t('common.etymology')}:</span>
                        <p className="text-gray-600">{analysisData.morphology[0].etymology}</p>
                      </div>
                    )}
                    {analysisData.morphology[0].semantic_field && (
                      <div>
                        <span className="font-medium text-gray-700">{t('common.semantic_field')}:</span>
                        <p className="text-gray-600">{analysisData.morphology[0].semantic_field}</p>
                      </div>
                    )}
                    {analysisData.morphology[0].linguistic_notes && (
                      <div>
                        <span className="font-medium text-gray-700">{t('common.linguistic_notes')}:</span>
                        <p className="text-gray-600">{analysisData.morphology[0].linguistic_notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="translation">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {analysisData.translations.length > 0 ? (
                    analysisData.translations.map((translation, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{translation.language_code.toUpperCase()}</Badge>
                            <span className="font-medium">{translation.translator}</span>
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
                        <p className="text-sm">{translation.translation_text}</p>
                        {translation.notes && (
                          <p className="text-xs text-gray-500 mt-2 italic">{translation.notes}</p>
                        )}
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {t('common.no_translations_available')}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="morphology">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {analysisData.morphology.length > 0 ? (
                    analysisData.morphology.map((morphology, index) => (
                      <Card key={index} className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 block">{t('common.grammar_type')}:</span>
                            <Badge variant="outline" className="mt-1 capitalize">
                              {morphology.grammar_type}
                            </Badge>
                          </div>
                          {morphology.person && (
                            <div>
                              <span className="text-gray-600 block">{t('common.person')}:</span>
                              <span className="font-medium">{morphology.person}</span>
                            </div>
                          )}
                          {morphology.number && (
                            <div>
                              <span className="text-gray-600 block">{t('common.number')}:</span>
                              <span className="font-medium">{morphology.number}</span>
                            </div>
                          )}
                          {morphology.gender && (
                            <div>
                              <span className="text-gray-600 block">{t('common.gender')}:</span>
                              <span className="font-medium">{morphology.gender}</span>
                            </div>
                          )}
                          {morphology.case && (
                            <div>
                              <span className="text-gray-600 block">{t('common.case')}:</span>
                              <span className="font-medium">{morphology.case}</span>
                            </div>
                          )}
                          {morphology.tense_mood && (
                            <div>
                              <span className="text-gray-600 block">{t('common.tense_mood')}:</span>
                              <span className="font-medium">{morphology.tense_mood}</span>
                            </div>
                          )}
                        </div>
                        
                        {morphology.etymology && (
                          <div className="mt-4 pt-4 border-t">
                            <span className="text-gray-600 block text-sm">{t('common.etymology')}:</span>
                            <p className="text-sm mt-1">{morphology.etymology}</p>
                          </div>
                        )}
                        
                        {morphology.semantic_field && (
                          <div className="mt-2">
                            <span className="text-gray-600 block text-sm">{t('common.semantic_field')}:</span>
                            <p className="text-sm mt-1">{morphology.semantic_field}</p>
                          </div>
                        )}
                        
                        {morphology.linguistic_notes && (
                          <div className="mt-2">
                            <span className="text-gray-600 block text-sm">{t('common.linguistic_notes')}:</span>
                            <p className="text-sm mt-1">{morphology.linguistic_notes}</p>
                          </div>
                        )}
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {t('common.no_morphology_available')}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="tafseer">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {analysisData.tafseer.length > 0 ? (
                    analysisData.tafseer.map((tafseer, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{tafseer.language_code.toUpperCase()}</Badge>
                            <span className="font-medium">{tafseer.scholar}</span>
                            <Badge variant="secondary" className="capitalize">
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
                        
                        <div className="text-sm mb-3">
                          <span className="text-gray-600">{t('common.source')}: </span>
                          <span className="font-medium">{tafseer.tafseer_source}</span>
                        </div>
                        
                        <p className="text-sm leading-relaxed">{tafseer.tafseer_text}</p>
                        
                        {tafseer.references && (
                          <div className="mt-3 pt-3 border-t">
                            <span className="text-gray-600 text-sm block">{t('common.references')}:</span>
                            <p className="text-xs text-gray-500 mt-1">{tafseer.references}</p>
                          </div>
                        )}
                        
                        {tafseer.notes && (
                          <div className="mt-2">
                            <span className="text-gray-600 text-sm block">{t('common.notes')}:</span>
                            <p className="text-xs text-gray-500 mt-1 italic">{tafseer.notes}</p>
                          </div>
                        )}
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {t('common.no_tafseer_available')}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="related">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {analysisData.relatedWords.length > 0 ? (
                    <>
                      <Card className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <GitBranch className="h-4 w-4 mr-2" />
                          {t('common.words_same_root')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {analysisData.relatedWords.slice(0, 8).map((relatedWord, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="font-arabic text-sm">{relatedWord.word_text}</span>
                                <span className="text-xs text-gray-500">{relatedWord.transliteration}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {relatedWord.surah_number}:{relatedWord.ayah_number}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <h3 className="font-semibold mb-3">{t('common.root_analysis')}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('common.root_letters')}:</span>
                            <Badge variant="outline" className="font-arabic">{word.root}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('common.words_with_root')}:</span>
                            <span>{analysisData.relatedWords.length}</span>
                          </div>
                        </div>
                      </Card>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {t('common.no_related_words_found')}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}