'use client';

import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: string;
}

interface BackendEntry {
  author: string;
  stage: string;
  status: string;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      console.log("Fetching leaderboard data...");

      try {
        // Make the API call
        const res = await fetch('/api/scrape');
        console.log('API response status:', res.status); // Log the status of the response

        if (!res.ok) {
          throw new Error('Failed to fetch leaderboard data, status code: ' + res.status);
        }

        const data: BackendEntry[] = await res.json();
        console.log('Data received from backend:', data); // Log the received data

        // Check if data is valid before mapping
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Received invalid or empty data from the backend');
        }

        // Map the fetched data to the frontend structure
        const mappedData = data.map((entry, index) => ({
          rank: index + 1,  // Add rank based on the index
          name: entry.author,  // Use author as name
          score: entry.status || 'No score',  // Provide fallback if status is missing
        }));

        // Set the mapped data to the state
        setLeaderboardData(mappedData);
        console.log('Mapped leaderboard data:', mappedData); // Log the mapped data
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="leaderboard-container">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.rank}</td>
              <td>{entry.name}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .leaderboard-container {
          padding: 20px;
          background-color: #a21d21; /* Stanford Cardinal Red */
          border-radius: 8px;
          color: white;
        }
        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
        }
        .leaderboard-table th,
        .leaderboard-table td {
          padding: 8px 12px;
          text-align: center;
        }
        .leaderboard-table th {
          background-color: #8e1111; /* Darker Stanford Cardinal Red */
        }
        .leaderboard-table tr:nth-child(even) {
          background-color: #d94b4b; /* Lighter Stanford Cardinal Red */
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;