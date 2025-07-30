import React, { useState, useEffect } from 'react';
import { logDebug } from './debug';

// Movie Data Json File
interface Movie {
  id: number;
  title: string;
}

// My local JSON API location
const API_URL = 'http://localhost:3001/movies';

const MovieDatabase: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');

  // Fetch movies from API on mount
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.error('Failed to fetch movies:', err));
  }, []);

  // Add a new film
  const handleAddMovie = (): void => {
    logDebug('Trying to add movie', newTitle, 'info');

    if (newTitle.trim() === '') {
      logDebug('New title is empty, ignoring add.', undefined, 'warn');
      return;
    }

    const newMovie = { title: newTitle };

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMovie),
    })
      .then(res => {
        if (res.status === 201) {
          logDebug('POST response status: 201 (Created)', undefined, 'success');
        } else {
          logDebug(`Unexpected POST response status: ${res.status}`, undefined, 'warn');
        }
        return res.json();
      })
      .then(createdMovie => {
        logDebug('Movie added to database', createdMovie, 'success');
        setMovies(prev => [...prev, createdMovie]);
        setNewTitle('');
      })
      .catch(err => {
        logDebug('Failed to add movie', err, 'error');
      });
  };

  // Delete film
  const handleDelete = (id: number): void => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setMovies(prev => prev.filter(movie => movie.id !== id));
      })
      .catch(err => console.error('Failed to delete movie:', err));
  };

  // Download all movies as JSON
  const handleDownloadMovies = (): void => {
    const dataStr = JSON.stringify(movies, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'movies-database.json';
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="main-con d-flex">
      <div className="left-section me-4">
        <h2>Movie List</h2>
        <label htmlFor="movie-input">New Movie:</label>
        <input
          type="text"
          id="movie-input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Movie title..."
          className="form-control my-2"
        />
        <button className="btn btn-primary" onClick={handleAddMovie}>
          Submit New Movie
        </button>
      </div>

      <div className="right-section">
        <h2>My Movies</h2>
        <button className="btn btn-outline-secondary mb-3" onClick={handleDownloadMovies}>
          Download Movies JSON
        </button>
        <div className="item-container">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="item-box d-flex justify-content-between align-items-center mb-2 p-2 border"
            >
              {movie.title}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(movie.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDatabase;
