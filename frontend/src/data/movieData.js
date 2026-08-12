import eclipse from "../assets/images/movies/eclipse.png";
import rapidStrike from "../assets/images/movies/rapid-strike.png";
import silentReckoning from "../assets/images/movies/silent-reckoning.png";
import beyondForever from "../assets/images/movies/beyond-forever.png";
import whispersDark from "../assets/images/movies/the-whispers-in-the-dark.png";
const movies = [
  {
    id: 1,
    title: "Eclipse",
    genre: "Sci-Fi",
    duration: "2h 28m",
    rating: "8.9",
    certificate: "PG-13",
    year: 2026,
    ticketPrice: 350,
    director: "Aarav Mehta",
    cast: "Vihaan Kapoor, Ananya Rao, Arjun Nair",
    poster: eclipse,
    description:
      "A mysterious celestial event changes the fate of humanity as one astronaut uncovers secrets hidden beyond our solar system.",
  },

  {
    id: 2,
    title: "Rapid Strike",
    genre: "Action",
    duration: "2h 06m",
    rating: "8.2",
    certificate: "UA",
    year: 2026,
    ticketPrice: 300,
    director: "Kabir Sharma",
    cast: "Rohan Malhotra, Ishita Sen, Karan Verma",
    poster: rapidStrike,
    description:
      "An elite special forces officer races against time to stop a dangerous criminal syndicate before an entire city falls into chaos.",
  },

  {
    id: 3,
    title: "Silent Reckoning",
    genre: "Thriller",
    duration: "2h 14m",
    rating: "8.5",
    certificate: "A",
    year: 2026,
    ticketPrice: 320,
    director: "Neha Iyer",
    cast: "Aditi Kapoor, Rahul Khanna, Meera Joshi",
    poster: silentReckoning,
    description:
      "A detective receives anonymous clues that lead to a chilling conspiracy where every answer uncovers an even darker secret.",
  },

  {
    id: 4,
    title: "Beyond Forever",
    genre: "Romance",
    duration: "2h 12m",
    rating: "7.9",
    certificate: "U",
    year: 2026,
    ticketPrice: 280,
    director: "Ritika Desai",
    cast: "Aryan Patel, Kiara Menon, Dev Sharma",
    poster: beyondForever,
    description:
      "Two strangers from different worlds find an unexpected connection that challenges fate, distance, and the choices that define love.",
  },

  {
    id: 5,
    title: "The Whispers in the Dark",
    genre: "Horror",
    duration: "1h 56m",
    rating: "8.3",
    certificate: "A",
    year: 2026,
    ticketPrice: 340,
    director: "Siddharth Rao",
    cast: "Sneha Reddy, Aman Kapoor, Vikram Das",
    poster: whispersDark,
    description:
      "After moving into an abandoned mansion, a family begins hearing unsettling whispers that awaken an ancient evil hidden within its walls.",
  },
];

export default movies;