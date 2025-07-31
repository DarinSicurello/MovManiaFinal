import React, { useState } from 'react';
import './MovieGenerator.css';

const MOVIE_API_KEY = '4eaba85f'; // Your OMDb API key UPDATED from separate JS file

// Loader Spinner Component as there is delay
const Loader = () => (
  <div className="text-center mt-4">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Simple "Fisher-Yates" shuffle to randomize the keyword list
const shuffleArray = (array: string[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/***** Movie Generator Component *****/
export default function MovieGenerator() {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const curatedKeywords = [ /* ... your full keyword list remains unchanged ... */ 
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
  'whisper', 'zenith', 'red','blue', 'green', 'black', 'white', 'yellow', 'purple',
  'orange', 'silver', 'gold','one', 'two', 'three', 'four', 'five', 'six', 'seven',
  'eight', 'nine', 'ten'
  ];

  const fetchMovie = async () => {
    const maxRetries = 5;
    const shuffledKeywords = shuffleArray(curatedKeywords);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const randomSearch = shuffledKeywords[attempt % shuffledKeywords.length];
      const randomPage = Math.floor(Math.random() * 3) + 1;

      console.log(`🔍 Attempt ${attempt + 1}: Searching OMDb with s=${randomSearch}&page=${randomPage}`);

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
          return fullData;
        } else {
          console.warn(`No movies found or error for: ${randomSearch} - ${searchData.Error || ''}`);
        }
      } catch (error) {
        console.error(`Error fetching...:`, error);
      }
    }

    console.error('Max retries reached... no movie found.');
    return null;
  };

  const onFetchMovieClick = async () => {
    setLoading(true);
    const data = await fetchMovie();
    setMovie(data);
    setLoading(false);
  };

  const saveMovieToJson = async () => {
    if (!movie) return;

    const movieData = {
      title: movie.Title,
      type: movie.Type,
      year: movie.Year,
      plot: movie.Plot,
    };

    try {
      const res = await fetch('http://localhost:3001/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData),
      });

      if (res.ok) {
        alert('Movie saved to JSON file!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      console.error('Error saving movie:', err);
    }
  };

  const downloadMovieJson = () => {
    if (!movie) return;

    const dataStr = JSON.stringify(
      {
        title: movie.Title,
        type: movie.Type,
        year: movie.Year,
        plot: movie.Plot,
      },
      null,
      2
    );

    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${movie.Title.replace(/\s+/g, '_')}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // renderMovie fallback for placeholder
  const renderMovie = (movie: any) => {
    const posterSrc =
      movie.Poster && movie.Poster !== 'N/A'
        ? movie.Poster
        : '/images/placeholder.jpg';

    return (
      <div className="mt-4 p-3 border rounded bg-light" id="movie-container">
        <img className="img-thumbnail mb-2" src={posterSrc} alt={movie.Title} />
        <h5>{movie.Title}</h5>
        <p>{movie.Plot}</p>
        <button className="btn btn-success mt-2 me-2" onClick={saveMovieToJson}>
          Save
        </button>
        <button className="btn btn-outline-secondary mt-2" onClick={downloadMovieJson}>
          Download JSON
        </button>
      </div>
    );
  };

  return (
    <div className="movie-generator-container">
      <h2>Friday Night Movie Generator</h2>
      <button className="btn btn-primary" onClick={onFetchMovieClick} disabled={loading}>
        {loading ? 'Loading...' : 'Generate New Movie'}
      </button>

      {loading && <Loader />}

      {!movie && !loading && (
        <div className="mt-4" id="movie-placeholder">
          <img
            src="/images/placeholder.jpg"
            alt="Placeholder"
            className="img-thumbnail"
          />
        </div>
      )}

      {movie && renderMovie(movie)}
    </div>
  );
}
