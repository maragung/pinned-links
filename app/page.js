'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/');
        const data = await res.json();
        if (data?.links) {
          setLinks(data.links);
        }
      } catch (error) {
        console.error("Failed to fetch links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLinks = links.filter(link =>
    link.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied!');
    } catch {
      alert('Failed to copy.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 px-4 py-8 sm:px-6 lg:px-8 font-sans text-gray-800 dark:text-white transition">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 rounded-md p-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-700 shadow-sm">
          📌 Pinned Links
        </h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search label..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center text-gray-500 py-10">
            <svg className="animate-spin h-5 w-5 mr-2 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
            </svg>
            Loading...
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">No links found.</div>
        ) : (
          <ul className="space-y-4">
            {filteredLinks.map((link, idx) => (
              <li key={idx}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow hover:shadow-lg p-4 flex justify-between items-center transition">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-medium text-lg break-words flex items-center hover:underline"
                >
                  <svg className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.3 5.3l-1.3 6.9c-.1.5-.4.7-.8.4L12 9.7l-2.7 2.2-4.1 1.3c-.5.1-.9-.2-.8-.7l1.3-6.9c.1-.5.4-.7.8-.4L12 14.3l2.7-2.2 4.1-1.3c.5-.1.9.2.8.7z"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
