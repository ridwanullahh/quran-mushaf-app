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
    const morphology = await db.findOne('morphology', { id });

    if (!morphology) {
      return NextResponse.json(
        { success: false, error: 'Morphology not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: morphology
    });
  } catch (error) {
    console.error('Error fetching morphology:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch morphology' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const db = DatabaseService.getInstance();
    
    // Check if morphology exists
    const existing = await db.findOne('morphology', { id });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Morphology not found' },
        { status: 404 }
      );
    }

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

    const updated = await db.updateOne('morphology', 
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
    console.error('Error updating morphology:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update morphology' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    const db = DatabaseService.getInstance();
    
    // Check if morphology exists
    const existing = await db.findOne('morphology', { id });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Morphology not found' },
        { status: 404 }
      );
    }

    await db.deleteOne('morphology', { id });

    return NextResponse.json({
      success: true,
      message: 'Morphology deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting morphology:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete morphology' },
      { status: 500 }
    );
  }
}