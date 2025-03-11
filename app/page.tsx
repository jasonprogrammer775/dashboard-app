"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import HackerNews from "./HackerNews";
import TopNews from "./components/TopNews"; // Import TopNews component
import Location from "./components/Location";

import WakaTimeStats from "./components/WakaTimeStas";
import LocalBusinesses from './components/LocalBusinesses';
import TopCities from './components/TopCities';


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

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

interface SlackMessage {
  message: string;
  channel: string;
  timestamp?: string;
}

interface NewsArticle {
  title: string;
  url: string;
  description: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface MarsWeatherData {
  AT: {
    av: number;
  };
  PRE: {
    av: number;
  };
  HWS: {
    av: number;
  };
}

interface MarsWeather {
  sol_keys: string[];
  [key: string]: MarsWeatherData | string[];
}

export default function HomePage() {
  const [userData, setUserData] = useState<GitHubUserData | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [devToArticles, setDevToArticles] = useState<DevToArticle[]>([]);
  const [devToProfile, setDevToProfile] = useState<DevToProfile | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [cryptoData, setCryptoData] = useState<CryptoData[] | null>(null);
  const [slackMessage, setSlackMessage] = useState("");
  const [slackChannel, setSlackChannel] = useState("");
  const [slackResult, setSlackResult] = useState<SlackMessage | null>(null);
  const [isSendingSlack, setIsSendingSlack] = useState(false);
  const [marsWeather, setMarsWeather] = useState<MarsWeather | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const sendSlackMessage = async () => {
    if (!slackMessage || !slackChannel) return;

    setIsSendingSlack(true);
    try {
      const response = await fetch("/api/slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: slackMessage,
          channel: slackChannel,
        }),
      });
      const result = await response.json();
      setSlackResult(result);
    } catch (error) {
      console.error("Error sending Slack message:", error);
    } finally {
      setIsSendingSlack(false);
    }
  };

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
        const devToProfileData: DevToProfile =
          await devToProfileResponse.json();
        setDevToProfile(devToProfileData);

        // Fetch Dev.to articles
        const devToArticlesResponse = await fetch(
          `https://dev.to/api/articles?username=jasonprogrammer775`
        );
        const devToArticlesData: DevToArticle[] =
          await devToArticlesResponse.json();
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
        const response = await fetch("/api/weather");
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }

    fetchWeather();

    // Fetch crypto data
    async function fetchCrypto() {
      try {
        const response = await fetch("/api/crypto");
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    }

    fetchCrypto();

    // Fetch Mars weather data
    async function fetchMarsWeather() {
      try {
        // First try local API
        const localResponse = await fetch("/api/nasa/marsWeather");
        console.log("Local API response status:", localResponse.status);
        if (localResponse.ok) {
          const data = await localResponse.json();
          console.log("Local API data:", data);
          setMarsWeather(data);
          return;
        }

        // Fallback to public NASA API
        const publicResponse = await fetch(
          "https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0"
        );
        console.log("NASA API response status:", publicResponse.status);
        if (!publicResponse.ok) {
          const errorText = await publicResponse.text();
          console.error("NASA API error:", {
            status: publicResponse.status,
            statusText: publicResponse.statusText,
            url: publicResponse.url,
            responseText: errorText,
          });
          throw new Error(`NASA API error: ${publicResponse.status}`);
        }
        const data = await publicResponse.json();
        console.log("NASA API data:", data);
        setMarsWeather(data);
      } catch (error) {
        console.error("Error fetching Mars weather:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : "No stack trace",
        });
        setMarsWeather(null);
      }
    }

    fetchMarsWeather();

    // Fetch news data
    async function fetchNews() {
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        if (data.articles) {
          setNews(data.articles);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }

    fetchNews();
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
                src={weatherData.icon}
                alt={weatherData.weather}
                width={50}
                height={50}
                unoptimized
              />
              <div className="ml-4">
                <p className="text-gray-300">{weatherData.location}</p>
                <p className="text-gray-300">{weatherData.temperature}°C</p>
                <p className="text-gray-300 capitalize">
                  {weatherData.weather}
                </p>
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
      {marsWeather && (
        <motion.div
          className="absolute top-4 right-4 bg-black/30 p-4 rounded-lg shadow-lg w-64"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-2">Mars Weather</h3>
          {marsWeather.sol_keys.slice(0, 1).map((sol) => (
            <div key={sol} className="mt-2">
              <p className="text-gray-300">Sol {sol}</p>
              <p className="text-gray-300">
                Temp: {(marsWeather[sol] as MarsWeatherData)?.AT?.av}°C
              </p>
              <p className="text-gray-300">
                Wind: {(marsWeather[sol] as MarsWeatherData)?.HWS?.av} m/s
              </p>
              <p className="text-gray-300">
                Pressure: {(marsWeather[sol] as MarsWeatherData)?.PRE?.av} Pa
              </p>
            </div>
          ))}
        </motion.div>
      )}

      <TopNews news={news} />
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
              src={devToProfile.profile_image}
              alt={devToProfile.username}
              className="w-12 h-12 rounded-full"
              width={48}
              height={48}
              unoptimized
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
              <p className="text-gray-300 mt-2">
                Public Repos: {userData.public_repos}
              </p>
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
                  <p className="text-xs">
                    Stars: {repo.stargazers_count} | Forks: {repo.forks_count}
                  </p>
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
                  <p>
                    Published on:{" "}
                    {new Date(article.published_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">Loading articles...</p>
          )}
        </motion.div>
      </div>

      {/* Crypto Card */}
      <motion.div
        className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg w-full max-w-7xl mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-4">Top Cryptocurrencies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cryptoData?.map((coin) => (
            <div key={coin.id} className="flex items-center space-x-4">
              <Image
                src={coin.image}
                alt={coin.name}
                width={32}
                height={32}
                className="w-8 h-8"
                unoptimized
              />

              <div>
                <p className="text-gray-300 font-medium">
                  {coin.name} ({coin.symbol})
                </p>
                <p className="text-gray-300">
                  ${coin.current_price.toLocaleString()}
                </p>
                <p
                  className={`text-sm ${
                    coin.price_change_percentage_24h >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Slack Integration Section */}
      <motion.div
        className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg w-full max-w-7xl mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <a href="https://wakatime.com/@355bfc85-b797-4c4e-9f20-9e4f7287ed02">
          <Image
            src="https://wakatime.com/badge/user/355bfc85-b797-4c4e-9f20-9e4f7287ed02.svg"
            width={185}
            height={37}
            alt="Total time coded since Oct 29 2021"
          />
        </a>
        <WakaTimeStats />

        <h3 className="text-xl font-semibold mb-4">Send Slack Message</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter channel name"
            value={slackChannel}
            onChange={(e) => setSlackChannel(e.target.value)}
            className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300"
          />
          <textarea
            placeholder="Enter your message"
            value={slackMessage}
            onChange={(e) => setSlackMessage(e.target.value)}
            className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300"
            rows={3}
          />
          <button
            onClick={sendSlackMessage}
            disabled={isSendingSlack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isSendingSlack ? "Sending..." : "Send Message"}
          </button>
          {slackResult && (
            <div className="mt-4 text-green-400">
              Message sent successfully! Timestamp: {slackResult.timestamp}
            </div>
          )}
        </div>
      </motion.div>

      {/* News Section - Moved under Mars Weather */}
      {/* <motion.div
        className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg w-64 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{ position: "absolute", top: "20rem", right: "1rem" }}
      >
        <h3 className="text-lg font-semibold mb-2">Top News</h3>
        <div className="overflow-y-auto h-64">
          {news.map((article, index) => (
            <div key={index} className="bg-white/5 p-2 rounded-lg mb-2">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300"
              >
                <h4 className="text-sm font-medium line-clamp-2">
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
      </motion.div> */}
      {/* Add after Mars Weather, before the closing main tag */}
      {marsWeather && (
        <motion.div
          className="absolute top-4 right-4 bg-white/10 p-4 rounded-lg shadow-lg "
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Mars Weather content */}
        </motion.div>
      )}

      {/* Add TopCities component */}
      <motion.div
        className="absolute top-4 right-72 w-64"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <TopCities />
      </motion.div>

      {/* Move LocalBusinesses component to the left side */}
      <motion.div
        className="absolute top-96 left-4 w-80"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <LocalBusinesses />
      </motion.div>

      {/* Rest of your components */}
      </main>
  );
}
