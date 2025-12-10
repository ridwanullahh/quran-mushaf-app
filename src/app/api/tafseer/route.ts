import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const surah = searchParams.get('surah');
    const ayah = searchParams.get('ayah');
    const language = searchParams.get('language');
    const scholar = searchParams.get('scholar');
    const source = searchParams.get('source');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const db = DatabaseService.getInstance();
    
    let filter: any = {};
    if (surah) filter.surah_number = parseInt(surah);
    if (ayah) filter.ayah_number = parseInt(ayah);
    if (language) filter.language_code = language;
    if (scholar) filter.scholar = scholar;
    if (source) filter.tafseer_source = source;
    if (type) filter.tafseer_type = type;

    const tafseer = await db.findMany('tafseer', filter, {
      limit,
      skip: (page - 1) * limit,
      sort: { surah_number: 1, ayah_number: 1, word_position: 1 }
    });

    const total = await db.count('tafseer', filter);

    return NextResponse.json({
      success: true,
      data: tafseer,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching tafseer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tafseer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['surah_number', 'ayah_number', 'word_position', 'tafseer_text', 'tafseer_source', 'scholar', 'language_code'];
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
    
    // Check for existing tafseer
    const existing = await db.findOne('tafseer', {
      surah_number: body.surah_number,
      ayah_number: body.ayah_number,
      word_position: body.word_position,
      tafseer_source: body.tafseer_source,
      scholar: body.scholar
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Tafseer already exists for this word from this scholar' },
        { status: 409 }
      );
    }

    const tafseer = {
      ...body,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      confidence_score: body.confidence_score || 0.9,
      tafseer_type: body.tafseer_type || 'exegesis'
    };

    const created = await db.insertOne('tafseer', tafseer);

    return NextResponse.json({
      success: true,
      data: created
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tafseer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tafseer' },
      { status: 500 }
    );
  }
}