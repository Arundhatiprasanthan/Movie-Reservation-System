# Movie Reservation System — Admin Backend Module

Node.js + Express + MongoDB (Mongoose) backend covering the **admin** side of the
Movie Reservation System: movie management, theater/screen management,
showtime management, and read-only booking oversight.

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev             # or: npm start
```

## Making your first admin

Registration always creates a `user` role. Promote an existing account to admin:

```bash
node scripts/makeAdmin.js someone@example.com
```

## Auth

`POST /api/auth/register` and `POST /api/auth/login` return a JWT.
Send it on every admin request as:

```
Authorization: Bearer <token>
```

## Admin Endpoints (all require an admin JWT)

| Method | Route | Description |
|---|---|---|
| POST | /api/admin/movies | Create a movie |
| GET | /api/admin/movies | List all movies |
| GET | /api/admin/movies/:id | Get one movie |
| PUT | /api/admin/movies/:id | Update a movie |
| DELETE | /api/admin/movies/:id | Soft-delete (deactivate) a movie |
| POST | /api/admin/theaters | Create a theater |
| GET | /api/admin/theaters | List theaters |
| PUT | /api/admin/theaters/:id | Update a theater |
| DELETE | /api/admin/theaters/:id | Delete a theater (must have no screens) |
| POST | /api/admin/theaters/:theaterId/screens | Add a screen to a theater |
| GET | /api/admin/theaters/:theaterId/screens | List a theater's screens |
| PUT | /api/admin/screens/:id | Update a screen |
| DELETE | /api/admin/screens/:id | Delete a screen |
| POST | /api/admin/showtimes | Create a showtime (auto-generates seat grid) |
| GET | /api/admin/showtimes | List all showtimes |
| GET | /api/admin/showtimes/:id | Get one showtime (with seat map) |
| PUT | /api/admin/showtimes/:id | Update start time / price |
| DELETE | /api/admin/showtimes/:id | Delete a showtime |
| PATCH | /api/admin/showtimes/:id/seats/:seatLabel/block | Block/unblock a specific seat |
| GET | /api/admin/bookings | List all bookings (filter by `?status=` or `?showtime=`) |
| GET | /api/admin/bookings/stats | Total confirmed/cancelled bookings + revenue |

## Notes for the team

- **Seat map**: generated automatically when a showtime is created, based on the
  screen's `rows` × `seatsPerRow`. Labels look like `A1, A2, ... B1, B2...`.
- **Booking creation/cancellation and the seat-hold/checkout flow are NOT in this
  module** — that's the user-facing booking part. This module only reads
  `Booking` and toggles seat `blocked` status for maintenance.
- **Overlap check**: creating a showtime rejects it if the screen already has
  another showtime overlapping that time window.
- Swap `middleware/auth.js` for whatever the team's shared auth ends up being —
  it only needs to attach `req.user` with a `role` field for `isAdmin` to work.
