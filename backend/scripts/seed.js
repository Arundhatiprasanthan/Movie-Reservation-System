require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Movie = require("../models/Movie");
const Theater = require("../models/Theater");
const Screen = require("../models/Screen");
const Showtime = require("../models/Showtime");
const Booking = require("../models/Booking");

const generateSeatGrid = (rows, seatsPerRow) => {
  const seats = [];

  for (let r = 0; r < rows; r++) {
    const rowLetter = String.fromCharCode(65 + r);

    for (let s = 1; s <= seatsPerRow; s++) {
      seats.push({
        seatLabel: `${rowLetter}${s}`,
        status: "available",
      });
    }
  }

  return seats;
};

const seedDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/movie_reservation";

    console.log("Connecting to MongoDB for seeding...");

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected.");

    // --------------------------------------------------
    // CLEAR EXISTING DATA
    // --------------------------------------------------

    console.log("Clearing existing collections...");

    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Theater.deleteMany({}),
      Screen.deleteMany({}),
      Showtime.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    // --------------------------------------------------
    // USERS
    // --------------------------------------------------

    console.log("Creating users...");

    const adminPassword = await bcrypt.hash("admin123", 10);
    const memberPassword = await bcrypt.hash("user123", 10);

    const admin = await User.create({
      name: "Morgan Adeyemi",
      email: "admin@cinevault.com",
      password: adminPassword,
      role: "admin",
    });

    const member = await User.create({
      name: "Alex Rivera",
      email: "user@cinevault.com",
      password: memberPassword,
      role: "user",
    });

    console.log("Users created:");
    console.log(`Admin: ${admin.email}`);
    console.log(`Member: ${member.email}`);

    // --------------------------------------------------
    // MOVIES
    // --------------------------------------------------

    console.log("Creating movies...");

    const movies = await Movie.create([
      {
        title: "Eclipse",
        genre: ["Sci-Fi", "Adventure"],
        duration: 148,
        description:
          "A mysterious celestial event changes the fate of humanity as one astronaut uncovers secrets hidden beyond our solar system.",
        director: "Aarav Mehta",
        cast: [
          "Vihaan Kapoor",
          "Ananya Rao",
          "Arjun Nair",
        ],
        rating: "PG-13",
        releaseDate: new Date("2026-06-15"),
        posterUrl: "/images/movies/eclipse.png",
        isActive: true,
      },

      {
        title: "Rapid Strike",
        genre: ["Action", "Thriller"],
        duration: 126,
        description:
          "An elite special forces officer races against time to stop a dangerous criminal syndicate before an entire city falls into chaos.",
        director: "Kabir Sharma",
        cast: [
          "Rohan Malhotra",
          "Ishita Sen",
          "Karan Verma",
        ],
        rating: "UA",
        releaseDate: new Date("2026-05-20"),
        posterUrl: "/images/movies/rapid-strike.png",
        isActive: true,
      },

      {
        title: "Silent Reckoning",
        genre: ["Thriller", "Mystery"],
        duration: 134,
        description:
          "A detective receives anonymous clues that lead to a chilling conspiracy where every answer uncovers an even darker secret.",
        director: "Neha Iyer",
        cast: [
          "Aditi Kapoor",
          "Rahul Khanna",
          "Meera Joshi",
        ],
        rating: "A",
        releaseDate: new Date("2026-07-01"),
        posterUrl: "/images/movies/silent-reckoning.png",
        isActive: true,
      },

      {
        title: "Beyond Forever",
        genre: ["Romance", "Drama"],
        duration: 132,
        description:
          "Two strangers from different worlds find an unexpected connection that challenges fate, distance, and the choices that define love.",
        director: "Ritika Desai",
        cast: [
          "Aryan Patel",
          "Kiara Menon",
          "Dev Sharma",
        ],
        rating: "U",
        releaseDate: new Date("2026-04-10"),
        posterUrl: "/images/movies/beyond-forever.png",
        isActive: true,
      },

      {
        title: "The Whispers in the Dark",
        genre: ["Horror", "Mystery"],
        duration: 116,
        description:
          "After moving into an abandoned mansion, a family begins hearing unsettling whispers that awaken an ancient evil hidden within its walls.",
        director: "Siddharth Rao",
        cast: [
          "Sneha Reddy",
          "Aman Kapoor",
          "Vikram Das",
        ],
        rating: "A",
        releaseDate: new Date("2026-07-15"),
        posterUrl:
          "/images/movies/the-whispers-in-the-dark.png",
        isActive: true,
      },
    ]);

    console.log(`${movies.length} movies created.`);

    // --------------------------------------------------
    // THEATERS
    // --------------------------------------------------

    console.log("Creating theaters...");

    const theater1 = await Theater.create({
      name: "CineVault IMAX Grand",
      location: "Downtown Plaza, Main Street",
    });

    const theater2 = await Theater.create({
      name: "CineVault Premiere Suite",
      location: "Westside Cyber City",
    });

    const theater3 = await Theater.create({
      name: "CineVault Luxe Cinema",
      location: "Central Mall Avenue",
    });

    // --------------------------------------------------
    // SCREENS
    // --------------------------------------------------

    console.log("Creating screens...");

    const screen1 = await Screen.create({
      theater: theater1._id,
      name: "Screen 1 - Grand Hall",
      rows: 9,
      seatsPerRow: 14,
      screenType: "IMAX",
    });

    const screen2 = await Screen.create({
      theater: theater2._id,
      name: "Screen 2 - Premiere Hall",
      rows: 8,
      seatsPerRow: 12,
      screenType: "3D",
    });

    const screen3 = await Screen.create({
      theater: theater3._id,
      name: "Screen 1 - Luxe Auditorium",
      rows: 10,
      seatsPerRow: 14,
      screenType: "4DX",
    });

    // --------------------------------------------------
    // SHOWTIMES
    // --------------------------------------------------

    console.log("Creating showtimes...");

    const now = new Date();

    const createTime = (daysFromNow, hours, minutes) => {
      const date = new Date(now);

      date.setDate(date.getDate() + daysFromNow);
      date.setHours(hours, minutes, 0, 0);

      return date;
    };

    // Eclipse
    const eclipse2pm = createTime(0, 14, 30);
    const eclipse7pm = createTime(0, 19, 0);

    // Rapid Strike
    const rapid1pm = createTime(1, 13, 0);
    const rapid8pm = createTime(1, 20, 30);

    // Silent Reckoning
    const silent4pm = createTime(2, 16, 0);

    // Beyond Forever
    const beyond6pm = createTime(2, 18, 0);

    // Whispers
    const whispers9pm = createTime(3, 21, 0);

    // --------------------------------------------------
    // ECLIPSE - GRAND HALL
    // --------------------------------------------------

    const showtime1 = await Showtime.create({
      movie: movies[0]._id,
      theater: theater1._id,
      screen: screen1._id,
      startTime: eclipse2pm,
      endTime: new Date(
        eclipse2pm.getTime() +
          movies[0].duration * 60000
      ),
      price: 350,
      seats: generateSeatGrid(
        screen1.rows,
        screen1.seatsPerRow
      ),
    });

    // --------------------------------------------------
    // ECLIPSE - PREMIERE SUITE
    // --------------------------------------------------

    await Showtime.create({
      movie: movies[0]._id,
      theater: theater2._id,
      screen: screen2._id,
      startTime: eclipse7pm,
      endTime: new Date(
        eclipse7pm.getTime() +
          movies[0].duration * 60000
      ),
      price: 450,
      seats: generateSeatGrid(
        screen2.rows,
        screen2.seatsPerRow
      ),
    });

    // --------------------------------------------------
    // RAPID STRIKE - GRAND HALL
    // --------------------------------------------------

    await Showtime.create({
      movie: movies[1]._id,
      theater: theater1._id,
      screen: screen1._id,
      startTime: rapid1pm,
      endTime: new Date(
        rapid1pm.getTime() +
          movies[1].duration * 60000
      ),
      price: 350,
      seats: generateSeatGrid(
        screen1.rows,
        screen1.seatsPerRow
      ),
    });

    // --------------------------------------------------
    // RAPID STRIKE - PREMIERE SUITE
    // --------------------------------------------------

    await Showtime.create({
      movie: movies[1]._id,
      theater: theater2._id,
      screen: screen2._id,
      startTime: rapid8pm,
      endTime: new Date(
        rapid8pm.getTime() +
          movies[1].duration * 60000
      ),
      price: 450,
      seats: generateSeatGrid(
        screen2.rows,
        screen2.seatsPerRow
      ),
    });

    // --------------------------------------------------
    // SILENT RECKONING - LUXE
    // --------------------------------------------------

    await Showtime.create({
      movie: movies[2]._id,
      theater: theater3._id,
      screen: screen3._id,
      startTime: silent4pm,
      endTime: new Date(
        silent4pm.getTime() +
          movies[2].duration * 60000
      ),
      price: 320,
      seats: generateSeatGrid(
        screen3.rows,
        screen3.seatsPerRow
      ),
    });

    // --------------------------------------------------
    // BEYOND FOREVER - GRAND HALL
    // --------------------------------------------------

    await Showtime.create({
      movie: movies[3]._id,
      theater: theater1._id,
      screen: screen1._id,
      startTime: beyond6pm,
      endTime: new Date(
        beyond6pm.getTime() +
          movies[3].duration * 60000
      ),
      price: 350,
      seats: generateSeatGrid(
        screen1.rows,
        screen1.seatsPerRow
      ),
    });

    // --------------------------------------------------
    // WHISPERS IN THE DARK - PREMIERE
    // --------------------------------------------------

    await Showtime.create({
      movie: movies[4]._id,
      theater: theater2._id,
      screen: screen2._id,
      startTime: whispers9pm,
      endTime: new Date(
        whispers9pm.getTime() +
          movies[4].duration * 60000
      ),
      price: 450,
      seats: generateSeatGrid(
        screen2.rows,
        screen2.seatsPerRow
      ),
    });

    console.log("Showtimes created.");

    // --------------------------------------------------
    // INITIAL RESERVED SEATS
    // --------------------------------------------------

    console.log("Creating initial booking...");

    const seatsToBook = ["C5", "C6"];

    seatsToBook.forEach((label) => {
      const seat = showtime1.seats.find(
        (s) => s.seatLabel === label
      );

      if (seat) {
        seat.status = "reserved";
        seat.heldBy = member._id;
      }
    });

    await showtime1.save();

    await Booking.create({
      bookingId: "BK-SEED123",
      user: member._id,
      showtime: showtime1._id,
      seats: seatsToBook,
      totalCost:
        2 * 350 +
        50 +
        Math.round(700 * 0.18),
      status: "confirmed",
    });

    console.log("Initial booking created.");

    // --------------------------------------------------
    // COMPLETE
    // --------------------------------------------------

    console.log("");
    console.log("======================================");
    console.log("DATABASE SEEDED SUCCESSFULLY");
    console.log("======================================");
    console.log("");
    console.log("Member Login:");
    console.log("Email: user@cinevault.com");
    console.log("Password: user123");
    console.log("");
    console.log("Admin Login:");
    console.log("Email: admin@cinevault.com");
    console.log("Password: admin123");
    console.log("");
    console.log("Movies:", movies.length);
    console.log("======================================");

    await mongoose.connection.close();

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedDB();