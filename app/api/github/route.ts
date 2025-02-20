




// app/api/github/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    const data = await res.json();
    
    if (res.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.error();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.error();
  }
}
