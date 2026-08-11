// In-memory mock backend. Used only while VITE_USE_MOCKS=true (see .env.example).
// Shapes here are exactly what the real endpoints documented in each api/*.js
// file are expected to return, so switching mocks off should require no
// component changes — only real HTTP calls need to be wired up.

let idCounter = 100;
export const nextId = () => String(idCounter++);

export const mockUsers = [
  { id: "u1", name: "Alex Rivera", email: "alex.rivera@example.com", role: "member" },
  { id: "u2", name: "Morgan Adeyemi", email: "morgan.adeyemi@example.com", role: "admin" },
];

export const mockMovies = [
  {
    id: "m1",
    title: "Neon Frontier",
    genre: "Sci-Fi",
    durationMinutes: 142,
    rating: "PG-13",
    description: "A colony ship crew uncovers a signal that shouldn't exist.",
    posterUrl: "https://picsum.photos/seed/neon-frontier/300/450",
  },
  {
    id: "m2",
    title: "The Venetian Heist",
    genre: "Thriller",
    durationMinutes: 118,
    rating: "R",
    description: "Five strangers, one vault, one night in Venice.",
    posterUrl: "https://picsum.photos/seed/venetian-heist/300/450",
  },
  {
    id: "m3",
    title: "Ember & Ash",
    genre: "Drama",
    durationMinutes: 126,
    rating: "PG-13",
    description: "A firefighter returns home to the town she once fled.",
    posterUrl: "https://picsum.photos/seed/ember-ash/300/450",
  },
  {
    id: "m4",
    title: "Razorback",
    genre: "Action",
    durationMinutes: 108,
    rating: "R",
    description: "An ex-marine takes on a smuggling ring in the outback.",
    posterUrl: "https://picsum.photos/seed/razorback/300/450",
  },
  {
    id: "m5",
    title: "The Laughing Fox",
    genre: "Comedy",
    durationMinutes: 95,
    rating: "PG",
    description: "A con artist fox tries to go straight — badly.",
    posterUrl: "https://picsum.photos/seed/laughing-fox/300/450",
  },
  {
    id: "m6",
    title: "Whispers in the Deep",
    genre: "Horror",
    durationMinutes: 112,
    rating: "R",
    description: "A salvage crew hears something answering back from the wreck.",
    posterUrl: "https://picsum.photos/seed/whispers-deep/300/450",
  },
];

export const mockTheaters = [
  {
    id: "t1",
    name: "Grand Hall",
    rows: 9,
    seatsPerRow: 14,
    description: "Our flagship 126-seat auditorium with Dolby Atmos.",
  },
  {
    id: "t2",
    name: "Premiere Suite",
    rows: 7,
    seatsPerRow: 12,
    description: "Premium 84-seat hall with reclining seats.",
  },
  {
    id: "t3",
    name: "Studio Screen",
    rows: 6,
    seatsPerRow: 10,
    description: "Intimate 60-seat arthouse screen.",
  },
];

const capacity = (theaterId) => {
  const t = mockTheaters.find((x) => x.id === theaterId);
  return t.rows * t.seatsPerRow;
};

export const mockShowtimes = [
  { id: "s1", movieId: "m1", theaterId: "t1", startTime: "2026-07-29T14:30:00", price: 16, bookedSeats: [] },
  { id: "s2", movieId: "m1", theaterId: "t2", startTime: "2026-07-29T19:00:00", price: 18, bookedSeats: [] },
  { id: "s3", movieId: "m1", theaterId: "t1", startTime: "2026-07-30T11:00:00", price: 14, bookedSeats: [] },
  { id: "s4", movieId: "m2", theaterId: "t2", startTime: "2026-07-29T16:45:00", price: 18, bookedSeats: [] },
  { id: "s5", movieId: "m2", theaterId: "t3", startTime: "2026-07-29T21:00:00", price: 16, bookedSeats: [] },
  { id: "s6", movieId: "m2", theaterId: "t1", startTime: "2026-07-30T18:30:00", price: 18, bookedSeats: [] },
  { id: "s7", movieId: "m3", theaterId: "t3", startTime: "2026-07-29T13:00:00", price: 14, bookedSeats: [] },
  { id: "s8", movieId: "m3", theaterId: "t2", startTime: "2026-07-30T20:15:00", price: 18, bookedSeats: [] },
  { id: "s9", movieId: "m4", theaterId: "t1", startTime: "2026-07-29T17:00:00", price: 16, bookedSeats: [] },
  { id: "s10", movieId: "m4", theaterId: "t2", startTime: "2026-07-30T14:00:00", price: 16, bookedSeats: [] },
  { id: "s11", movieId: "m5", theaterId: "t3", startTime: "2026-07-29T15:30:00", price: 14, bookedSeats: [] },
].map((s) => ({ ...s, capacity: capacity(s.theaterId) }));

export const mockBookings = [];
