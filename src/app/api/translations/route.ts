import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const surah = searchParams.get('surah');
    const ayah = searchParams.get('ayah');
    const language = searchParams.get('language');
    const translator = searchParams.get('translator');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const db = DatabaseService.getInstance();
    
    let filter: any = {};
    if (surah) filter.surah_number = parseInt(surah);
    if (ayah) filter.ayah_number = parseInt(ayah);
    if (language) filter.language_code = language;
    if (translator) filter.translator = translator;

    const translations = await db.findMany('translations', filter, {
      limit,
      skip: (page - 1) * limit,
      sort: { surah_number: 1, ayah_number: 1, word_position: 1 }
    });

    const total = await db.count('translations', filter);

    return NextResponse.json({
      success: true,
      data: translations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['surah_number', 'ayah_number', 'word_position', 'translation_text', 'translator', 'language_code'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate surah and ayah numbers
    if (body.surah_number < 1 || body.surah_number > 114) {
      return NextResponse.json(
        { success: false, error: 'Invalid surah number (1-114)' },
        { status: 400 }
      );
    }

    const db = DatabaseService.getInstance();
    
    // Check for existing translation
    const existing = await db.findOne('translations', {
      surah_number: body.surah_number,
      ayah_number: body.ayah_number,
      word_position: body.word_position,
      language_code: body.language_code
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Translation already exists for this word' },
        { status: 409 }
      );
    }

    const translation = {
      ...body,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      confidence_score: body.confidence_score || 0.9
    };

    const created = await db.insertOne('translations', translation);

    return NextResponse.json({
      success: true,
      data: created
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create translation' },
      { status: 500 }
    );
  }
}