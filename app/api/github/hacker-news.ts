



// app/githubfolder/hacker-news.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch top stories from Hacker News
    const hackerNewsResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
    
    // Get the list of top story IDs
    const topStoriesIds = await hackerNewsResponse.json();
    
    // Fetch the first 5 top stories
    const storiesPromises = topStoriesIds.slice(0, 5).map((id: number) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
    );
    
    const stories = await Promise.all(storiesPromises);
    const storiesData = await Promise.all(stories.map(story => story.json()));

    return NextResponse.json(storiesData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching data from Hacker News' }, { status: 500 });
  }
}
