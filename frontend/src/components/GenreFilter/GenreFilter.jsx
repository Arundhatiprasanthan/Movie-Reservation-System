import "./GenreFilter.css";

const genres = [
  "All",
  "Sci-Fi",
  "Thriller",
  "Drama",
  "Action",
  "Comedy",
  "Horror",
];

function GenreFilter() {
  return (
    <div className="genre-filter">
      {genres.map((genre, index) => (
        <button
          key={genre}
          className={index === 0 ? "genre active" : "genre"}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;