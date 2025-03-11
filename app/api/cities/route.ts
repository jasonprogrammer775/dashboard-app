import { NextResponse } from 'next/server';

export async function GET() {
  const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=10&sort=-population';
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return NextResponse.json(result);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cities data' }, { status: 500 });
  }
}