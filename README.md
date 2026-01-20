# Music Online - Premium Vinyl Marketplace
*A full-stack web application with Admin Intelligence and Dynamic CMS.*

## Features
### Core Functionality
- **User Authentication**: Secure Login/Register with JWT & Bcrypt.
- **Browse & Search**: Search vinyls by Artist, Title, or Genre using SQL `LIKE` queries.
- **Shopping Bag**: Persistent cart experience (Local Storage) with simulated checkout.

### Advanced Admin Features (Grade Booster)
- **Admin Dashboard**: Visualize platform stats (Total Value, Users, Pending Items).
- **Search Analytics**: "Silent Logger" tracks demand. Admins can view "Top Searches" to make business decisions.
- **Dynamic Genre CMS**: Admins can add/remove genres from the Settings tab without coding. This updates the dropdowns for all users instantly.
- **Inspector**: View detailed user profiles and inventory values.

## Tech Stack
- **Frontend**: React (Vite) + Vanilla CSS (Glassmorphism Design).
- **Backend**: Node.js + Express (MVC Architecture).
- **Database**: MySQL with relational tables (`users`, `vinyls`, `genres`, `search_logs`).

## Setup Guide
1. **Database**:
   - Create a MySQL database named `music_online`.
   - Import the file `sql/export.sql` to set up all tables and data:
     ```bash
     mysql -u root -p music_online < sql/export.sql
     ```

2. **Backend**:
   ```bash
   cd backend
   npm install
   node server.js
   ```
   *Runs on http://localhost:3000*

3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Runs on http://localhost:5173*

## Login Credentials
### Admin (Full Access)
- **Username**: `admin`
- **Password**: `password123`

### User (Buyer/Seller)
- **Username**: `user1`
- **Password**: `password123`
