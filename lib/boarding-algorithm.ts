export interface Booking {
  bookingId: string;
  seats: string[];
}

export interface BoardingSequence {
  seq: number;
  bookingId: string;
  seats: string[];
  maxDistance: number;
}

/**
 * Calculate the distance of a seat from the front entry
 * Seats are labeled like A1, B1, A20, C2, etc.
 * - Letter indicates row (A, B, C, D)
 * - Number indicates position (1 is closest to entry, higher numbers are further)
 * 
 * Distance calculation:
 * - Higher number = further from entry
 * - For same number, A/B are on left, C/D are on right (both same distance)
 */
function calculateSeatDistance(seat: string): number {
  const match = seat.match(/^([A-Z])(\d+)$/);
  if (!match) {
    // Invalid seat format, treat as far away
    return 999;
  }
  
  const row = match[1];
  const position = parseInt(match[2], 10);
  
  // Position number determines distance (higher = further from entry)
  // A1, B1, C1, D1 are closest (distance = 1)
  // A20, B20, C20, D20 are furthest (distance = 20)
  return position;
}

/**
 * Calculate the maximum distance for a booking (furthest seat)
 */
function getMaxDistance(seats: string[]): number {
  if (seats.length === 0) return 0;
  return Math.max(...seats.map(calculateSeatDistance));
}

/**
 * Generate boarding sequence for maximum boarding time
 * Strategy: Board passengers with furthest seats first
 * This ensures passengers don't block each other
 */
export function generateBoardingSequence(bookings: Booking[]): BoardingSequence[] {
  // Calculate max distance for each booking
  const bookingsWithDistance = bookings.map(booking => ({
    ...booking,
    maxDistance: getMaxDistance(booking.seats),
  }));

  // Sort by:
  // 1. Max distance (descending - furthest first)
  // 2. Booking ID (ascending - earlier IDs first in case of tie)
  bookingsWithDistance.sort((a, b) => {
    if (b.maxDistance !== a.maxDistance) {
      return b.maxDistance - a.maxDistance; // Descending by distance
    }
    return parseInt(a.bookingId) - parseInt(b.bookingId); // Ascending by booking ID
  });

  // Generate sequence with sequence numbers
  return bookingsWithDistance.map((booking, index) => ({
    seq: index + 1,
    bookingId: booking.bookingId,
    seats: booking.seats,
    maxDistance: booking.maxDistance,
  }));
}

/**
 * Parse booking data from text file content
 * Expected format:
 * Booking_ID    Seats
 * 101   A1,B1
 * 120   A20,C2
 * 
 * Supports both tab-separated and space-separated formats
 */
export function parseBookingData(content: string): Booking[] {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Skip header line if present
  const startIndex = lines[0]?.toLowerCase().includes('booking') ? 1 : 0;
  
  const bookings: Booking[] = [];
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    
    // First try splitting by tab (most common format)
    let parts: string[];
    if (line.includes('\t')) {
      parts = line.split('\t').map(p => p.trim()).filter(p => p.length > 0);
    } else {
      // Split by whitespace (multiple spaces)
      parts = line.split(/\s+/).filter(part => part.length > 0);
    }
    
    if (parts.length >= 2) {
      const bookingId = parts[0].trim();
      // Join remaining parts in case seats are space-separated instead of comma-separated
      const seatsStr = parts.slice(1).join(' ');
      // Split by comma, but also handle space-separated seats
      const seats = seatsStr.includes(',') 
        ? seatsStr.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : parts.slice(1).filter(s => s.length > 0);
      
      if (bookingId && seats.length > 0) {
        bookings.push({
          bookingId,
          seats,
        });
      }
    }
  }
  
  return bookings;
}

