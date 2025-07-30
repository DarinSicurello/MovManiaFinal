import React, { useEffect, useState } from 'react';
import NewMovie from './NewMovie'; 

type MovieItem = {
  title: string;
  rating: number;
};

const LOCAL_STORAGE_KEY = 'movieReviewList';

const MovieReview: React.FC = () => {
  const [items, setItems] = useState<MovieItem[]>([]);
  const [newItem, setNewItem] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleAddItem = (): void => {
    if (newItem.trim() === '') return;
    setItems((prev) => [...prev, { title: newItem, rating: 0 }]);
    setNewItem('');
  };

  const handleDelete = (index: number): void => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRating = (index: number, rating: number): void => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, rating } : item))
    );
  };

  return (
    <div className="main-con d-flex">
    <div className="left-section me-4">
        <h2>Movie Review</h2>
        <label htmlFor="user-input">New Movie:</label>
        <input
          type="text"
          id="user-input"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Avatar..."
          className="form-control my-2"
        />
        <button className="btn btn-primary mb-3" onClick={handleAddItem}>
          Submit New Movie
        </button>

        <div className="item-container">
          {items.map((item, index) => (
            <div
              key={index}
              className="item-box d-flex justify-content-between align-items-center mb-2 p-2 border"
            >
              <div>
                <strong>{item.title}</strong>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        color: star <= item.rating ? '#ffc107' : '#e4e5e9',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        marginRight: '4px',
                      }}
                      onClick={() => handleRating(index, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* New empty right section with just header */}
      <NewMovie />
    </div>
  );
};

export default MovieReview;
