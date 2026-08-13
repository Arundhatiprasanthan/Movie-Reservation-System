// Mock Data for CinéVault Movie Reservation System

export const mockMovies = [
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
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60",
    description: "A mysterious celestial event changes the fate of humanity as one astronaut uncovers secrets hidden beyond our solar system.",
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
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60",
    description: "An elite special forces officer races against time to stop a dangerous criminal syndicate before an entire city falls into chaos.",
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
    poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=60",
    description: "A detective receives anonymous clues that lead to a chilling conspiracy where every answer uncovers an even darker secret.",
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
    poster: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500&auto=format&fit=crop&q=60",
    description: "Two strangers from different worlds find an unexpected connection that challenges fate, distance, and the choices that define love.",
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
    poster: "https://images.unsplash.com/photo-1505635330303-319530796a4b?w=500&auto=format&fit=crop&q=60",
    description: "After moving into an abandoned mansion, a family begins hearing unsettling whispers that awaken an ancient evil hidden within its walls.",
  },
];

export const mockTheaters = [
  { id: 1, name: "Screen 1 - Dolby Atmos", rows: 6, cols: 10, capacity: 60 },
  { id: 2, name: "Screen 2 - VIP Lounge", rows: 4, cols: 8, capacity: 32 },
  { id: 3, name: "Screen 3 - IMAX 3D", rows: 8, cols: 12, capacity: 96 }
];

export const mockShowtimes = [
  { id: 101, movieId: 1, theaterId: 1, time: "01:30 PM", date: "Today", type: "Dolby Atmos", priceMultiplier: 1.2 },
  { id: 102, movieId: 1, theaterId: 2, time: "07:00 PM", date: "Today", type: "Premiere Suite", priceMultiplier: 1.5 },
  { id: 103, movieId: 2, theaterId: 3, time: "04:00 PM", date: "Today", type: "IMAX 3D", priceMultiplier: 1.4 },
  { id: 104, movieId: 3, theaterId: 1, time: "09:30 PM", date: "Today", type: "Standard", priceMultiplier: 1.0 },
  { id: 105, movieId: 4, theaterId: 2, time: "11:00 AM", date: "Tomorrow", type: "VIP Lounge", priceMultiplier: 1.3 },
  { id: 106, movieId: 5, theaterId: 3, time: "10:30 PM", date: "Tomorrow", type: "Standard", priceMultiplier: 1.0 }
];

export const initialBookings = [
  {
    id: "B-29831",
    movieId: 1,
    showtimeId: 101,
    userEmail: "member@cinevault.com",
    userName: "Alex Rivera",
    seats: ["C4", "C5"],
    totalAmount: 840,
    bookingDate: "2026-08-11"
  },
  {
    id: "B-12948",
    movieId: 2,
    showtimeId: 103,
    userEmail: "admin@cinevault.com",
    userName: "Nandini",
    seats: ["D6"],
    totalAmount: 420,
    bookingDate: "2026-08-11"
  }
];

export const defaultUsers = [
  {
    email: "admin@cinevault.com",
    name: "Nandini",
    role: "Administrator",
    password: "password123"
  },
  {
    email: "member@cinevault.com",
    name: "Alex Rivera",
    role: "Member",
    password: "password123"
  }
];
