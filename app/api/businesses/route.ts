import { NextResponse } from 'next/server';

export async function GET() {
  // Amsterdam coordinates
  const url = 'https://local-business-data.p.rapidapi.com/search-nearby?query=restaurant&lat=52.3676&lng=4.9041&limit=10';
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
      'X-RapidAPI-Host': 'local-business-data.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    // Transform the data to match our interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedData = result.data?.map((item: any) => ({
      name: item.name,
      address: item.address?.full || 'No address available',
      rating: item.rating || 0,
      type: item.business_type || 'Business',
      phone: item.phone_number || 'No phone available'
    })) || [];

    return NextResponse.json({ data: transformedData });
  } catch (error) {
    console.error('Error fetching business data:', error);
    return NextResponse.json({ error: 'Failed to fetch business data' }, { status: 500 });
  }
}