import { NextRequest, NextResponse } from 'next/server';
import { parseBookingData, generateBoardingSequence } from '@/lib/boarding-algorithm';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const content = await file.text();

    // Parse booking data
    const bookings = parseBookingData(content);

    if (bookings.length === 0) {
      return NextResponse.json(
        { error: 'No valid bookings found in file' },
        { status: 400 }
      );
    }

    // Generate boarding sequence
    const sequence = generateBoardingSequence(bookings);

    return NextResponse.json({
      success: true,
      sequence: sequence.map(item => ({
        seq: item.seq,
        bookingId: item.bookingId,
      })),
      details: sequence, // Include full details for UI
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Failed to process file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

