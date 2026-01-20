# Music Online - Study & Architecture Notes
*Use these notes to explain "Why" you made certain technical decisions.*

## 1. Architecture: MVC (Model-View-Controller)
We followed a loose MVC pattern, which is industry standard.
- **Model (Database)**: MySQL stores our data (`users`, `vinyls`, `search_logs`).
- **View (Frontend)**: React handles what the user *sees* and interacts with.
- **Controller (Backend API)**: Node/Express logic that fetches data from the Model and sends it to the View.

## 2. Why React? (Frontend)
- **Speed**: It's a "Single Page Application" (SPA). The page doesn't reload when you click links; it just swaps content instantly.
- **Reusability**: We built the `VinylCard` once and used it 100 times.
- **State Management**: Using `CartContext` allowed us to keep the Shopping Bag count accurate across the entire site automatically.

## 3. Why Node/Express? (Backend)
- **JavaScript Everywhere**: We use JS for both Frontend and Backend, reducing context switching.
- **Asynchronous**: Node handles multiple requests (like 50 people searching at once) efficiently without crashing.

## 4. Key Security Features
- **Password Hashing**: We never store plain text passwords. We use `bcrypt` to turn "password123" into `$2b$10$X8...`.
- **RBAC (Role-Based Access Control)**:
    - `authMiddleware` checks *if* you are logged in.
    - Routes like `router.delete('/genres')` check *if* your role is `'admin'`.
- **Input Sanitization**: We use `?` placeholders in SQL queries to prevent hackers from deleting our database via the search bar.

## 5. Advanced Features Explained
- **Search Analytics**: We implemented a "Silent Logger". Every time a search happens, we update a counter in the database. This creates "Business Intelligence" (BI) data.
- **Dynamic CMS**: By moving Genres to a database table (`genres`), we allowed Admins to change the site configuration without hiring a programmer to edit the code.
