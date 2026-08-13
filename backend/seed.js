const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Movie = require("./models/Movie");
const Theater = require("./models/Theater");
const Screen = require("./models/Screen");
const Showtime = require("./models/Showtime");
const Booking = require("./models/Booking");

// ============================================================
// DATABASE
// ============================================================

const MONGO_URI = process.env.MONGO_URI;

// ============================================================
// USERS
// ============================================================

const usersData = [
  {
    name: "Morgan Adeyemi",
    email: "morgan.adeyemi@example.com",
    password: "Morgan@123",
    role: "admin",
  },
  {
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    password: "Alex@123",
    role: "user",
  },
];

// ============================================================
// MOVIES
// Exact details from frontend movieData.js
// ============================================================

const moviesData = [
  {
    title: "Eclipse",
    genre: ["Sci-Fi"],
    duration: 148,
    description:
      "A mysterious celestial event changes the fate of humanity as one astronaut uncovers secrets hidden beyond our solar system.",
    director: "Aarav Mehta",
    cast: [
      "Vihaan Kapoor",
      "Ananya Rao",
      "Arjun Nair",
    ],
    posterUrl: "",
    rating: "8.9",
    certificate: "PG-13",
    releaseDate: new Date("2026-01-01"),
    isActive: true,
  },

  {
    title: "Rapid Strike",
    genre: ["Action"],
    duration: 126,
    description:
      "An elite special forces officer races against time to stop a dangerous criminal syndicate before an entire city falls into chaos.",
    director: "Kabir Sharma",
    cast: [
      "Rohan Malhotra",
      "Ishita Sen",
      "Karan Verma",
    ],
    posterUrl: "",
    rating: "8.2",
    certificate: "UA",
    releaseDate: new Date("2026-01-01"),
    isActive: true,
  },

  {
    title: "Silent Reckoning",
    genre: ["Thriller"],
    duration: 134,
    description:
      "A detective receives anonymous clues that lead to a chilling conspiracy where every answer uncovers an even darker secret.",
    director: "Neha Iyer",
    cast: [
      "Aditi Kapoor",
      "Rahul Khanna",
      "Meera Joshi",
    ],
    posterUrl: "",
    rating: "8.5",
    certificate: "A",
    releaseDate: new Date("2026-01-01"),
    isActive: true,
  },

  {
    title: "Beyond Forever",
    genre: ["Romance"],
    duration: 132,
    description:
      "Two strangers from different worlds find an unexpected connection that challenges fate, distance, and the choices that define love.",
    director: "Ritika Desai",
    cast: [
      "Aryan Patel",
      "Kiara Menon",
      "Dev Sharma",
    ],
    posterUrl: "",
    rating: "7.9",
    certificate: "U",
    releaseDate: new Date("2026-01-01"),
    isActive: true,
  },

  {
    title: "The Whispers in the Dark",
    genre: ["Horror"],
    duration: 116,
    description:
      "After moving into an abandoned mansion, a family begins hearing unsettling whispers that awaken an ancient evil hidden within its walls.",
    director: "Siddharth Rao",
    cast: [
      "Sneha Reddy",
      "Aman Kapoor",
      "Vikram Das",
    ],
    posterUrl: "",
    rating: "8.3",
    certificate: "A",
    releaseDate: new Date("2026-01-01"),
    isActive: true,
  },
];

// ============================================================
// THEATERS
// Exact details from your mockTheaters
// ============================================================

const theatersData = [
  {
    name: "Grand Hall",
    location: "Not specified",
    rows: 9,
    seatsPerRow: 14,
    description:
      "Our flagship 126-seat auditorium with Dolby Atmos.",
    screenType: "2D",
  },

  {
    name: "Premiere Suite",
    location: "Not specified",
    rows: 7,
    seatsPerRow: 12,
    description:
      "Premium 84-seat hall with reclining seats.",
    screenType: "2D",
  },

  {
    name: "Studio Screen",
    location: "Not specified",
    rows: 6,
    seatsPerRow: 10,
    description:
      "Intimate 60-seat arthouse screen.",
    screenType: "2D",
  },
];

// ============================================================
// SEAT GENERATOR
// ============================================================

function generateSeats(rows, seatsPerRow) {
  const seats = [];

  for (let row = 0; row < rows; row++) {
    const rowLetter = String.fromCharCode(65 + row);

    for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
      seats.push({
        seatLabel: `${rowLetter}${seatNumber}`,
        status: "available",
        heldBy: null,
        holdExpiresAt: null,
      });
    }
  }

  return seats;
}

// ============================================================
// MAIN SEED FUNCTION
// ============================================================

async function seedDatabase() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");
    console.log("Starting database seed...");

    // --------------------------------------------------------
    // CLEAR EXISTING DATA
    // --------------------------------------------------------

    console.log("Clearing existing users, movies, theaters, screens, showtimes and bookings...");

    await Booking.deleteMany({});
    await Showtime.deleteMany({});
    await Screen.deleteMany({});
    await Theater.deleteMany({});
    await Movie.deleteMany({});
    await User.deleteMany({});

    console.log("Existing data cleared.");

    // --------------------------------------------------------
    // USERS
    // --------------------------------------------------------

    const users = [];

    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(
        userData.password,
        10
      );

      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });

      users.push(user);

      console.log(
        `Created ${user.role}: ${user.name} (${user.email})`
      );
    }

    // --------------------------------------------------------
    // MOVIES
    // --------------------------------------------------------

    const movies = await Movie.insertMany(moviesData);

    console.log(`Created ${movies.length} movies.`);

    // Create easy movie lookup by title
    const movieMap = {};

    movies.forEach((movie) => {
      movieMap[movie.title] = movie;
    });

    // --------------------------------------------------------
    // THEATERS + SCREENS
    // --------------------------------------------------------

    const theaterMap = {};
    const screenMap = {};

    for (const theaterData of theatersData) {
      const theater = await Theater.create({
        name: theaterData.name,
        location: theaterData.location,
      });

      theaterMap[theater.name] = theater;

      console.log(`Created theater: ${theater.name}`);

      const screen = await Screen.create({
        theater: theater._id,
        name: `${theater.name} Screen 1`,
        rows: theaterData.rows,
        seatsPerRow: theaterData.seatsPerRow,
        screenType: theaterData.screenType,
      });

      screenMap[theater.name] = screen;

      console.log(
        `Created screen: ${screen.name} (${theaterData.rows} rows × ${theaterData.seatsPerRow} seats)`
      );
    }

    // --------------------------------------------------------
    // SHOWTIMES
    // --------------------------------------------------------
    //
    // All IDs are obtained automatically from MongoDB.
    // No manually copied ObjectIds are required.
    //
    // Date format:
    // YYYY-MM-DDTHH:mm:ss
    //
    // Price is in INR.
    // --------------------------------------------------------

    const showtimesData = [
      // ECLIPSE
      {
        movie: "Eclipse",
        theater: "Grand Hall",
        startTime: "2026-08-15T09:00:00",
        price: 350,
      },
      {
        movie: "Eclipse",
        theater: "Premiere Suite",
        startTime: "2026-08-15T14:30:00",
        price: 400,
      },
      {
        movie: "Eclipse",
        theater: "Studio Screen",
        startTime: "2026-08-16T19:00:00",
        price: 350,
      },

      // RAPID STRIKE
      {
        movie: "Rapid Strike",
        theater: "Grand Hall",
        startTime: "2026-08-15T12:00:00",
        price: 300,
      },
      {
        movie: "Rapid Strike",
        theater: "Premiere Suite",
        startTime: "2026-08-16T15:00:00",
        price: 350,
      },
      {
        movie: "Rapid Strike",
        theater: "Studio Screen",
        startTime: "2026-08-17T20:00:00",
        price: 300,
      },

      // SILENT RECKONING
      {
        movie: "Silent Reckoning",
        theater: "Grand Hall",
        startTime: "2026-08-15T16:00:00",
        price: 320,
      },
      {
        movie: "Silent Reckoning",
        theater: "Premiere Suite",
        startTime: "2026-08-16T11:00:00",
        price: 350,
      },
      {
        movie: "Silent Reckoning",
        theater: "Studio Screen",
        startTime: "2026-08-17T18:00:00",
        price: 320,
      },

      // BEYOND FOREVER
      {
        movie: "Beyond Forever",
        theater: "Grand Hall",
        startTime: "2026-08-15T18:30:00",
        price: 280,
      },
      {
        movie: "Beyond Forever",
        theater: "Premiere Suite",
        startTime: "2026-08-16T14:00:00",
        price: 320,
      },
      {
        movie: "Beyond Forever",
        theater: "Studio Screen",
        startTime: "2026-08-17T20:30:00",
        price: 280,
      },

      // THE WHISPERS IN THE DARK
      {
        movie: "The Whispers in the Dark",
        theater: "Grand Hall",
        startTime: "2026-08-15T21:00:00",
        price: 340,
      },
      {
        movie: "The Whispers in the Dark",
        theater: "Premiere Suite",
        startTime: "2026-08-16T19:30:00",
        price: 380,
      },
      {
        movie: "The Whispers in the Dark",
        theater: "Studio Screen",
        startTime: "2026-08-17T22:00:00",
        price: 340,
      },
    ];

    const showtimes = [];

    for (const showtimeData of showtimesData) {
      const movie = movieMap[showtimeData.movie];
      const theater = theaterMap[showtimeData.theater];
      const screen = screenMap[showtimeData.theater];

      if (!movie) {
        throw new Error(
          `Movie not found: ${showtimeData.movie}`
        );
      }

      if (!theater) {
        throw new Error(
          `Theater not found: ${showtimeData.theater}`
        );
      }

      if (!screen) {
        throw new Error(
          `Screen not found for theater: ${showtimeData.theater}`
        );
      }

      const startTime = new Date(
        showtimeData.startTime
      );

      const endTime = new Date(
        startTime.getTime() +
          movie.duration * 60 * 1000
      );

      const seats = generateSeats(
        screen.rows,
        screen.seatsPerRow
      );

      const showtime = await Showtime.create({
        movie: movie._id,
        theater: theater._id,
        screen: screen._id,
        startTime,
        endTime,
        price: showtimeData.price,
        seats,
      });

      showtimes.push(showtime);

      console.log(
        `Created showtime: ${movie.title} | ${theater.name} | ${startTime.toISOString()} | ₹${showtimeData.price}`
      );
    }

    // --------------------------------------------------------
    // SUMMARY
    // --------------------------------------------------------

    console.log("\n========================================");
    console.log("DATABASE SEED COMPLETED");
    console.log("========================================");

    console.log(`Users:     ${users.length}`);
    console.log(`Movies:    ${movies.length}`);
    console.log(
      `Theaters:  ${Object.keys(theaterMap).length}`
    );
    console.log(
      `Screens:   ${Object.keys(screenMap).length}`
    );
    console.log(`Showtimes: ${showtimes.length}`);
    console.log("Bookings:  0");

    console.log("\nLOGIN DETAILS");
    console.log("----------------------------------------");
    console.log("ADMIN");
    console.log("Email:    morgan.adeyemi@example.com");
    console.log("Password: Morgan@123");

    console.log("\nUSER");
    console.log("Email:    alex.rivera@example.com");
    console.log("Password: Alex@123");

    console.log("========================================\n");

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("\n========================================");
    console.error("DATABASE SEED FAILED");
    console.error("========================================");
    console.error(error);
    console.error("========================================\n");

    await mongoose.connection.close();
    process.exit(1);
  }
}

seedDatabase();