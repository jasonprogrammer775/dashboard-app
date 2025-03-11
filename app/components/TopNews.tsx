import {  useState } from "react";
import Image from "next/image";

interface NewsArticle {
  title: string;
  url: string;
  description: string;
  publishedAt: string;
  source: {
    name: string;
  };
  urlToImage?: string; // Changed from image to urlToImage
}

interface TopNewsProps {
  news: NewsArticle[];
}

const TopNews = ({ news }: TopNewsProps) => {
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});

  return (
    <div className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg w-full max-w-7xl mb-8">
      <h3 className="text-xl font-semibold mb-4">Top News</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-48 overflow-y-auto">
        {news.map((article, index) => (
          <div key={index} className="bg-white/5 p-2 rounded-lg mb-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300"
            >
              {article.urlToImage && !imageError[index] ? (
                <Image
                  src={article.urlToImage}
                  alt={article.title}
                  className="rounded"
                  width={300}
                  height={200}
                  style={{ width: '100%', height: 'auto' }}
                  priority={index === 0} // Add priority to first image
                  onError={() => setImageError(prev => ({...prev, [index]: true}))}
                  unoptimized
                />
              ) : (
                <div className="w-full h-[200px] bg-gray-800 rounded flex flex-col items-center justify-center">
                  <span className="text-sm text-gray-400">{article.source.name}</span>
                  <span className="text-xs text-gray-500 mt-1">No image available</span>
                </div>
              )}
              <h4 className="text-sm font-medium line-clamp-2 mt-2">
                {article.title}
              </h4>
            </a>
            <p className="text-xs text-gray-300 mt-1 line-clamp-2">
              {article.description}
            </p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-400">{article.source.name}</p>
              <p className="text-xs text-gray-400">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopNews;
