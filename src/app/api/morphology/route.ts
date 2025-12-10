import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const surah = searchParams.get('surah');
    const ayah = searchParams.get('ayah');
    const wordPosition = searchParams.get('word_position');
    const root = searchParams.get('root');
    const grammarType = searchParams.get('grammar_type');
    const language = searchParams.get('language');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const db = DatabaseService.getInstance();
    
    let filter: any = {};
    if (surah) filter.surah_number = parseInt(surah);
    if (ayah) filter.ayah_number = parseInt(ayah);
    if (wordPosition) filter.word_position = parseInt(wordPosition);
    if (root) filter.root = root;
    if (grammarType) filter.grammar_type = grammarType;
    if (language) filter.language_code = language;

    const morphology = await db.findMany('morphology', filter, {
      limit,
      skip: (page - 1) * limit,
      sort: { surah_number: 1, ayah_number: 1, word_position: 1 }
    });

    const total = await db.count('morphology', filter);

    return NextResponse.json({
      success: true,
      data: morphology,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching morphology:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch morphology' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['surah_number', 'ayah_number', 'word_position', 'word_text', 'root', 'transliteration', 'morphology', 'grammar_type', 'language_code'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate surah number
    if (body.surah_number < 1 || body.surah_number > 114) {
      return NextResponse.json(
        { success: false, error: 'Invalid surah number (1-114)' },
        { status: 400 }
      );
    }

    const db = DatabaseService.getInstance();
    
    // Check for existing morphology
    const existing = await db.findOne('morphology', {
      surah_number: body.surah_number,
      ayah_number: body.ayah_number,
      word_position: body.word_position,
      language_code: body.language_code
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Morphology already exists for this word' },
        { status: 409 }
      );
    }

    const morphology = {
      ...body,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      confidence_score: body.confidence_score || 0.9
    };

    const created = await db.insertOne('morphology', morphology);

    return NextResponse.json({
      success: true,
      data: created
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating morphology:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create morphology' },
      { status: 500 }
    );
  }
}