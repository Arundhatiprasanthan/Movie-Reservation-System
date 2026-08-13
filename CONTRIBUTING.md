# Movie Reservation System — Team Development Guide

This document defines how our team will work on the Movie Reservation System and how we will use Git/GitHub.

## 1. Team Structure

We have two development teams.

### 🟦 User / Customer Team

| Member | Responsibility | Branch |
|---|---|---|
| Harsh Kumar Bhardwaj | Login, Register & Authentication | `feature/user-auth` |
| Ritik Raj | Main Page, Movies, Search & Filter | `feature/user-movies` |
| Dablu Kumar | Movie Details, Theatre, Showtime & Seats | `feature/user-showtime-seats` |
| Nikhitha Yedulla | User-side Backend | `feature/user-backend` |

### 🟥 Admin Team

| Member | Responsibility | Branch |
|---|---|---|
| Solanki Sunilkumar Kantibhai | Admin Dashboard / Overview | `feature/admin-dashboard` |
| Nisha Gupta | Movie & Theatre Management | `feature/admin-movies-theatres` |
| Khushi Aggarwal | Screen & Showtime Management | `feature/admin-showtimes` |
| Nandini Agarwal | User & Booking Management | `feature/admin-users-bookings` |
| Syed Zaid Ahmed .A | Admin Backend APIs | `feature/admin-backend` |



# 2. Branch Structure

Our Git structure is:

```text
main
  │
  └── integration
        │
        ├── feature/user-auth
        ├── feature/user-movies
        ├── feature/user-showtime-seats
        ├── feature/user-backend
        │
        ├── feature/admin-dashboard
        ├── feature/admin-movies-theatres
        ├── feature/admin-showtimes
        ├── feature/admin-users-bookings
        └── feature/admin-backend

   ----------- Feature branches--------

Each member works on their assigned feature branch.

Feature branches are merged into integration through Pull Requests.

--------------Creating Your Feature Branch---------------

The integration branch is the starting point for new feature branches.

First get the latest integration code:

>git fetch origin
>git checkout integration
>git pull origin integration

****************Before Creating a Pull Request******************

Before creating a PR, make sure:

Your feature is working.
You have tested your changes.
There are no unnecessary files.
There are no console errors.
Existing features are not broken.
Your branch is up to date with integration.

Then push your branch:
####################################
git push origin YOUR-BRANCH-NAME

On GitHub, create:

YOUR-FEATURE-BRANCH → integration
######################################