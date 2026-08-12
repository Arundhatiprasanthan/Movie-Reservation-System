import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SearchBar from "../../components/SearchBar/SearchBar";
import GenreFilter from "../../components/GenreFilter/GenreFilter";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import LoginModal from "../../components/LoginModal/LoginModal";
import { fetchPublicMovies } from "../../api/movies";
import fallbackMovies from "../../data/movieData";
import "./Home.css";

function Home({
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
  isAdmin,
  setIsAdmin,
}) {
  const [showLogin, setShowLogin] = useState(false);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      try {
        const fetchedMovies = await fetchPublicMovies(searchQuery, selectedGenre);
        if (fetchedMovies && fetchedMovies.length > 0) {
          setMovies(fetchedMovies);
        } else if (!searchQuery && selectedGenre === "All") {
          setMovies(fallbackMovies);
        } else {
          setMovies([]);
        }
      } catch (err) {
        console.warn("Backend API unavailable, using fallback movies dataset:", err.message);
        // Apply local filter on fallbackMovies
        let filtered = [...fallbackMovies];
        if (selectedGenre !== "All") {
          filtered = filtered.filter((m) =>
            Array.isArray(m.genre)
              ? m.genre.includes(selectedGenre)
              : m.genre.toLowerCase().includes(selectedGenre.toLowerCase())
          );
        }
        if (searchQuery) {
          filtered = filtered.filter(
            (m) =>
              m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.director?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setMovies(filtered);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadMovies();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre]);

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        setUser={setUser}
        setIsLoggedIn={setIsLoggedIn}
        onSignIn={() => setShowLogin(true)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          setUser={setUser}
          setIsAdmin={setIsAdmin}
          onLogin={() => {
            setIsLoggedIn(true);
            setShowLogin(false);
          }}
        />
      )}

      <main className="container home-container">
        <h1 className="page-title">This Week's Films</h1>

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <GenreFilter selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />

        <MovieGrid movies={movies} loading={loading} />
      </main>
    </>
  );
}

export default Home;