import { NextResponse } from 'next/server';

const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

export async function GET() {
  try {
    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch asteroid data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching asteroid data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asteroid data' },
      { status: 500 }
    );
  }
}
