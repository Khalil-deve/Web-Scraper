// app/api/search/route.js
import puppeteer from 'puppeteer';

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return Response.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    try {
      const page = await browser.newPage();
      
      // Set user agent to avoid being blocked
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // Set viewport
      await page.setViewport({ width: 1280, height: 720 });
      
      // Array to store results from different sources
      let results = [];
      
      // Try IMDb first
      try {
        console.log(`Searching IMDb for: ${query}`);
        const imdbResult = await searchIMDb(page, query);
        if (imdbResult) {
          results.push({ ...imdbResult, source: 'IMDb' });
        }
      } catch (imdbError) {
        console.error('IMDb search failed:', imdbError);
      }
      
      // If no results from IMDb, try Rotten Tomatoes
      if (results.length === 0) {
        try {
          console.log(`Searching Rotten Tomatoes for: ${query}`);
          await delay(1000); // Be polite between requests
          const rtResult = await searchRottenTomatoes(page, query);
          if (rtResult) {
            results.push({ ...rtResult, source: 'Rotten Tomatoes' });
          }
        } catch (rtError) {
          console.error('Rotten Tomatoes search failed:', rtError);
        }
      }
      
      // If still no results, try TMDB
      if (results.length === 0) {
        try {
          console.log(`Searching TMDB for: ${query}`);
          await delay(1000);
          const tmdbResult = await searchTMDB(page, query);
          if (tmdbResult) {
            results.push({ ...tmdbResult, source: 'TMDB' });
          }
        } catch (tmdbError) {
          console.error('TMDB search failed:', tmdbError);
        }
      }
      
      // If we have results, return all movies
      if (results.length > 0) {
        // Flatten any nested arrays and return all movies
        const allMovies = [];
        for (const result of results) {
          if (Array.isArray(result)) {
            allMovies.push(...result);
          } else {
            allMovies.push(result);
          }
        }
        return Response.json(allMovies);
      } else {
        return Response.json({ error: 'No results found across all sources' }, { status: 404 });
      }
      
    } finally {
      await browser.close();
    }
    
  } catch (error) {
    console.error('Scraping error:', error);
    return Response.json({ error: 'Failed to fetch movie data' }, { status: 500 });
  }
}

// IMDb Search Function
async function searchIMDb(page, query) {
  try {
    await page.goto(`https://www.imdb.com/find?q=${encodeURIComponent(query)}&s=tt&ttype=ft`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    // Wait for search results to load
    await page.waitForSelector('.findResult, .ipc-metadata-list-summary-item, .find-title-result', { timeout: 10000 });
    
    // Get the first few search results (not just one)
    const searchResults = await page.evaluate(() => {
      const results = [];
      // Try multiple selectors for different IMDb layouts
      const resultElements = document.querySelectorAll('.ipc-metadata-list-summary-item, .findResult, .find-title-result');
      
      for (const element of resultElements) {
        if (results.length >= 5) break; // Limit to 5 results
        
        const linkElement = element.querySelector('a[href*="/title/"]');
        const titleElement = element.querySelector('.ipc-metadata-list-summary-item__t, [data-testid="find-title-result-title"]');
        
        if (linkElement && titleElement) {
          results.push({
            title: titleElement.textContent.trim(),
            url: linkElement.href
          });
        }
      }
      
      return results;
    });
    
    // Process all results (up to 5)
    const detailedResults = [];
    for (const result of searchResults) {
      try {
        await page.goto(result.url, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });
        
        // Wait for page to load
        await page.waitForSelector('h1, [data-testid="hero__pageTitle"]', { timeout: 10000 });
        
        const movieData = await page.evaluate(() => {
          // Helper function to extract text
          const getText = (selectors) => {
            if (typeof selectors === 'string') selectors = [selectors];
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              if (element && element.textContent && element.textContent.trim()) {
                return element.textContent.trim();
              }
            }
            return null;
          };

          // Helper function to extract attribute
          const getAttribute = (selectors, attribute) => {
            if (typeof selectors === 'string') selectors = [selectors];
            for (const selector of selectors) {
              const element = document.querySelector(selector);
              if (element && element.getAttribute(attribute)) {
                return element.getAttribute(attribute);
              }
            }
            return null;
          };

          // Extract data with multiple fallback selectors
          const title = getText([
            '[data-testid="hero__pageTitle"]',
            'h1[data-testid="hero__pageTitle"]',
            'h1.hero__pageTitle',
            'h1'
          ]);
          
      const year = getText([
        '[data-testid="hero__pageTitle"] + ul li:first-child a',
        '.hero__pageTitle + ul li:first-child a',
        'h1 + ul li:first-child a',
        '.title_wrapper h1 + .subtext a',
        '.subtext a[href*="releaseinfo"]',
        '.title_wrapper .subtext a[href*="releaseinfo"]'
      ]);
          
          const rating = getText([
            '[data-testid="hero-rating-bar__aggregate-rating__score"] span:first-child',
            '.rating-other-user-rating span',
            '.ratingValue strong span',
            '.imdbRating span'
          ]);
          
          const posterUrl = getAttribute([
            '[data-testid="hero-media__poster"] img',
            '.poster img',
            '.ipc-media img',
            'img[alt*="poster"]'
          ], 'src');
          
          const description = getText([
            '[data-testid="plot"] span:first-child',
            '.plot_summary .summary_text',
            '.plot_summary_wrapper .summary_text',
            '.plot'
          ]);
          
      // Extract genres with multiple selectors
      let genres = null;
      const genreSelectors = [
        '[data-testid="genres"] a',
        '.subtext a[href*="genres"]',
        '.title_wrapper .subtext a[href*="genres"]',
        '.subtext a[href*="genre"]',
        '.title_wrapper .subtext a[href*="genre"]',
        '.genres a'
      ];
      
      for (const selector of genreSelectors) {
        const genreElements = document.querySelectorAll(selector);
        if (genreElements.length > 0) {
          const genreTexts = Array.from(genreElements)
            .map(el => el.textContent.trim())
            .filter(text => text && !text.includes('min') && !text.includes('year'));
          if (genreTexts.length > 0) {
            genres = genreTexts.join(', ');
            break;
          }
        }
      }

      return {
        title: title || 'Unknown Title',
        year: year || 'Unknown Year',
        rating: rating || 'N/A',
        genres: genres || 'Unknown Genre',
        posterUrl,
        description: description || 'No description available',
        imdbUrl: window.location.href,
        imdbRating: rating || 'N/A',
        source: 'IMDb'
      };
        });
        
        if (movieData.title) {
          detailedResults.push(movieData);
        }
        
        // Return to search results page for next result
        await page.goBack({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.findResult, .ipc-metadata-list-summary-item', { timeout: 10000 });
        
      } catch (e) {
        console.error(`Error processing IMDb result: ${e.message}`);
        // Continue with next result
      }
    }
    
    return detailedResults;
    
  } catch (error) {
    console.error('IMDb search error:', error);
    return null;
  }
}

// Rotten Tomatoes Search Function
async function searchRottenTomatoes(page, query) {
  try {
    await page.goto(`https://www.rottentomatoes.com/search?search=${encodeURIComponent(query)}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    // Wait for search results
    await page.waitForSelector('.search-results, [data-qa="search-results"]', { timeout: 10000 });
    
    const results = await page.evaluate(() => {
      const movieResults = [];
      const elements = document.querySelectorAll('.search-row, search-page-media-row, [data-qa="search-result"]');
      
      for (const element of elements) {
        if (movieResults.length >= 3) break;
        
        const titleElement = element.querySelector('a[data-qa="search-result-link"], a.search-row__link');
        const yearElement = element.querySelector('.search-row__year, [data-qa="search-result-year"]');
        const scoreElement = element.querySelector('.percentage, .search-row__audience-score, [data-qa="audience-score"]');
        const posterElement = element.querySelector('img[data-qa="poster-image"], img.search-row__poster');
        
        if (titleElement) {
          movieResults.push({
            title: titleElement.textContent.trim(),
            year: yearElement ? yearElement.textContent.trim() : null,
            rating: scoreElement ? scoreElement.textContent.trim() : null,
            posterUrl: posterElement ? posterElement.src : null,
            url: titleElement.href
          });
        }
      }
      
      return movieResults;
    });
    
    return results;
    
  } catch (error) {
    console.error('Rotten Tomatoes search error:', error);
    return null;
  }
}

// TMDB Search Function (The Movie Database)
async function searchTMDB(page, query) {
  try {
    await page.goto(`https://www.themoviedb.org/search?query=${encodeURIComponent(query)}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    // Wait for search results
    await page.waitForSelector('.search_results, .card', { timeout: 10000 });
    
    const results = await page.evaluate(() => {
      const movieResults = [];
      const elements = document.querySelectorAll('.card, .search_result');
      
      for (const element of elements) {
        if (movieResults.length >= 3) break;
        
        const titleElement = element.querySelector('h2 a, .title a');
        const yearElement = element.querySelector('.release_date, .date');
        const posterElement = element.querySelector('img.poster, img');
        
        if (titleElement) {
          movieResults.push({
            title: titleElement.textContent.trim(),
            year: yearElement ? yearElement.textContent.trim() : null,
            posterUrl: posterElement ? posterElement.src : null,
            url: titleElement.href
          });
        }
      }
      
      return movieResults;
    });
    
    return results;
    
  } catch (error) {
    console.error('TMDB search error:', error);
    return null;
  }
}