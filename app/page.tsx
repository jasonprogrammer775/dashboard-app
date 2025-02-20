"use client";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { motion } from "framer-motion";
import HackerNews from "./HackerNews";
import Location from "./components/Location";

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

interface WeatherData {
  location: string;
  temperature: number;
  weather: string;
  icon: string;
}

export default function HomePage() {
  const [userData, setUserData] = useState<GitHubUserData | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [devToArticles, setDevToArticles] = useState<DevToArticle[]>([]);
  const [devToProfile, setDevToProfile] = useState<DevToProfile | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user data
        const userResponse = await fetch("/api/github");
        const userData: GitHubUserData = await userResponse.json();
        setUserData(userData);

        // Fetch user repos
        const reposResponse = await fetch(
          `https://api.github.com/users/${userData.login}/repos`
        );
        const reposData: GitHubRepo[] = await reposResponse.json();
        setRepos(reposData);
      } catch (err) {
        setError("Error fetching data");
        console.error("Error fetching data:", err);
      }

      try {
        // Fetch Dev.to profile information
        const devToProfileResponse = await fetch(
          `https://dev.to/api/users/by_username?url=jasonprogrammer775`
        );
        const devToProfileData: DevToProfile = await devToProfileResponse.json();
        setDevToProfile(devToProfileData);

        // Fetch Dev.to articles
        const devToArticlesResponse = await fetch(
          `https://dev.to/api/articles?username=jasonprogrammer775`
        );
        const devToArticlesData: DevToArticle[] = await devToArticlesResponse.json();
        setDevToArticles(devToArticlesData);
      } catch (err) {
        setError("Error fetching data");
        console.error("Error fetching data:", err);
      }
    }

    fetchData();

    // Fetch weather data
    async function fetchWeather() {
      try {
        const response = await fetch('/api/weather');
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }

    fetchWeather();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col items-center p-2">
      <div className="absolute top-4 left-4 space-y-4">
        {weatherData && (
          <motion.div
            className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg w-64"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold">Current Weather</h3>
            <div className="mt-4 flex items-center">
              <Image
                src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                alt={weatherData.weather}
                width={50}
                height={50}
              />
              <div className="ml-4">
                <p className="text-gray-300">{weatherData.location}</p>
                <p className="text-gray-300">{weatherData.temperature}°C</p>
                <p className="text-gray-300 capitalize">{weatherData.weather}</p>
              </div>
            </div>
          </motion.div>
        )}
        <motion.div
          className="bg-white/10 p-2 rounded-lg shadow-lg backdrop-blur-lg w-64"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Location />
        </motion.div>
      </div>
      <motion.h1
        className="text-2xl font-extrabold text-center mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HackerNews />
      </motion.h1>

      {error && <p className="text-red-500">{error}</p>}

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
              src={devToProfile?.profile_image || "/default-image.jpg"}
              alt={devToProfile?.username || "Profile"}
              className="w-12 h-12 rounded-full"
              width={48}
              height={48}
            />
            <div className="ml-4">
              <h4 className="text-gray-300">{devToProfile.name}</h4>
              <p className="text-gray-300">{devToProfile.bio}</p>
            </div>
          </div>
        </motion.div>
      )}

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
          className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg h-96 overflow-y-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold">GitHub Repositories</h3>
          {repos.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {repos.map((repo) => (
                <li key={repo.name} className="text-gray-300">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-300"
                  >
                    {repo.name}
                  </a>
                  <p className="text-sm line-clamp-1">{repo.description}</p>
                  <p className="text-xs">Stars: {repo.stargazers_count} | Forks: {repo.forks_count}</p>
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
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
