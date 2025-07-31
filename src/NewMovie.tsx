import React, { useEffect, useState } from 'react';
import './NewMovie.css';

const MOVIE_API_KEY = '4eaba85f'; // Your OMDb API key UPDATED limited to 1,000 per day

//Copy Keywprds from movie Gnerator
const curatedKeywords = [
  'star', 'love', 'war', 'dark', 'life', 'ghost', 'night', 'hero',
  'vortex', 'sanctuary', 'clash', 'ascend', 'fate', 'relic', 'spire', 'echoes',
  'star', 'love', 'war', 'dark', 'life', 'ghost', 'night', 'hero',
  'vortex', 'sanctuary', 'clash', 'ascend', 'fate', 'relic', 'spire', 'echoes',
  'legend', 'shadow', 'hunt', 'dream', 'fire', 'ice', 'lost', 'found', 'storm',
  'code', 'zero', 'blade', 'matrix', 'king', 'queen', 'throne', 'empire',
  'cyber', 'alien', 'robot', 'return', 'mission', 'danger', 'blood', 'maze',
  'escape', 'revenge', 'time', 'future', 'past', 'signal', 'abyss', 'edge',
  'rift', 'hollow', 'curse', 'justice', 'infinite', 'rise', 'fall', 'blade',
  'phantom', 'dragon', 'nova', 'pulse', 'rift', 'shadow', 'storm', 'terra',
  'chaos', 'myth', 'quest', 'realm', 'saga', 'titan', 'valor', 'wrath', 'zenith',
  'alchemy', 'beyond', 'celestial', 'dawn', 'ember', 'fury', 'glory', 'harvest',
  'iceberg', 'jungle', 'kingdom', 'labyrinth', 'monsoon', 'nebula', 'oracle',
  'paradox', 'quasar', 'radiance', 'spectrum', 'tempest', 'unseen', 'voyage',
  'whisper', 'zenith', 'red', 'blue', 'green', 'black', 'white', 'yellow', 'purple',
  'orange', 'silver', 'gold','one', 'two', 'three', 'four', 'five', 'six', 'seven',
  'eight', 'nine', 'ten'
];

// Updated and shared from Movie gnerator Code Shuffle array using Fisher-Yates
const shuffleArray = (array: string[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Loader Spinner Component from Movie Generator code
const Loader = () => (
  <div className="text-center mt-4">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);
// MovieData  from the API JSON format
type MovieData = {
  Title: string;
  Poster: string;
  imdbID: string;
};
// New Movie Gnerator on open wiht limited timer
const NewMovie: React.FC = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
//UPDATED Copy fetch from Movie Gnerator
  const fetchRandomMovie = async (): Promise<MovieData | null> => {
    const maxRetries = 5;
    const shuffledKeywords = shuffleArray(curatedKeywords);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const randomSearch = shuffledKeywords[attempt % shuffledKeywords.length];
      const randomPage = Math.floor(Math.random() * 3) + 1;

      try {
        const searchRes = await fetch(
          `https://www.omdbapi.com/?apikey=${MOVIE_API_KEY}&type=movie&s=${randomSearch}&page=${randomPage}`
        );
        const searchData = await searchRes.json();

        if (searchData.Response === 'True' && searchData.Search.length > 0) {
          const randomMovie = searchData.Search[Math.floor(Math.random() * searchData.Search.length)];

          const fullRes = await fetch(
            `https://www.omdbapi.com/?apikey=${MOVIE_API_KEY}&i=${randomMovie.imdbID}&plot=short`
          );
          const fullData = await fullRes.json();

          if (fullData && fullData.Poster && fullData.Poster !== 'N/A') {
            return fullData;
          }
        } else if (searchData.Error === 'Invalid API key!') {
          throw new Error('Invalid API key!');
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        if (err.message === 'Invalid API key!') {
          throw err; // fatal error UPDATED
        }
      }
    }

    return null;
  };
  // Fetech movies with limited Maxattempts..
  const fetchValidMovies = async (count: number): Promise<MovieData[]> => {
    const fetched: MovieData[] = [];
    const usedIds = new Set<string>();
    let attempts = 0;
    const maxAttempts = count * 5;

    while (fetched.length < count && attempts < maxAttempts) {
      try {
        const movie = await fetchRandomMovie();
        attempts++;

        if (movie && !usedIds.has(movie.imdbID)) {
          fetched.push(movie);
          usedIds.add(movie.imdbID);
        }
      } catch (err: any) {
        throw err;
      }
    }

    return fetched;
  };
 // UseEffect react for loading the poster files
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await fetchValidMovies(5);

        if (results.length === 0) {
          setError('No valid movies found. Try again later.');
        }

        setMovies(results);
      } catch (err: any) {
        if (err.message === 'Invalid API key!') {
          setError('Invalid API key...');
        } else {
          setError('Failed to load movies....');
        }
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);
  //render movie block for poster size import Css code
  const renderMovieBox = (movie: MovieData, className: string) => (
    <div className={className} key={movie.imdbID}>
      <img
        src={movie.Poster}
        alt={movie.Title}
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
  // Movie container to load inside the box via CSS Code 
  return (
    <div className="right-section">
      <h2>New Movies</h2>

      {loading && <Loader />}

      {!loading && error && <p className="text-danger mt-3">{error}</p>}

      {!loading && !error && movies.length > 0 && (
        <div className="movie-container-row">
          {movies.map((movie, index) =>
            renderMovieBox(
              movie,
              `movie-generator-container-${String.fromCharCode(65 + index)}`
            )
          )}
        </div>
      )}
    </div>
  );
};

export default NewMovie;
