import React, { useState } from 'react';

function App() {
  const [movie, setMovie] = useState('');
  const [responseContent, setResponseContent] = useState(null);
  const [posters, setPosters] = useState([]);

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
          fetch(`https://api.themoviedb.org/3/movie/${rec.movie_id}?api_key=${tmdbApiKey}`)
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-semibold text-center mb-6">Movie Recommendation System</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-2 font-medium">
            Enter Movie Name:
            <input
              type="text"
              value={movie}
              onChange={(e) => setMovie(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Get Recommendations
          </button>
        </form>

        {responseContent && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Recommendations:</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {posters.map((poster, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                  <h3 className="p-2 text-center font-medium">{poster.title}</h3>
                  <img
                    src={poster.posterUrl}
                    alt={poster.title}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
