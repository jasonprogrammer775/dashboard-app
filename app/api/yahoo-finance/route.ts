import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching stock data from Alpha Vantage...');
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    
    const promises = symbols.map(symbol => {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      console.log(`Fetching data for ${symbol} from Alpha Vantage`);
      
      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch ${symbol}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch(error => {
          console.error(`Error fetching ${symbol}:`, error);
          return null;
        });
    });


    const results = await Promise.all(promises);
    const stocks = results
      .filter(result => result?.['Global Quote'])
      .map(result => {
        const quote = result['Global Quote'];
        const stockData = {
          symbol: quote['01. symbol'],
          name: '', // Alpha Vantage doesn't provide company name in this endpoint
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
        };
        console.log(`Successfully fetched data for ${stockData.symbol}`);
        return stockData;
      });


    if (stocks.length === 0) {
      console.warn('No valid stock data received from API');
    } else {
      console.log('Successfully fetched stock data:', stocks);
    }

    return NextResponse.json(stocks || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });

  } catch (error) {
    console.error('Error in stock data API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' }, 
      { status: 500 }
    );
  }
}
