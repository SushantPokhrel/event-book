# EventBook

Small event discovery and booking app with separate admin and user dashboards.

## Live Links

- Frontend: `https://event-book-ruby.vercel.app`
- Backend_URL: `https://event-book-73l8.onrender.com/api`

## Tech Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Express, TypeScript, JWT, HTTP-only cookies
- PostgreSQL, Prisma 7, bcrypt

## Run Locally

1. Install dependencies:

   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. Configure `server/.env.development` with `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `ADMIN_PASS`, and `FRONTEND_URL`.

3. Start the API. The server loads the environment and seeds an admin automatically:

   ```bash
   cd server
   npm run dev
   ```

4. Start the frontend in a second terminal:

   ```bash
   cd client
   npm run dev
   ```

### Accounts

- Admin account: `admin123@gmail.com` seeded from seed script.
- Admin password: `admin_password_very_secure`.
- User: register through `/auth`


Admin users create, edit, and delete events. Regular users browse events, book seats, view their bookings, and cancel bookings.

## Data Model

- `User`: account details and `USER` or `ADMIN` role.
- `Event`: title, description, date, time, venue, and total seats.
- `Booking`: joins a user to an event with `CONFIRMED` or `CANCELLED` status. The composite key prevents duplicate bookings for the same user and event.

## API

Base URL: `http://localhost:8000/api`

- `POST /auth/register` - create a user
- `POST /auth/login` - login and set the HTTP-only token cookie
- `POST /auth/logout` - clear the token cookie
- `GET /auth/me` - return the logged-in user
- `GET /events` - list public events and search events by ?title=
- `GET /events/:id` - get an event and available seats
- `POST /events` - admin-only event creation
- `PUT /events/:id` - admin-only event update
- `DELETE /events/:id` - admin-only event deletion
- `POST /booking/:eventId` - book one seat for the logged-in user
- `GET /booking` - list the user’s confirmed bookings
- `PATCH /booking/:eventId/cancel` - cancel the user’s booking

## Decisions And Trade-offs

- Backend is hosted on render free tier, so it gives a cold start after inactivity.
- Frontend is built with the help of AI for repetitive tasks and styling.
- Frontend routing design is simple and easy.
- JWTs are stored in HTTP-only cookies so client JavaScript cannot read the token.
- Client route guards improve navigation, while backend middleware remains responsible for authorization.
- Available seats are calculated as `totalSeats - confirmedBookings`; cancelled bookings free a seat.
- Event updates reject a total seat count lower than the number of confirmed bookings.
- The UI is intentionally simple and uses client fetching to keep the implementation small.

## AI Usage

GitHub Copilot and manus ai was used for repetitive implementation tasks, route and UI scaffolding, typescript type errors explanations, discussing approach to build a certain feature etc.

## Checks

Automated tests are currently skipped. Available checks:

```bash
cd server && npm run build
cd client && npm run lint
cd client && npm run build
```

## Known Issues / Next Steps

- Add API and frontend tests.
- Add pagination for events rendering.
- Add concurrency-safe seat reservation handling for simultaneous bookings.
- Improve frontend design and past events booking restriction addition.

## Remarks
- Good to have participated in this project assessment stage, worth my time.