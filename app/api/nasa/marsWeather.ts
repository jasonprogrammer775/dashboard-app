import { NextResponse } from 'next/server';

const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

export async function GET() {
  try {
    const response = await fetch(
      `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Mars weather data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Mars weather:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Mars weather data' },
      { status: 500 }
    );

  }
}
