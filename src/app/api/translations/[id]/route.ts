import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    const db = DatabaseService.getInstance();
    const translation = await db.findOne('translations', { id });

    if (!translation) {
      return NextResponse.json(
        { success: false, error: 'Translation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: translation
    });
  } catch (error) {
    console.error('Error fetching translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch translation' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const db = DatabaseService.getInstance();
    
    // Check if translation exists
    const existing = await db.findOne('translations', { id });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Translation not found' },
        { status: 404 }
      );
    }

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

    const updated = await db.updateOne('translations', 
      { id },
      {
        ...body,
        updated_at: new Date().toISOString()
      }
    );

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error updating translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update translation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    const db = DatabaseService.getInstance();
    
    // Check if translation exists
    const existing = await db.findOne('translations', { id });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Translation not found' },
        { status: 404 }
      );
    }

    await db.deleteOne('translations', { id });

    return NextResponse.json({
      success: true,
      message: 'Translation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete translation' },
      { status: 500 }
    );
  }
}