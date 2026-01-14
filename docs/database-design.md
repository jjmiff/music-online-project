# Database Design and ER Diagram
## musicOnline.com - Vinyl Music Marketplace

**Project:** Dynamic Data-Driven Vinyl Marketplace  
**Student:** jjmiff  
**Date:** January 2026  

---

## 1. Database Overview

### Database Name
`musiconline`

### Database Management System
MySQL 5.7+ with InnoDB storage engine

### Character Set
UTF-8 (utf8mb4) for full Unicode support including emojis and special characters

### Design Approach
- Normalized to Third Normal Form (3NF)
- Referential integrity enforced through foreign keys
- Indexes on frequently queried columns
- FULLTEXT index for search functionality

---

## 2. Entity Relationship Diagram (ERD)

### Entities and Relationships

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ PK user_id      │
│    username     │
│    email        │
│    password_hash│
│    user_type    │
│    first_name   │
│    last_name    │
│    reg_date     │
│    last_login   │
│    is_active    │
└────────┬────────┘
         │
         │ 1:N (One user can have many listings)
         │
         ▼
┌─────────────────────┐
│  VINYL_LISTINGS     │
├─────────────────────┤
│ PK listing_id       │
│ FK user_id          │
│    artist_name      │
│    title            │
│    vinyl_type       │
│    genre            │
│    release_date     │
│    condition_grade  │
│    price            │
│    description      │
│    image_url        │
│    created_at       │
│    updated_at       │
│    is_approved      │
│    is_active        │
└─────────────────────┘


┌─────────────────┐
│  ADMIN_USERS    │
├─────────────────┤
│ PK admin_id     │
│    username     │
│    password_hash│
│    email        │
│    created_at   │
│    last_login   │
└─────────────────┘
(Independent - no foreign key relationships)
```

### Relationship Details

**USERS → VINYL_LISTINGS**
- **Type:** One-to-Many (1:N)
- **Description:** One user can create multiple vinyl listings
- **Foreign Key:** vinyl_listings.user_id references users.user_id
- **On Delete:** CASCADE (if user is deleted, their listings are also deleted)
- **Business Rule:** A listing must belong to a registered user

**ADMIN_USERS**
- **Type:** Independent entity
- **Description:** Separate admin accounts for security
- **No relationships:** Admin users don't own content, they moderate it

---

## 3. Table Specifications

### 3.1 USERS Table

**Purpose:** Stores registered user accounts (both individual collectors and retailers)

| Column Name        | Data Type      | Constraints                    | Description                          |
|--------------------|----------------|--------------------------------|--------------------------------------|
| user_id            | INT            | PRIMARY KEY, AUTO_INCREMENT    | Unique user identifier               |
| username           | VARCHAR(50)    | UNIQUE, NOT NULL               | User's login username                |
| email              | VARCHAR(100)   | UNIQUE, NOT NULL               | User's email address                 |
| password_hash      | VARCHAR(255)   | NOT NULL                       | Bcrypt hashed password               |
| user_type          | ENUM           | NOT NULL, DEFAULT 'individual' | 'individual' or 'retailer'           |
| first_name         | VARCHAR(50)    | NULL                           | User's first name                    |
| last_name          | VARCHAR(50)    | NULL                           | User's last name                     |
| registration_date  | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP      | Account creation timestamp           |
| last_login         | TIMESTAMP      | NULL                           | Last successful login time           |
| is_active          | BOOLEAN        | DEFAULT TRUE                   | Account active status                |

**Indexes:**
- PRIMARY KEY: user_id
- UNIQUE INDEX: username
- UNIQUE INDEX: email
- INDEX: user_type (for filtering by user type)

**Sample Data:**
```sql
user_id:  1
username: john_vinyl
email: john@example.com
user_type: individual
first_name: John
last_name: Smith
```

---

### 3.2 ADMIN_USERS Table

**Purpose:** Stores administrator accounts for content moderation

| Column Name    | Data Type      | Constraints                 | Description                    |
|----------------|----------------|-----------------------------|--------------------------------|
| admin_id       | INT            | PRIMARY KEY, AUTO_INCREMENT | Unique admin identifier        |
| username       | VARCHAR(50)    | UNIQUE, NOT NULL            | Admin login username           |
| password_hash  | VARCHAR(255)   | NOT NULL                    | Bcrypt hashed password         |
| email          | VARCHAR(100)   | UNIQUE, NOT NULL            | Admin email address            |
| created_at     | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP   | Admin account creation time    |
| last_login     | TIMESTAMP      | NULL                        | Last admin login time          |

**Indexes:**
- PRIMARY KEY: admin_id
- UNIQUE INDEX: username
- UNIQUE INDEX: email

**Sample Data:**
```sql
admin_id: 1
username: admin
email:  admin@musiconline.com
```

**Security Note:** Admin accounts are stored separately from regular users for enhanced security and role separation.

---

### 3.3 VINYL_LISTINGS Table

**Purpose:** Stores all vinyl records listed for sale by users

| Column Name      | Data Type       | Constraints                          | Description                           |
|------------------|-----------------|--------------------------------------|---------------------------------------|
| listing_id       | INT             | PRIMARY KEY, AUTO_INCREMENT          | Unique listing identifier             |
| user_id          | INT             | FOREIGN KEY, NOT NULL                | References users.user_id              |
| artist_name      | VARCHAR(100)    | NOT NULL                             | Name of the artist/band               |
| title            | VARCHAR(200)    | NOT NULL                             | Album/single/EP title                 |
| vinyl_type       | ENUM            | NOT NULL                             | 'album', 'single', or 'ep'            |
| genre            | VARCHAR(50)     | NULL                                 | Music genre                           |
| release_date     | DATE            | NULL                                 | Original release date                 |
| condition_grade  | ENUM            | DEFAULT 'Good'                       | Vinyl condition (see grades below)    |
| price            | DECIMAL(10,2)   | NOT NULL                             | Selling price in GBP                  |
| description      | TEXT            | NULL                                 | Detailed description                  |
| image_url        | VARCHAR(255)    | DEFAULT 'assets/images/placeholder.. .'| Path to vinyl image                   |
| created_at       | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP            | Listing creation time                 |
| updated_at       | TIMESTAMP       | ON UPDATE CURRENT_TIMESTAMP          | Last modification time                |
| is_approved      | BOOLEAN         | DEFAULT FALSE                        | Admin approval status                 |
| is_active        | BOOLEAN         | DEFAULT TRUE                         | Listing active/deleted status         |

**ENUM Values:**

**vinyl_type:**
- 'album' - Full-length album (LP)
- 'single' - 7" or 12" single
- 'ep' - Extended Play

**condition_grade:**
- 'Mint' (M) - Perfect condition
- 'Near Mint' (NM) - Almost perfect
- 'Very Good Plus' (VG+) - Minor wear
- 'Very Good' (VG) - Noticeable wear but plays well
- 'Good' (G) - Significant wear
- 'Fair' (F) - Heavy wear
- 'Poor' (P) - Barely playable

**Indexes:**
- PRIMARY KEY: listing_id
- FOREIGN KEY: user_id → users.user_id (CASCADE on delete)
- INDEX: artist_name (for artist searches)
- INDEX: title (for title searches)
- INDEX: vinyl_type (for filtering)
- INDEX: user_id (for user's listings)
- INDEX: is_approved (for admin filtering)
- FULLTEXT INDEX: (artist_name, title, description) for search functionality

**Sample Data:**
```sql
listing_id: 1
user_id: 1
artist_name: The Beatles
title: Abbey Road
vinyl_type: album
genre: Rock
release_date: 1969-09-26
condition_grade: Near Mint
price: 45.99
description: Classic Beatles album in excellent condition... 
is_approved: TRUE
is_active: TRUE
```

---

## 4. Relationships and Constraints

### 4.1 Foreign Key Constraints

**vinyl_listings.user_id → users.user_id**
```sql
CONSTRAINT fk_vinyl_user 
FOREIGN KEY (user_id) 
REFERENCES users(user_id) 
ON DELETE CASCADE
```

**Business Rules:**
- A vinyl listing MUST belong to a registered user
- If a user is deleted, all their listings are automatically deleted (CASCADE)
- Maintains referential integrity

### 4.2 Data Integrity Rules

1. **Username and Email Uniqueness**
   - No two users can have the same username
   - No two users can have the same email address
   - Enforced by UNIQUE constraints

2. **Password Security**
   - All passwords stored as bcrypt hashes (60 characters)
   - Never store plain text passwords
   - VARCHAR(255) allows for future hash algorithm changes

3. **Price Validation**
   - DECIMAL(10,2) allows prices up to £99,999,999.99
   - Always non-negative (enforced in application layer)
   - Two decimal places for pence

4. **Timestamps**
   - `created_at` automatically set on INSERT
   - `updated_at` automatically updated on any UPDATE
   - Provides audit trail

5. **Boolean Flags**
   - `is_active`: Soft delete mechanism
   - `is_approved`: Admin moderation workflow
   - Both default appropriately for new records

---

## 5. Normalization

### Normal Form Compliance

**First Normal Form (1NF):**
✅ All attributes contain atomic values
✅ No repeating groups
✅ Each column contains single value

**Second Normal Form (2NF):**
✅ All non-key attributes fully dependent on primary key
✅ No partial dependencies

**Third Normal Form (3NF):**
✅ No transitive dependencies
✅ All non-key attributes depend only on primary key

### Design Decisions

**Why separate admin_users table?**
- Security isolation
- Different authentication logic
- Different permissions and roles
- Prevents privilege escalation

**Why ENUM for vinyl_type and condition_grade?**
- Limited, known set of values
- Data integrity at database level
- Efficient storage
- Easy to query and filter

**Why FULLTEXT index on artist_name, title, description?**
- Enables fast, natural language searching
- Better than multiple LIKE queries
- Supports relevance ranking
- Essential for search functionality

---

## 6. Indexing Strategy

### Performance Optimization

**Primary Indexes (Automatic):**
- users.user_id
- admin_users.admin_id
- vinyl_listings.listing_id

**Unique Indexes (Data Integrity):**
- users.username
- users.email
- admin_users.username
- admin_users.email

**Search Indexes (Query Performance):**
- vinyl_listings.artist_name
- vinyl_listings.title
- vinyl_listings.vinyl_type
- vinyl_listings.user_id
- vinyl_listings. is_approved

**Full-Text Search Index:**
- FULLTEXT (artist_name, title, description)
- Enables:  `MATCH... AGAINST` queries
- Use case: Main search functionality

### Query Examples Using Indexes

**Find user's listings:**
```sql
SELECT * FROM vinyl_listings 
WHERE user_id = 1;  -- Uses index on user_id
```

**Search by artist:**
```sql
SELECT * FROM vinyl_listings 
WHERE artist_name LIKE 'Beatles%';  -- Uses index on artist_name
```

**Full-text search:**
```sql
SELECT * FROM vinyl_listings 
WHERE MATCH(artist_name, title, description) 
AGAINST('Pink Floyd' IN NATURAL LANGUAGE MODE);
```

---

## 7. Security Considerations

### Database-Level Security

1. **Password Hashing**
   - Never store plain-text passwords
   - Use PHP's `password_hash()` with PASSWORD_DEFAULT
   - Automatically uses bcrypt with cost factor 10+

2. **Prepared Statements**
   - All queries use PDO prepared statements
   - Prevents SQL injection attacks
   - Parameters bound separately from SQL

3. **Least Privilege Principle**
   - Database user has only necessary permissions
   - No DROP or ALTER permissions in production
   - SELECT, INSERT, UPDATE, DELETE only

4. **Data Validation**
   - Constraints at database level (UNIQUE, NOT NULL, FOREIGN KEY)
   - Additional validation in application layer
   - Defense in depth strategy

---

## 8. Sample Queries

### User Management

**Register new user:**
```sql
INSERT INTO users (username, email, password_hash, user_type, first_name, last_name)
VALUES ('newuser', 'user@example.com', '$2y$10$... ', 'individual', 'John', 'Doe');
```

**User login (verify):**
```sql
SELECT user_id, username, password_hash, user_type 
FROM users 
WHERE username = ?  AND is_active = TRUE;
```

### Vinyl Listing Operations

**Create listing:**
```sql
INSERT INTO vinyl_listings (user_id, artist_name, title, vinyl_type, price, description)
VALUES (1, 'Pink Floyd', 'The Wall', 'album', 42.99, 'Double album.. .');
```

**Search approved listings:**
```sql
SELECT v.*, u.username 
FROM vinyl_listings v
JOIN users u ON v.user_id = u.user_id
WHERE v.is_approved = TRUE 
  AND v.is_active = TRUE
  AND (v.artist_name LIKE '%Floyd%' OR v.title LIKE '%Floyd%')
ORDER BY v.created_at DESC;
```

**User's own listings:**
```sql
SELECT * FROM vinyl_listings
WHERE user_id = ?  
ORDER BY created_at DESC;
```

### Admin Operations

**Pending listings:**
```sql
SELECT v.*, u.username, u.email
FROM vinyl_listings v
JOIN users u ON v. user_id = u.user_id
WHERE v.is_approved = FALSE AND v.is_active = TRUE
ORDER BY v.created_at ASC;
```

**Approve listing:**
```sql
UPDATE vinyl_listings 
SET is_approved = TRUE 
WHERE listing_id = ?;
```

---

## 9. Database Maintenance

### Backup Strategy
- Daily automated backups
- Export to `.sql` file
- Store schema separately from data
- Test restore procedures regularly

### Monitoring
- Track slow queries
- Monitor index usage
- Check table sizes
- Review error logs

### Future Scalability
- Current design supports thousands of users
- Indexes optimize for read-heavy workload
- Can add caching layer (Redis/Memcached) if needed
- Consider partitioning vinyl_listings if >1M rows

---

## 10. ER Diagram Creation Instructions

To create a visual ER diagram for your documentation, use one of these tools:

### Recommended Tools:

1. **Draw.io (diagrams.net)** - Free, web-based
   - Visit:  https://app.diagrams.net/
   - Use Entity Relationship shapes
   - Export as PNG/PDF

2. **dbdiagram.io** - Free, database-specific
   - Visit: https://dbdiagram.io/
   - Paste table definitions
   - Auto-generates diagram

3. **MySQL Workbench** - Free desktop app
   - Reverse engineer from existing database
   - Export as image

### What to Include in Diagram:

- All three tables (users, admin_users, vinyl_listings)
- Primary keys marked
- Foreign key relationships with cardinality (1:N)
- Key attributes for each table
- Relationship lines showing user_id FK

---

**Document Version:** 1.0  
**Last Updated:** January 14, 2026  
**Author:** jjmiff