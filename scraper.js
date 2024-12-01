// Scrape leaderboard data directly from the page, with fraction control
const scrapeData = (frac = 1) => {
  try {
    const leaderboard = [];
    const rows = document.querySelectorAll('table tr');
    
    // Calculate the number of rows to scrape based on the fraction
    const totalRows = rows.length;
    const rowsToScrape = Math.floor(totalRows * frac);

    rows.forEach((row, index) => {
      if (index === 0) return; // Skip header row

      // Stop if we've scraped enough rows based on the fraction
      if (index > rowsToScrape) return;

      const columns = row.querySelectorAll('td');
      if (columns.length > 0) {
        const author = columns[3]?.querySelector('div > div')?.textContent?.trim() || '';
        const stage = columns[7]?.querySelector('div > div > div > span')?.textContent?.trim() || '';
        const status = columns[8]?.querySelector('div > div > div > span')?.textContent?.trim() || '';

        leaderboard.push({ author, stage, status });
      }
    });

    return leaderboard;
  } catch (error) {
    console.error("Error during scraping:", error);
    return [];
  }
};

// Convert data to a Blob and trigger a download
const downloadData = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'leaderboard.json';
  link.click();
};

// Set the fraction of rows to scrape (e.g., 0.5 for 50% of the rows)
const frac = 1; // Change this value between 0 and 1
const leaderboardData = scrapeData(frac);
downloadData(leaderboardData);
