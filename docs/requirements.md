# Requirements and Design Specification
## musicOnline.com - Vinyl Music Marketplace

**Project:** Dynamic Data-Driven Vinyl Marketplace  
**Student:** jjmiff  
**Date:** January 2026  

---

## 1. Site Goals and Objectives

### Primary Goal
To create a functional prototype of a dynamic, data-driven web platform where users can buy and sell vinyl music records (albums, singles, EPs) in a user-friendly, secure environment.

### Business Objectives
- Enable user registration and authentication for buyers and sellers
- Provide a searchable database of vinyl records
- Allow users to manage their own vinyl listings (CRUD operations)
- Implement content moderation through admin panel
- Create a responsive, accessible interface for all age groups (18+)
- Establish foundation for future e-commerce functionality

### Success Criteria
- Users can successfully register and log in
- Search functionality returns accurate results
- Registered users can add, edit, and delete listings
- Admin can monitor and moderate all content
- Site works across multiple devices and browsers
- Basic security measures are implemented

---

## 2. Functional Requirements

### 2.1 User Management

#### User Registration
- **FR-UR-01:** System shall allow new users to create accounts
- **FR-UR-02:** Registration form shall collect:  username, email, password, user type (individual/retailer), first name, last name
- **FR-UR-03:** System shall validate email format
- **FR-UR-04:** System shall enforce password strength requirements (min 8 characters, uppercase, lowercase, number)
- **FR-UR-05:** System shall check for duplicate usernames and emails
- **FR-UR-06:** System shall hash passwords before storing in database
- **FR-UR-07:** System shall display appropriate error messages for validation failures
- **FR-UR-08:** Retailers shall be identified during registration (payment integration not required for prototype)

#### User Authentication
- **FR-UA-01:** System shall provide login functionality for registered users
- **FR-UA-02:** System shall verify credentials against database
- **FR-UA-03:** System shall create secure sessions upon successful login
- **FR-UA-04:** System shall implement session timeout after 1 hour of inactivity
- **FR-UA-05:** System shall provide logout functionality
- **FR-UA-06:** System shall restrict access to protected pages for non-authenticated users

### 2.2 Admin Management

#### Admin Authentication
- **FR-AA-01:** System shall provide separate admin login interface
- **FR-AA-02:** System shall verify admin credentials against admin_users table
- **FR-AA-03:** System shall create admin sessions separate from user sessions
- **FR-AA-04:** System shall restrict admin panel access to authenticated admins only

#### Content Moderation
- **FR-CM-01:** Admin shall be able to view all user-submitted vinyl listings
- **FR-CM-02:** Admin shall be able to approve/disapprove listings
- **FR-CM-03:** Admin shall be able to view user information
- **FR-CM-04:** Admin shall be able to deactivate inappropriate listings
- **FR-CM-05:** Admin dashboard shall display pending listings count

### 2.3 Vinyl Listing Management (CRUD Operations)

#### Create Listings
- **FR-CL-01:** Registered users shall be able to add new vinyl listings
- **FR-CL-02:** Listing form shall collect: artist name, title, vinyl type (album/single/EP), genre, release date, condition, price, description
- **FR-CL-03:** System shall validate all required fields
- **FR-CL-04:** System shall use placeholder images (actual image upload not required for prototype)
- **FR-CL-05:** New listings shall default to "not approved" status pending admin review

#### Read/Display Listings
- **FR-RL-01:** System shall display approved vinyl listings on homepage
- **FR-RL-02:** System shall display vinyl listings in search results
- **FR-RL-03:** Each listing shall show: artist, title, type badge, price, condition
- **FR-RL-04:** Clicking a listing shall display full details including description, release date, seller information
- **FR-RL-05:** System shall show placeholder advertisement areas (no actual ads required)

#### Update Listings
- **FR-UL-01:** Users shall be able to edit their own listings
- **FR-UL-02:** Users shall NOT be able to edit other users' listings
- **FR-UL-03:** System shall pre-populate edit form with existing data
- **FR-UL-04:** System shall update timestamp when listing is modified
- **FR-UL-05:** Edited listings shall require re-approval by admin

#### Delete Listings
- **FR-DL-01:** Users shall be able to delete their own listings
- **FR-DL-02:** System shall request confirmation before deletion
- **FR-DL-03:** System shall perform cascade delete to maintain referential integrity
- **FR-DL-04:** Admin shall be able to deactivate any listing

### 2.4 Search Functionality

- **FR-SF-01:** System shall provide search functionality on homepage
- **FR-SF-02:** Users shall be able to search by artist name
- **FR-SF-03:** Users shall be able to search by album/single/EP title
- **FR-SF-04:** Users shall be able to filter by vinyl type (album/single/EP)
- **FR-SF-05:** Search shall be case-insensitive
- **FR-SF-06:** System shall display all matching results
- **FR-SF-07:** System shall display appropriate message when no results found
- **FR-SF-08:** Search results shall link to individual vinyl detail pages

### 2.5 User Dashboard

- **FR-UD-01:** Logged-in users shall have access to personal dashboard
- **FR-UD-02:** Dashboard shall display user's active listings
- **FR-UD-03:** Dashboard shall provide quick links to add/edit/delete listings
- **FR-UD-04:** Dashboard shall display listing approval status

---

## 3. Non-Functional Requirements

### 3.1 Security Requirements

- **NFR-S-01:** All passwords shall be hashed using bcrypt (password_hash)
- **NFR-S-02:** All database queries shall use prepared statements
- **NFR-S-03:** All user input shall be sanitized and validated
- **NFR-S-04:** XSS attacks shall be prevented using htmlspecialchars()
- **NFR-S-05:** CSRF tokens shall protect all forms
- **NFR-S-06:** Sessions shall be configured with httponly and secure flags
- **NFR-S-07:** SQL injection shall be prevented through PDO prepared statements

### 3.2 Usability Requirements

- **NFR-U-01:** Interface shall be intuitive for users aged 18+
- **NFR-U-02:** Navigation shall be consistent across all pages
- **NFR-U-03:** Error messages shall be clear and helpful
- **NFR-U-04:** Forms shall include appropriate labels and placeholders
- **NFR-U-05:** Success/error feedback shall be provided for all actions

### 3.3 Performance Requirements

- **NFR-P-01:** Pages shall load within 3 seconds on standard broadband
- **NFR-P-02:** Search results shall display within 2 seconds
- **NFR-P-03:** Database queries shall be optimized with appropriate indexes

### 3.4 Accessibility Requirements

- **NFR-A-01:** Site shall meet WCAG 2.1 Level AA standards
- **NFR-A-02:** All images shall have appropriate alt text
- **NFR-A-03:** Color contrast shall meet accessibility standards
- **NFR-A-04:** Forms shall be keyboard navigable
- **NFR-A-05:** Semantic HTML shall be used throughout

### 3.5 Compatibility Requirements

- **NFR-C-01:** Site shall work on latest versions of Chrome, Firefox, Safari, Edge
- **NFR-C-02:** Site shall be responsive for mobile (320px+), tablet (768px+), desktop (1200px+)
- **NFR-C-03:** Site shall function without JavaScript (progressive enhancement)

---

## 4.  Constraints

### 4.1 Technical Constraints

- **Must use:** PHP for server-side programming
- **Must use:** MySQL for database management
- **Must use:** Current web standards (HTML5, CSS3)
- **Must implement:** Responsive design techniques
- **Development environment:** XAMPP (Apache + MySQL + PHP)

### 4.2 Project Constraints

- **Timeline:** 6 months (deadline: March 1, 2026)
- **Scope:** Prototype only - no actual payment processing
- **Resources:** Individual student project
- **Budget:** Free/open-source tools only

### 4.3 Functional Constraints

- **No payment integration:** Retailer payment noted but not implemented
- **No actual sales transactions:** Display-only prototype
- **Placeholder images:** Actual image upload optional
- **Placeholder advertisements:** Ad display not required

---

## 5. Developer Requirements

### 5.1 Technical Stack

**Server-Side:**
- PHP 7.4 or higher
- Apache HTTP Server

**Database:**
- MySQL 5.7 or higher
- phpMyAdmin for management

**Frontend:**
- HTML5
- CSS3 / Bootstrap 5
- JavaScript (ES6+)

**Development Tools:**
- Visual Studio Code (IDE)
- XAMPP (local development environment)
- Git & GitHub (version control)
- Chrome DevTools (debugging)

### 5.2 Development Environment

- Local server:  XAMPP
- Database: MySQL via phpMyAdmin
- Document root: `C:/xampp/htdocs/music-online-project/`
- Site URL: `http://localhost/music-online-project`

### 5.3 Coding Standards

- PHP:  PSR-12 coding standards
- HTML:  Semantic, valid HTML5
- CSS: BEM naming convention
- JavaScript: ES6+ with clear commenting
- Database:  Normalized schema (3NF)

### 5.4 Security Standards

- Password hashing: bcrypt via `password_hash()`
- Database access: PDO with prepared statements
- Input validation: Server-side validation for all inputs
- XSS prevention: `htmlspecialchars()` for all output
- CSRF protection:  Tokens for all forms
- Session security:  Secure session configuration

---

## 6. End Users

### 6.1 User Personas

#### Persona 1: Individual Vinyl Collector (Sarah, 28)
- **Background:** Music enthusiast, collects vinyl as hobby
- **Goals:** Find rare records, sell duplicates from collection
- **Tech skill:** Moderate
- **Needs:** Easy search, clear condition descriptions, fair pricing
- **Pain points:** Difficulty finding specific artists, concerns about condition accuracy

#### Persona 2: Retailer (Mike, 45)
- **Background:** Owner of independent record shop
- **Goals:** Expand online presence, reach wider audience
- **Tech skill:** Basic to moderate
- **Needs:** Bulk listing capability, professional appearance, inventory management
- **Pain points:** Time-consuming to list many items, needs streamlined process

#### Persona 3: Administrator (Admin, 35)
- **Background:** Site moderator, ensures quality content
- **Goals:** Prevent spam, maintain site reputation, ensure accurate listings
- **Tech skill:** Advanced
- **Needs:** Efficient moderation tools, user management, reporting
- **Pain points:** Large volume of listings to review

### 6.2 User Requirements by Type

#### All Users (Public)
- Browse vinyl listings without registration
- Search by artist, title, vinyl type
- View detailed listing information
- Clear, responsive interface

#### Registered Users (Individual/Retailer)
- All public user capabilities
- Create account (register)
- Log in/out securely
- Add new vinyl listings
- Edit own listings
- Delete own listings
- View personal dashboard

#### Administrators
- Separate admin login
- View all listings (approved and pending)
- Approve/disapprove listings
- View user information
- Deactivate inappropriate content
- Monitor site activity

---

## 7. Assumptions and Dependencies

### Assumptions
- Users have basic internet literacy
- Users have access to modern web browsers
- Users understand vinyl terminology (album, EP, single, condition grades)
- XAMPP is properly configured
- MySQL service is running

### Dependencies
- XAMPP installation
- Bootstrap 5 CDN availability
- Modern web browser support
- PHP 7.4+ features availability

---

## 8. Future Enhancements (Out of Scope for Prototype)

- Payment processing integration
- Actual image upload functionality
- Messaging system between buyers/sellers
- User ratings and reviews
- Advanced search filters (genre, price range, era)
- Wishlist functionality
- Email notifications
- Real advertisement integration
- Shopping cart functionality
- Order history

---

**Document Version:** 1.0  
**Last Updated:** January 14, 2026  
**Author:** jjmiff