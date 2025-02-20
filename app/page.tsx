"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from 'next/image';
import HackerNews from './HackerNews';


// Define the structure for GitHub user data
interface GitHubUserData {
  login: string;
  name: string;
  public_repos: number;
}

interface GitHubRepo {
  name: string;
  html_url: string;
  description: string;
  forks_count: number;
  stargazers_count: number;
}

interface DevToArticle {
  title: string;
  url: string;
  description: string;
  published_at: string;
}

interface DevToProfile {
  username: string;
  name: string;
  bio: string;
  profile_image: string;
}

export default function HomePage() {
  const [userData, setUserData] = useState<GitHubUserData | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]); // State to hold repos
  const [error, setError] = useState<string | null>(null);
  const [devToArticles, setDevToArticles] = useState<DevToArticle[]>([]); // State to hold Dev.to articles
  const [devToProfile, setDevToProfile] = useState<DevToProfile | null>(null); // State for Dev.to profile

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/github');
        const userData: GitHubUserData = await userResponse.json();
        setUserData(userData);

        // Fetch user repos
        const reposResponse = await fetch(`https://api.github.com/users/${userData.login}/repos`);
        const reposData: GitHubRepo[] = await reposResponse.json();
        setRepos(reposData);
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      }

      try {
        // Fetch Dev.to profile information
        const devToProfileResponse = await fetch(`https://dev.to/api/users/by_username?url=jasonprogrammer775`); // Replace 'your_username' with your actual Dev.to username
        const devToProfileData: DevToProfile = await devToProfileResponse.json();
        console.log('Dev.to Profile:', devToProfileData); // Log profile data to console


        setDevToProfile(devToProfileData);

        // Fetch Dev.to articles from your profile
        const devToArticlesResponse = await fetch(`https://dev.to/api/articles?username=jasonprogrammer775`); // Replace 'your_username' with your actual Dev.to username
        const devToArticlesData: DevToArticle[] = await devToArticlesResponse.json();
        setDevToArticles(devToArticlesData);
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col items-center justify-center p-2">
      <motion.h1
        className="text-2xl font-extrabold text-center mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
       <HackerNews />
  
      </motion.h1>

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Dev.to Profile Card */}
      {devToProfile && (
        <motion.div
          className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg w-full max-w-7xl mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold">Dev.to Profile</h3>
          <div className="flex items-center mt-4">
          <Image
  src={devToProfile?.profile_image || '/default-image.jpg'}
  alt={devToProfile?.username || 'Profile'}
  className="w-12 h-12 rounded-full"
  width={48} // Set width and height explicitly
  height={48} // Set width and height explicitly
/>

            <div className="ml-4">
              <h4 className="text-gray-300">{devToProfile.name}</h4>
              <p className="text-gray-300">{devToProfile.bio}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mb-8">
        {/* GitHub Data Card */}
        <motion.div
          className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold">GitHub User Data</h3>
          {userData ? (
            <div className="mt-4">
              <p className="text-gray-300 mt-2">Username: {userData.login}</p>
              <p className="text-gray-300 mt-2">Name: {userData.name}</p>
              <p className="text-gray-300 mt-2">Public Repos: {userData.public_repos}</p>
            </div>
          ) : (
            <p className="text-gray-300">Loading user data...</p>
          )}
        </motion.div>

        {/* GitHub Repos Card */}
        <motion.div
          className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold">GitHub Repositories</h3>
          {repos.length > 0 ? (
            <ul className="mt-4">
              {repos.map((repo) => (
                <li key={repo.name} className="text-gray-300 mt-2">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                  <p>{repo.description}</p>
                  <p>Stars: {repo.stargazers_count} | Forks: {repo.forks_count}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">Loading repositories...</p>
          )}
        </motion.div>

        {/* Dev.to Articles Card */}
        <motion.div
          className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold">Dev.to Articles</h3>
          {devToArticles.length > 0 ? (
            <ul className="mt-4">
              {devToArticles.map((article) => (
                <li key={article.url} className="text-gray-300 mt-2">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                  <p>{article.description}</p>
                  <p>Published on: {new Date(article.published_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">Loading articles...</p>
          )}
        </motion.div>
      </div>
    </main>
  );
}










