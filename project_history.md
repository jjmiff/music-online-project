# Project History & Development Log
*Trace of the iterative development process.*

## Phase 1: Core Functionality (The Prototype)
- **Goal**: Build a working marketplace.
- **Completed**:
    - Set up React (Frontend) and Express (Backend).
    - Created User Authentication (Login/Register).
    - Implemented CRUD for Vinyls (Create, Read, Update, Delete).
    - Built the "Search" feature using SQL `LIKE` queries.

## Phase 2: UI/UX "Premium" Polish
- **Goal**: Move away from basic HTML looks to a modern "Glassmorphism" aesthetic.
- **Completed**:
    - Implemented Dark Mode with neon accents (`--primary: #6366f1`).
    - Added CSS Animations (fade-in, slide-up) for a smoother feel.
    - Designed transparent "Glass Cards" for listings and dashboards.

## Phase 3: Admin & Business Logic
- **Goal**: Differentiate from a simple CRUD app by adding "Real World" features.
- **Completed**:
    - **Seller Inspector**: Added pages for Admins to view a specific seller's inventory.
    - **Analytics**: Implemented a Search Demand Tracker.
    - **CMS**: Built a "Settings" tab for Admins to manage music genres dynamically.

## Phase 4: Shopping Experience
- **Goal**: Implement the buyer's journey.
- **Completed**:
    - Built a persistent Shopping Bag using `localStorage` and React Context.
    - Created a Checkout Simulation flow.

## Conclusion
This project demonstrates a full-stack web application with secure authentication, real-time state management, role-based security, and data-driven administrative tools.
