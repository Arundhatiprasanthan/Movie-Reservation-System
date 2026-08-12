import React, { useState } from 'react';
import { Search, Ticket } from 'lucide-react';

const DEFAULT_FILMS = [
  {
    id: 1,
    title: 'Neon Frontier',
    genre: 'Sci-Fi',
    duration: '142m',
    rating: 'PG-13',
    year: '2026',
    director: 'Alex Rivera',
    cast: 'David Chen, Sarah Jenkins, Lucas Vance',
    description: 'In a neon-drenched metropolis controlled by artificial intelligence, a rogue operative discovers a dark conspiracy that threatens to erase human consciousness.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'The Venetian Heist',
    genre: 'Thriller',
    duration: '118m',
    rating: 'R',
    year: '2026',
    director: 'Marco Rossi',
    cast: 'Elena Vance, Lucas Thorne, Roberto Blanc',
    description: 'An international team of master thieves plan an audacious robbery during the high tide festival in Venice, navigating treacherous waters and betrayal.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Ember & Ash',
    genre: 'Drama',
    duration: '126m',
    rating: 'PG-13',
    year: '2025',
    director: 'Sofia Al-Mansoor',
    cast: 'Claire Redfield, Julian Vance, Hannah Kim',
    description: 'A powerful family saga following two estranged siblings fighting to protect their ancestral vineyard amidst environmental challenges.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Razorback',
    genre: 'Action',
    duration: '108m',
    rating: 'R',
    year: '2026',
    director: 'Jaxom Steele',
    cast: 'Marcus Stone, Amanda Drake, Ray Jackson',
    description: 'Stranded in the unforgiving Australian wilderness, a former special ops officer must outsmart a ruthless mercenary syndicate.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'The Laughing Fox',
    genre: 'Comedy',
    duration: '95m',
    rating: 'PG',
    year: '2026',
    director: 'Oliver Hayes',
    cast: 'Benny Hill, Zoe Cooper, Charles Sterling',
    description: 'An eccentric estate manager accidentally hosts three competing wedding parties at the exact same English manor on the same weekend.',
    poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'Whispers in the Deep',
    genre: 'Horror',
    duration: '112m',
    rating: 'R',
    year: '2026',
    director: 'Naomi Watts',
    cast: 'Ethan Hawke, Maya Lin, Sam Rockwell',
    description: 'Deep sea oceanographers investigating an unmapped trench discover an ancient underwater structure harboring horrors from beyond time.',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop'
  }
];

export default function FilmsCatalog({ films = DEFAULT_FILMS, onSelectFilm }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Sci-Fi', 'Thriller', 'Drama', 'Action', 'Comedy', 'Horror'];

  const filteredFilms = films.filter(film => {
    const matchesSearch = film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (film.director && film.director.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre = selectedGenre === 'All' || film.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="public-films-container">
      {/* Hero Theater Background with exact user requested photo-1489599849927 Unsplash image */}
      <div
        style={{
          position: 'absolute',
          top: '-10.5rem',
          left: '-3.5rem',
          right: '-3.5rem',
          height: '560px',
          backgroundImage: `linear-gradient(180deg, rgba(8, 9, 14, 0.2) 0%, rgba(8, 9, 14, 0.7) 75%, #08090E 100%), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.55,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Hero Content Section */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="films-header-subtitle">NOW SHOWING</div>
        <h1 className="films-header-title">This Week's Films</h1>

        {/* Toolbar */}
        <div className="films-filter-toolbar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon-left" />
            <input
              type="text"
              className="search-input-field"
              placeholder="Search by title or director..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="genre-pills-row">
            {genres.map(g => (
              <button
                key={g}
                type="button"
                className={`genre-pill-btn ${selectedGenre === g ? 'active' : ''}`}
                onClick={() => setSelectedGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Movie Cards Grid with Hover Animation */}
        <div className="poster-cards-grid">
          {filteredFilms.map(film => (
            <div
              key={film.id}
              className="poster-card-item"
              onClick={() => onSelectFilm && onSelectFilm(film)}
            >
              <div className="poster-image-frame">
                <img src={film.poster} alt={film.title} className="poster-image-img" />
                <span className="poster-rating-tag">{film.rating}</span>

                {/* Hover Animation Overlay */}
                <div className="poster-hover-overlay">
                  <button className="poster-hover-btn">
                    <Ticket size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    Reserve Seats
                  </button>
                </div>
              </div>
              <div className="poster-card-title">{film.title}</div>
              <div className="poster-card-meta">{film.genre} · {film.duration}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
