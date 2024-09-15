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
    <div className="min-h-screen p-8 bg-gray-900 flex items-center justify-center font-custom">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 max-w-3xl w-full">
        <h1 className="text-3xl md:text-6xl sm:text-4xl font-semibold text-center text-white mb-6">WatchThisNext</h1>
        <form onSubmit={handleSubmit} className="flex items-center max-h-10">

          <input
            type="text"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            required
            placeholder='Enter Movie Name'
            className="w-full px-3 py-2 border text-lg border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-2 text-lg bg-yellow-500 text-yellow-900 font-bold py-2 px-4 rounded-lg hover:opacity-50 transition duration-200"
          >
            Recommend
          </button>
        </form>


        {responseContent && (
          <div className="mt-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-white opacity-50 mb-4">Recommendations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posters.map((poster, index) => (
                <div key={index} className="bg-gray-700 rounded-xl overflow-hidden shadow-md">
                  <img
                    src={poster.posterUrl}
                    alt={poster.title}
                    className="w-full h-auto p-2 rounded-2xl"
                  />
                  <h3 className="px-2 pb-2 text-center font-medium truncate text-white">{poster.title}</h3>
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
