// app/api/profit-update/route.ts
import { NextResponse } from 'next/server';

// In-memory storage for profit values
// In a real app, you'd use a database or persistent storage
let profitArray: number[] = [0, 0, 0, 0, 0]; // Initialize with zeros for indices 0-4

export async function POST(request: Request) {
  try {
    const { index, profit } = await request.json();
    
    // Validate index
    if (typeof index !== 'number' || index < 0 || index >= profitArray.length) {
      return NextResponse.json(
        { error: 'Invalid index. Must be a number between 0 and ' + (profitArray.length - 1) }, 
        { status: 400 }
      );
    }
    
    // Validate profit
    if (typeof profit !== 'number') {
      return NextResponse.json(
        { error: 'Profit must be a number' }, 
        { status: 400 }
      );
    }
    
    // Update profit at specified index
    profitArray[index] = profit;
    
    return NextResponse.json({ 
      success: true, 
      message: `Profit at index ${index} updated to ${profit}`,
      profitArray
    });
  } catch (error) {
    console.error('Error processing profit update:', error);
    return NextResponse.json(
      { error: 'Failed to update profit' }, 
      { status: 500 }
    );
  }
}

// Optional: Add a GET method to retrieve the current profit array
export async function GET() {
  return NextResponse.json({ profitArray });
}