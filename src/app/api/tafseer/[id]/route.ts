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
    const tafseer = await db.findOne('tafseer', { id });

    if (!tafseer) {
      return NextResponse.json(
        { success: false, error: 'Tafseer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tafseer
    });
  } catch (error) {
    console.error('Error fetching tafseer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tafseer' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const db = DatabaseService.getInstance();
    
    // Check if tafseer exists
    const existing = await db.findOne('tafseer', { id });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Tafseer not found' },
        { status: 404 }
      );
    }

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

    const updated = await db.updateOne('tafseer', 
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
    console.error('Error updating tafseer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tafseer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    const db = DatabaseService.getInstance();
    
    // Check if tafseer exists
    const existing = await db.findOne('tafseer', { id });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Tafseer not found' },
        { status: 404 }
      );
    }

    await db.deleteOne('tafseer', { id });

    return NextResponse.json({
      success: true,
      message: 'Tafseer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tafseer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tafseer' },
      { status: 500 }
    );
  }
}