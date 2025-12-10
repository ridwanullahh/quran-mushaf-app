import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // translations, tafseer, morphology, all
    const format = searchParams.get('format') || 'json'; // json, csv
    const surah = searchParams.get('surah');
    const language = searchParams.get('language');
    const includeMetadata = searchParams.get('include_metadata') === 'true';

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Export type is required' },
        { status: 400 }
      );
    }

    const db = DatabaseService.getInstance();
    let exportData: any = {};
    let filename = '';

    // Build filter
    const filter: any = {};
    if (surah) filter.surah_number = parseInt(surah);
    if (language) filter.language_code = language;

    // Export translations
    if (type === 'all' || type === 'translations') {
      exportData.translations = await db.findMany('translations', filter, {
        sort: { surah_number: 1, ayah_number: 1, word_position: 1 }
      });
    }

    // Export tafseer
    if (type === 'all' || type === 'tafseer') {
      exportData.tafseer = await db.findMany('tafseer', filter, {
        sort: { surah_number: 1, ayah_number: 1, word_position: 1 }
      });
    }

    // Export morphology
    if (type === 'all' || type === 'morphology') {
      exportData.morphology = await db.findMany('morphology', filter, {
        sort: { surah_number: 1, ayah_number: 1, word_position: 1 }
      });
    }

    // Add metadata if requested
    if (includeMetadata) {
      exportData.metadata = {
        exported_at: new Date().toISOString(),
        exported_by: 'admin',
        version: '1.0',
        type,
        format,
        filters: {
          surah,
          language,
          ...filter
        },
        statistics: {
          translations_count: exportData.translations?.length || 0,
          tafseer_count: exportData.tafseer?.length || 0,
          morphology_count: exportData.morphology?.length || 0
        }
      };
    }

    filename = `quran-${type}-export-${Date.now()}`;

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(exportData, type);
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      });
    } else {
      // Return JSON
      return NextResponse.json({
        success: true,
        data: exportData,
        filename: `${filename}.json`
      }, {
        headers: {
          'Content-Disposition': `attachment; filename="${filename}.json"`
        }
      });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { success: false, error: 'Export failed' },
      { status: 500 }
    );
  }
}

function convertToCSV(data: any, type: string): string {
  let csv = '';
  
  if (type === 'translations' || (type === 'all' && data.translations)) {
    csv += 'Translations\n';
    csv += 'ID,Surah,Ayah,Word Position,Arabic Text,Translation Text,Translator,Language,Confidence Score,Notes,Created At,Updated At\n';
    
    const translations = data.translations || [];
    translations.forEach((item: any) => {
      csv += `"${item.id}","${item.surah_number}","${item.ayah_number}","${item.word_position}","${item.arabic_text || ''}","${item.translation_text}","${item.translator}","${item.language_code}","${item.confidence_score}","${item.notes || ''}","${item.created_at}","${item.updated_at}"\n`;
    });
    
    if (type === 'all') csv += '\n';
  }
  
  if (type === 'tafseer' || (type === 'all' && data.tafseer)) {
    if (type === 'all') csv += 'Tafseer\n';
    csv += 'ID,Surah,Ayah,Word Position,Arabic Text,Tafseer Text,Tafseer Source,Scholar,Language,Tafseer Type,Confidence Score,References,Notes,Created At,Updated At\n';
    
    const tafseer = data.tafseer || [];
    tafseer.forEach((item: any) => {
      csv += `"${item.id}","${item.surah_number}","${item.ayah_number}","${item.word_position}","${item.arabic_text || ''}","${item.tafseer_text}","${item.tafseer_source}","${item.scholar}","${item.language_code}","${item.tafseer_type}","${item.confidence_score}","${item.references || ''}","${item.notes || ''}","${item.created_at}","${item.updated_at}"\n`;
    });
    
    if (type === 'all') csv += '\n';
  }
  
  if (type === 'morphology' || (type === 'all' && data.morphology)) {
    if (type === 'all') csv += 'Morphology\n';
    csv += 'ID,Surah,Ayah,Word Position,Arabic Word,Root,Transliteration,Morphology,Grammar Type,Tense/Mood,Person,Number,Gender,Case,Etymology,Semantic Field,Linguistic Notes,Confidence Score,Language,Notes,Created At,Updated At\n';
    
    const morphology = data.morphology || [];
    morphology.forEach((item: any) => {
      csv += `"${item.id}","${item.surah_number}","${item.ayah_number}","${item.word_position}","${item.word_text}","${item.root}","${item.transliteration}","${item.morphology}","${item.grammar_type}","${item.tense_mood || ''}","${item.person || ''}","${item.number || ''}","${item.gender || ''}","${item.case || ''}","${item.etymology || ''}","${item.semantic_field || ''}","${item.linguistic_notes || ''}","${item.confidence_score}","${item.language_code}","${item.notes || ''}","${item.created_at}","${item.updated_at}"\n`;
    });
  }
  
  return csv;
}

// POST endpoint for batch export with specific criteria
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      format = 'json', 
      filters = {}, 
      includeMetadata = true,
      batchSize = 1000 
    } = body;

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Export type is required' },
        { status: 400 }
      );
    }

    const db = DatabaseService.getInstance();
    let exportData: any = {};
    let filename = `quran-${type}-batch-export-${Date.now()}`;

    // Build filter conditions
    const filter = { ...filters };

    // Export in batches to handle large datasets
    if (type === 'all' || type === 'translations') {
      exportData.translations = await db.findMany('translations', filter, {
        sort: { surah_number: 1, ayah_number: 1, word_position: 1 },
        limit: batchSize
      });
    }

    if (type === 'all' || type === 'tafseer') {
      exportData.tafseer = await db.findMany('tafseer', filter, {
        sort: { surah_number: 1, ayah_number: 1, word_position: 1 },
        limit: batchSize
      });
    }

    if (type === 'all' || type === 'morphology') {
      exportData.morphology = await db.findMany('morphology', filter, {
        sort: { surah_number: 1, ayah_number: 1, word_position: 1 },
        limit: batchSize
      });
    }

    // Add metadata
    if (includeMetadata) {
      exportData.metadata = {
        exported_at: new Date().toISOString(),
        exported_by: 'admin',
        version: '1.0',
        type,
        format,
        filters,
        batch_size: batchSize,
        statistics: {
          translations_count: exportData.translations?.length || 0,
          tafseer_count: exportData.tafseer?.length || 0,
          morphology_count: exportData.morphology?.length || 0
        }
      };
    }

    if (format === 'csv') {
      const csvData = convertToCSV(exportData, type);
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        data: exportData,
        filename: `${filename}.json`
      }, {
        headers: {
          'Content-Disposition': `attachment; filename="${filename}.json"`
        }
      });
    }
  } catch (error) {
    console.error('Error performing batch export:', error);
    return NextResponse.json(
      { success: false, error: 'Batch export failed' },
      { status: 500 }
    );
  }
}