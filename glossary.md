# Music Online - Glossary of Terms
*A cheat sheet for your viva/presentation.*

## Frontend (React)
- **Component**: A reusable building block of the UI (e.g., `VinylCard.jsx`, `Navbar.jsx`). We use "Functional Components".
- **State (`useState`)**: Memory that lives inside a component. When state changes (e.g., `setCartCount`), React re-renders the component to show the new data.
- **Props**: Data passed *down* from a parent to a child component (e.g., passing a vinyl object to `VinylCard`).
- **Context API (`useContext`)**: A way to share global data (like `User` or `Cart`) without passing props through every layer. We used `CartContext` for the shopping bag.
- **Hook**: Special functions starting with `use` (e.g., `useEffect`) that let us "hook into" React features like state or lifecycle events.
- **JSX**: The HTML-like syntax we write inside JavaScript files. It stands for JavaScript XML.

## Backend (Node/Express)
- **API (Application Programming Interface)**: The waiter that takes requests from the Frontend and gets data from the Database.
- **Endpoint**: A specific URL where the API listens for requests (e.g., `GET /api/vinyls`).
- **Middleware**: Code that runs *before* the final route handler. We use `authMiddleware` to check if a user is logged in before letting them see or edit data.
- **RESTful**: A design style where tailored URLs represent resources (Users, Vinyls) and HTTP verbs (GET, POST, DELETE) represent actions.

## Database (MySQL)
- **Schema**: The blueprint of the database (tables, columns, data types).
- **Primary Key (PK)**: A unique ID (e.g., `id`) that identifies a row.
- **Foreign Key (FK)**: A link to another table (e.g., `seller_id` in `vinyls` table points to `id` in `users` table).
- **SQL Injection**: A security threat where hackers type SQL into a form. We prevented this by using "Parameterized Queries" (the `?` in `db.query`).

## Security
- **JWT (JSON Web Token)**: A secure "badge" the server gives the user after login. The user sends this badge with every request to prove who they are.
- **Bcrypt**: A library used to "hash" (scramble) passwords so even we (the admins) typically cannot read the real passwords.
