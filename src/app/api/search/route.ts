import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // translations, tafseer, morphology, all
    const surah = searchParams.get('surah');
    const language = searchParams.get('language') || 'en';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const db = DatabaseService.getInstance();
    const results: any = {
      translations: [],
      tafseer: [],
      morphology: []
    };

    const searchRegex = new RegExp(query.trim(), 'i');

    // Search in translations if requested
    if (type === 'all' || type === 'translations') {
      const translationFilter: any = {
        $or: [
          { translation_text: searchRegex },
          { translator: searchRegex },
          { notes: searchRegex }
        ]
      };
      
      if (surah) translationFilter.surah_number = parseInt(surah);
      if (language) translationFilter.language_code = language;

      results.translations = await db.findMany('translations', translationFilter, {
        limit,
        skip: (page - 1) * Math.floor(limit / 3),
        sort: { surah_number: 1, ayah_number: 1 }
      });
    }

    // Search in tafseer if requested
    if (type === 'all' || type === 'tafseer') {
      const tafseerFilter: any = {
        $or: [
          { tafseer_text: searchRegex },
          { scholar: searchRegex },
          { tafseer_source: searchRegex },
          { references: searchRegex },
          { notes: searchRegex }
        ]
      };
      
      if (surah) tafseerFilter.surah_number = parseInt(surah);
      if (language) tafseerFilter.language_code = language;

      results.tafseer = await db.findMany('tafseer', tafseerFilter, {
        limit,
        skip: (page - 1) * Math.floor(limit / 3),
        sort: { surah_number: 1, ayah_number: 1 }
      });
    }

    // Search in morphology if requested
    if (type === 'all' || type === 'morphology') {
      const morphologyFilter: any = {
        $or: [
          { word_text: searchRegex },
          { root: searchRegex },
          { transliteration: searchRegex },
          { morphology: searchRegex },
          { etymology: searchRegex },
          { semantic_field: searchRegex },
          { linguistic_notes: searchRegex }
        ]
      };
      
      if (surah) morphologyFilter.surah_number = parseInt(surah);
      if (language) morphologyFilter.language_code = language;

      results.morphology = await db.findMany('morphology', morphologyFilter, {
        limit,
        skip: (page - 1) * Math.floor(limit / 3),
        sort: { surah_number: 1, ayah_number: 1, word_position: 1 }
      });
    }

    // Calculate total results
    const totalResults = results.translations.length + results.tafseer.length + results.morphology.length;

    return NextResponse.json({
      success: true,
      data: {
        query,
        type,
        results: {
          translations: results.translations,
          tafseer: results.tafseer,
          morphology: results.morphology
        },
        summary: {
          total: totalResults,
          translations: results.translations.length,
          tafseer: results.tafseer.length,
          morphology: results.morphology.length
        },
        pagination: {
          page,
          limit,
          total: totalResults,
          pages: Math.ceil(totalResults / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}

// POST endpoint for advanced search with filters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      query, 
      type = 'all', 
      filters = {}, 
      page = 1, 
      limit = 20 
    } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const db = DatabaseService.getInstance();
    const results: any = {
      translations: [],
      tafseer: [],
      morphology: []
    };

    const searchRegex = new RegExp(query.trim(), 'i');

    // Build filter conditions
    const buildFilter = (additionalFilters: any = {}) => {
      const filter: any = {
        $or: []
      };

      // Add text search conditions based on type
      if (type === 'all' || type === 'translations') {
        filter.$or.push(
          { translation_text: searchRegex },
          { translator: searchRegex },
          { notes: searchRegex }
        );
      }

      if (type === 'all' || type === 'tafseer') {
        filter.$or.push(
          { tafseer_text: searchRegex },
          { scholar: searchRegex },
          { tafseer_source: searchRegex },
          { references: searchRegex },
          { notes: searchRegex }
        );
      }

      if (type === 'all' || type === 'morphology') {
        filter.$or.push(
          { word_text: searchRegex },
          { root: searchRegex },
          { transliteration: searchRegex },
          { morphology: searchRegex },
          { etymology: searchRegex },
          { semantic_field: searchRegex },
          { linguistic_notes: searchRegex }
        );
      }

      // Add additional filters
      Object.keys(additionalFilters).forEach(key => {
        filter[key] = additionalFilters[key];
      });

      return filter;
    };

    const baseFilter = buildFilter(filters);

    // Search in different collections
    if (type === 'all' || type === 'translations') {
      results.translations = await db.findMany('translations', 
        type === 'translations' ? baseFilter : { ...baseFilter, translation_text: searchRegex },
        {
          limit: type === 'translations' ? limit : Math.floor(limit / 3),
          skip: (page - 1) * Math.floor(limit / 3),
          sort: { surah_number: 1, ayah_number: 1 }
        }
      );
    }

    if (type === 'all' || type === 'tafseer') {
      results.tafseer = await db.findMany('tafseer', 
        type === 'tafseer' ? baseFilter : { ...baseFilter, tafseer_text: searchRegex },
        {
          limit: type === 'tafseer' ? limit : Math.floor(limit / 3),
          skip: (page - 1) * Math.floor(limit / 3),
          sort: { surah_number: 1, ayah_number: 1 }
        }
      );
    }

    if (type === 'all' || type === 'morphology') {
      results.morphology = await db.findMany('morphology', 
        type === 'morphology' ? baseFilter : { ...baseFilter, word_text: searchRegex },
        {
          limit: type === 'morphology' ? limit : Math.floor(limit / 3),
          skip: (page - 1) * Math.floor(limit / 3),
          sort: { surah_number: 1, ayah_number: 1, word_position: 1 }
        }
      );
    }

    const totalResults = results.translations.length + results.tafseer.length + results.morphology.length;

    return NextResponse.json({
      success: true,
      data: {
        query,
        type,
        filters,
        results: {
          translations: results.translations,
          tafseer: results.tafseer,
          morphology: results.morphology
        },
        summary: {
          total: totalResults,
          translations: results.translations.length,
          tafseer: results.tafseer.length,
          morphology: results.morphology.length
        },
        pagination: {
          page,
          limit,
          total: totalResults,
          pages: Math.ceil(totalResults / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error performing advanced search:', error);
    return NextResponse.json(
      { success: false, error: 'Advanced search failed' },
      { status: 500 }
    );
  }
}