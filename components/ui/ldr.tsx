'use client';

import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  author: string;
  stage: string;
  status: string;
  score: number;
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

  const fetchJsonData = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }
      return await res.json();
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error;
    }
  };

  const computeScore = (rank: number, stage: string, status: string): number => {
    let score = 0;
    if (status === 'Needs Review' && stage !== 'Endorsed') {
      score = 1; // bronze
    } else if (status === 'Awaiting Feedback' && stage === 'Idea') {
      score = 3; // silver
    } else if (
      (status === 'Awaiting Endorsement' && stage === 'Idea') ||
      (status === 'Needs Review' && stage === 'Endorsed')
    ) {
      score = 4; // gold
    } else if (stage === 'Endorsed') {
      score = 6; // platinum
    }
    return score;
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const data1: BackendEntry[] = await fetchJsonData('/data/leaderboard.json');
        const data2: BackendEntry[] = await fetchJsonData('/data/leaderboard1.json');
        const data3: BackendEntry[] = await fetchJsonData('/data/leaderboard2.json');

        const allData = [...data1, ...data2, ...data3];

        const mappedData = allData.map((entry, index) => ({
          rank: index + 1,
          author: entry.author,
          stage: entry.stage,
          status: entry.status || 'No status',
          score: computeScore(index + 1, entry.stage, entry.status || 'No status'),
        }));

        setLeaderboardData(mappedData);
      } catch (error) {
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const aggregatedData = leaderboardData.reduce((acc, entry) => {
    if (!acc[entry.author]) {
      acc[entry.author] = {
        platinum: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        totalScore: 0,
      };
    }

    switch (entry.score) {
      case 6:
        acc[entry.author].platinum += 1;
        break;
      case 4:
        acc[entry.author].gold += 1;
        break;
      case 3:
        acc[entry.author].silver += 1;
        break;
      case 1:
        acc[entry.author].bronze += 1;
        break;
      default:
        break;
    }

    acc[entry.author].totalScore =
      acc[entry.author].platinum * 6 +
      acc[entry.author].gold * 4 +
      acc[entry.author].silver * 3 +
      acc[entry.author].bronze * 1;

    return acc;
  }, {} as Record<string, { platinum: number; gold: number; silver: number; bronze: number; totalScore: number }>);

  const finalLeaderboardData = Object.keys(aggregatedData).map((author) => {
    const { platinum, gold, silver, bronze, totalScore } = aggregatedData[author];
    return {
      author,
      platinum,
      gold,
      silver,
      bronze,
      totalScore,
    };
  });

  const sortedLeaderboardData = finalLeaderboardData.sort((a, b) => b.totalScore - a.totalScore);

  const getEmojiForRank = (rank: number) => {
    const emojis = ['🏆', '🥇', '✨'];
    return rank <= 3 ? emojis[rank - 1] : '';
  };

  return (
    <div className="leaderboard-container">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Author</th>
            <th>
              <span className="circle platinum">6pt</span>
            </th>
            <th>
              <span className="circle gold">4pt</span>
            </th>
            <th>
              <span className="circle silver">3pt</span>
            </th>
            <th>
              <span className="circle bronze">1pt</span>
            </th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedLeaderboardData.map((entry, index) => (
            <tr key={index}>
              <td>
                <strong>{index < 3 ? index + 1 : index + 1}</strong> {/* Bold rank for top three */}
              </td>
              <td>
                <strong>{index < 3 ? entry.author : null}</strong>
                {index >= 3 ? entry.author : null} {getEmojiForRank(index + 1)}
              </td>
              <td>{entry.platinum}</td>
              <td>{entry.gold}</td>
              <td>{entry.silver}</td>
              <td>{entry.bronze}</td>
              <td>{entry.totalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .leaderboard-container {
          padding: 20px;
          background-color: #a21d21;
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
          background-color: #8e1111;
        }
        .leaderboard-table tr:nth-child(even) {
          background-color: #d94b4b;
        }
        .circle {
          display: inline-block;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          line-height: 30px;
          text-align: center;
          color: black;
          font-size: 10px;
          font-weight: bold;
        }
        .platinum {
          background-color: #e5e4e2;
        }
        .gold {
          background-color: #ffd700;
        }
        .silver {
          background-color: #c0c0c0;
        }
        .bronze {
          background-color: #cd7f32;
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;
