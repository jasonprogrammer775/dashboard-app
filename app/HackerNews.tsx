// HackerNews.tsx

import { useEffect, useState } from 'react';

interface HackerNewsPost {
  id: number;
  title: string;
  url: string;
  by: string;
  time: number;
}


const HackerNews = () => {
  const [posts, setPosts] = useState<HackerNewsPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHackerNews = async () => {
      try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
        const postIds: number[] = await response.json();

        // Fetch details of the first 5 posts
        const postPromises = postIds.slice(0, 5).map(async (postId) => {
          const postResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${postId}.json?print=pretty`);
          return postResponse.json();
        });

        const postsData = await Promise.all(postPromises);
        setPosts(postsData);
      } catch (err) {
        console.error('Error fetching Hacker News:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHackerNews();
  }, []);

  if (loading) {
    return <p>Loading Hacker News...</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">Hacker News</h3>
      <ul className="mt-4">
        {posts.map((post) => (
          <li key={post.id} className="text-gray-300 mt-2">

            <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {post.title}
            </a>
            <p>By: {post.by} | {new Date(post.time * 1000).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HackerNews;
