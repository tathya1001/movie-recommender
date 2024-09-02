import React, { useState } from 'react';

function App() {
  const [movie, setMovie] = useState('');
  const [responseContent, setResponseContent] = useState(null);
  const [posters, setPosters] = useState([]);
  // console.log(import.meta.env.VITE_TMDB_API_KEY);

  const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted");

    fetch(`https://watchthisnextapi.vercel.app/recommend/${movie}`)
      .then(response => response.json())
      .then(data => {
        setResponseContent(data);
        console.log("Response:", JSON.stringify(data));

        const posterPromises = data.recommendations.map(rec =>
          fetch(`https://api.themoviedb.org/3/movie/${rec.movie_id}?api_key=18801745663fe6b9442bb058ce026e76`)
            .then(response => response.json())
        );

        Promise.all(posterPromises)
          .then(results => {
            const posterUrls = results.map(movie => ({
              title: movie.title,
              posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            }));
            setPosters(posterUrls);
          })
          .catch(error => console.error('Error fetching posters:', error));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <h1>Movie Recommendation System</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Movie Name:
          <input
            type="text"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            required
          />
        </label>
        <button type="submit">Get Recommendations</button>
      </form>

      {responseContent && (
        <div>
          <h2>Recommendations:</h2>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {posters.map((poster, index) => (
              <div key={index} style={{ margin: '10px' }}>
                <h3>{poster.title}</h3>
                <img src={poster.posterUrl} alt={poster.title} style={{ width: '200px' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
