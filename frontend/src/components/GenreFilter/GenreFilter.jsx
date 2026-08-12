import "./GenreFilter.css";

const genres = [
  "All",
  "Sci-Fi",
  "Action",
  "Thriller",
  "Romance",
  "Horror",
  "Drama",
];

function GenreFilter({ selectedGenre, setSelectedGenre }) {
  return (
    <div className="genre-filter">
      {genres.map((genre) => (
        <button
          key={genre}
          className={(selectedGenre || "All") === genre ? "genre active" : "genre"}
          onClick={() => setSelectedGenre(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;