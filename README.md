# musicOnline.com - Vinyl Music Marketplace

A dynamic data-driven web application for buying and selling vinyl records (albums, singles, EPs). Built with PHP and MySQL. 

## 🎯 Project Overview

This is a prototype vinyl music marketplace where users can:
- Register as individual sellers or retailers
- Search for vinyl records by artist, title, or type
- Add, edit, and delete their own vinyl listings
- Browse detailed information about available vinyl records

Administrators can monitor and moderate all user content through a secure admin panel.

## 🛠️ Technologies Used

- **Backend:** PHP 7.4+
- **Database:** MySQL 5.7+
- **Frontend:** HTML5, CSS3, JavaScript
- **Server:** XAMPP (Apache + MySQL)
- **Version Control:** Git & GitHub

## 📋 Features

- ✅ User registration (individual/retailer)
- ✅ User authentication & session management
- ✅ Admin authentication
- ✅ Search functionality (artist, album, single, EP)
- ✅ CRUD operations for vinyl listings
- ✅ Admin moderation panel
- ✅ Responsive design
- ✅ Security features (password hashing, prepared statements, XSS prevention)

## 🚀 Installation & Setup

### Prerequisites
- XAMPP (or similar PHP/MySQL environment)
- Git
- Web browser

### Step 1: Clone Repository
```bash
cd C:/xampp/htdocs
git clone https://github.com/jjmiff/music-online-project.git
cd music-online-project
```

### Step 2: Database Setup
1. Start XAMPP (Apache & MySQL)
2. Open phpMyAdmin:  http://localhost/phpmyadmin
3. Import database: 
   - Click "Import" tab
   - Choose file: `sql/schema.sql`
   - Click "Go"

### Step 3: Configuration
1. Copy `includes/config.example.php` to `includes/config.php`
2. Update database credentials if needed (default XAMPP settings included)

### Step 4: Access Application
- **Main Site:** http://localhost/music-online-project
- **Admin Panel:** http://localhost/music-online-project/admin

## 🔐 Login Credentials

### User Accounts
**User 1 (Individual Seller)**
- Username: `john_vinyl`
- Password: `Test123!`

**User 2 (Retailer)**
- Username: `vinyl_shop`
- Password: `Test123!`

### Administrator Account
- Username: `admin`
- Password: `Admin123!`

## 📂 Project Structure

```
music-online-project/
├── admin/              # Admin panel pages
├── assets/             # CSS, JS, images
│   ├── css/
│   ├── js/
│   └── images/
├── docs/               # Project documentation (LO2)
│   ├── requirements.md
│   ├── database-design.md
│   ├── site-structure.md
│   └── wireframes/
├── includes/           # PHP configuration & functions
│   ├── config. php
│   ├── db. php
│   └── functions.php
├── sql/                # Database schema
│   └── schema.sql
├── user/               # User dashboard pages
├── index.php           # Homepage
├── search.php          # Search results
├── vinyl-detail.php    # Individual vinyl details
├── register.php        # User registration
├── login.php           # User login
└── logout.php          # Logout handler
```

## 📚 Documentation

All project documentation for learning outcomes is available in the `/docs` folder:
- Requirements & Design Specification
- Database ER Diagram & Design
- Site Structure & User Flows
- Wireframes (3 viewports)
- Testing Documentation

## 🧪 Testing

Testing documentation includes:
- Functional testing
- Usability testing
- User scenarios
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Responsive design testing (mobile, tablet, desktop)
- Accessibility testing (WCAG compliance)

## 🔒 Security Features

- Password hashing (bcrypt via `password_hash()`)
- Prepared statements (PDO) for SQL injection prevention
- XSS prevention (`htmlspecialchars()`)
- CSRF token protection
- Session management with timeouts
- Input validation and sanitization

## 📝 Development Status

- [x] Project planning & documentation
- [x] Database design & implementation
- [ ] User authentication system
- [ ] Search functionality
- [ ] CRUD operations for vinyl listings
- [ ] Admin moderation panel
- [ ] Responsive design & styling
- [ ] Testing & deployment

## 👨‍💻 Author

**Student:** jjmiff  
**Course:** Dynamic Data-Driven Web Development  
**Academic Year:** 2025-2026

## 📄 License

This is a student project for educational purposes. 

---

**Last Updated:** January 2026
```