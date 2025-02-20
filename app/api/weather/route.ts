import { NextResponse } from 'next/server';

interface WeatherResponse {
  location: string;
  temperature: number;
  weather: string;
  icon: string;
}

export async function GET() {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenWeatherMap API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Amsterdam&units=metric&appid=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.weather || !data.weather[0]) {
      throw new Error('Invalid weather data received');
    }

    const weatherResponse: WeatherResponse = {
      location: data.name,
      temperature: data.main.temp,
      weather: data.weather[0].main,
      icon: data.weather[0].icon
    };

    return NextResponse.json(weatherResponse);
    
  } catch (err) {
    console.error('OpenWeatherMap API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
