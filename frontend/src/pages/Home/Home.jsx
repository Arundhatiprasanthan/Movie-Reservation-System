import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SearchBar from "../../components/SearchBar/SearchBar";
import GenreFilter from "../../components/GenreFilter/GenreFilter";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import LoginModal from "../../components/LoginModal/LoginModal";
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
        <h1 className="page-title">
          This Week's Films
        </h1>

        <SearchBar />

        <GenreFilter />

        <MovieGrid />
      </main>
    </>
  );
}

export default Home;