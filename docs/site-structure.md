# Site Structure and Navigation
## musicOnline. com - Vinyl Music Marketplace

**Project:** Dynamic Data-Driven Vinyl Marketplace  
**Student:** jjmiff  
**Date:** January 2026  

---

## 1. Site Map

### Visual Site Structure

```
musicOnline.com (Homepage)
│
├── Public Pages (Accessible to all visitors)
│   ├── Home (index.php) ★
│   ├── Search/Browse (search.php)
│   ├── Vinyl Detail (vinyl-detail.php)
│   ├── Register (register.php)
│   └── Login (login.php)
│
├── User Area (Requires user authentication)
│   ├── User Dashboard (user/dashboard.php) ★
│   ├── Add Vinyl (user/add-vinyl.php)
│   ├── Edit Vinyl (user/edit-vinyl.php)
│   ├── Delete Vinyl (user/delete-vinyl.php)
│   └── Logout (logout.php)
│
└── Admin Area (Requires admin authentication)
    ├── Admin Login (admin/login.php)
    ├── Admin Dashboard (admin/index.php) ★
    ├── Moderate Listings (admin/moderate.php)
    ├── View Users (admin/users.php)
    └── Admin Logout (admin/logout.php)

★ = Landing page for each user type
```

---

## 2. Page Inventory and Descriptions

### 2.1 Public Pages

#### **Homepage (index.php)**
**Purpose:** Main landing page and entry point  
**Audience:** All visitors (public)  
**Key Elements:**
- Navigation bar with site branding
- Hero section with tagline and search form
- Featured vinyl listings (8 most recent approved items)
- Call-to-action buttons (Register/Login)
- Footer with copyright info

**User Actions:**
- Search for vinyl records
- Browse featured listings
- Click to view vinyl details
- Navigate to register/login
- Access all public pages

**Access:** Public (no authentication required)

---

#### **Search/Browse Page (search.php)**
**Purpose:** Display search results and allow vinyl browsing  
**Audience:** All visitors  
**Key Elements:**
- Search form (artist, title, type filter)
- Grid/list of matching vinyl records
- Pagination for large result sets
- Sort options (newest, price, condition)
- Filter sidebar (type, genre, price range)
- "No results" message when applicable

**User Actions:**
- Refine search criteria
- Filter results
- Sort results
- Click vinyl to view details
- Navigate through pages

**Access:** Public

---

#### **Vinyl Detail Page (vinyl-detail.php)**
**Purpose:** Display complete information about a single vinyl listing  
**Audience:** All visitors  
**Key Elements:**
- Large vinyl image (or placeholder)
- Artist name and title (prominent)
- Vinyl type badge (album/single/EP)
- Price (large, bold)
- Condition grade
- Genre
- Release date
- Full description
- Seller information (username, type)
- Listing date
- Placeholder "Contact Seller" button (non-functional in prototype)

**User Actions:**
- View full listing details
- See seller information
- Return to search results
- Navigate to other listings

**Access:** Public

---

#### **Registration Page (register.php)**
**Purpose:** Allow new users to create accounts  
**Audience:** Visitors without accounts  
**Key Elements:**
- Registration form with fields: 
  - Username
  - Email
  - Password
  - Confirm Password
  - User Type (Individual/Retailer radio buttons)
  - First Name
  - Last Name
- Form validation messages
- Password strength requirements display
- Terms of service checkbox (optional)
- "Already have an account?" login link

**User Actions:**
- Fill out registration form
- Select user type
- Submit registration
- View validation errors
- Navigate to login if already registered

**Validation:**
- Username: 3-50 chars, unique, alphanumeric
- Email: Valid format, unique
- Password: Min 8 chars, uppercase, lowercase, number
- All required fields completed

**Access:** Public (redirects if already logged in)

---

#### **Login Page (login.php)**
**Purpose:** Authenticate registered users  
**Audience:** Registered users  
**Key Elements:**
- Login form: 
  - Username/Email field
  - Password field
  - "Remember me" checkbox (optional)
- Error messages for failed login
- "Forgot password?" link (placeholder)
- "Need an account?" registration link

**User Actions:**
- Enter credentials
- Submit login
- Redirect to dashboard on success
- View error on failure
- Navigate to registration

**Security:**
- Password not visible (type="password")
- CSRF token protection
- Rate limiting (optional enhancement)
- Session creation on success

**Access:** Public (redirects to dashboard if already logged in)

---

### 2.2 User Area (Authentication Required)

#### **User Dashboard (user/dashboard.php)**
**Purpose:** Central hub for logged-in users  
**Audience:** Authenticated users (individual/retailer)  
**Key Elements:**
- Welcome message with username
- User statistics: 
  - Total listings
  - Approved listings
  - Pending approval
  - Total value of listings
- User's vinyl listings table: 
  - Thumbnail
  - Title/Artist
  - Type
  - Price
  - Status (Approved/Pending)
  - Action buttons (Edit/Delete)
- "Add New Vinyl" button (prominent)
- Quick links section

**User Actions:**
- View all their listings
- Add new vinyl listing
- Edit existing listings
- Delete listings
- View approval status
- Access account settings (future)

**Access:** Requires user login

---

#### **Add Vinyl Page (user/add-vinyl. php)**
**Purpose:** Allow users to create new vinyl listings  
**Audience:** Authenticated users  
**Key Elements:**
- Form with fields: 
  - Artist Name*
  - Title*
  - Vinyl Type* (dropdown:  Album/Single/EP)
  - Genre
  - Release Date (date picker)
  - Condition Grade* (dropdown: Mint to Poor)
  - Price* (GBP)
  - Description (textarea)
  - Image (placeholder URL for prototype)
- Required field indicators (*)
- Form validation messages
- Submit and Cancel buttons
- Information note:  "Listing requires admin approval"

**User Actions:**
- Fill out listing form
- Select options from dropdowns
- Submit listing
- Cancel and return to dashboard

**Validation:**
- Required fields must be completed
- Price must be positive number
- Date must be valid format
- Max description length

**Access:** Requires user login

---

#### **Edit Vinyl Page (user/edit-vinyl.php)**
**Purpose:** Allow users to modify their own listings  
**Audience:** Authenticated users (listing owners only)  
**Key Elements:**
- Same form as Add Vinyl
- Pre-populated with existing data
- Listing ID displayed (read-only)
- "Last updated" timestamp shown
- Warning:  "Edited listings require re-approval"
- Update and Cancel buttons

**User Actions:**
- Modify listing details
- Update listing
- Cancel changes
- Return to dashboard

**Security:**
- Verify user owns the listing
- Prevent editing others' listings
- Re-approval required after edit

**Access:** Requires user login + ownership verification

---

#### **Delete Vinyl (user/delete-vinyl.php)**
**Purpose:** Allow users to remove their listings  
**Audience:** Authenticated users (listing owners only)  
**Key Elements:**
- Confirmation page showing: 
  - Vinyl details to be deleted
  - Warning message
  - Confirm/Cancel buttons
- Success/error messages

**User Actions:**
- Confirm deletion
- Cancel and return
- View confirmation

**Security:**
- Verify user owns the listing
- Require confirmation
- Soft delete (is_active = FALSE) or hard delete

**Access:** Requires user login + ownership verification

---

### 2.3 Admin Area (Admin Authentication Required)

#### **Admin Login (admin/login.php)**
**Purpose:** Separate authentication for administrators  
**Audience:** Site administrators  
**Key Elements:**
- Admin login form:
  - Admin Username
  - Admin Password
- Error messages
- No registration link (admins created manually)
- Separate session from regular users

**User Actions:**
- Enter admin credentials
- Login to admin panel

**Security:**
- Separate admin_users table
- Different session variable (admin_id)
- No public registration

**Access:** Public (separate from user login)

---

#### **Admin Dashboard (admin/index.php)**
**Purpose:** Overview of site activity and moderation needs  
**Audience:** Administrators  
**Key Elements:**
- Statistics cards:
  - Total users
  - Total listings
  - Pending approvals
  - Approved listings today
- Recent activity feed
- Quick action buttons: 
  - Moderate Listings
  - View Users
  - View All Listings
- Charts/graphs (optional)

**User Actions:**
- View site statistics
- Navigate to moderation tools
- Access user management
- Quick approve/disapprove

**Access:** Requires admin login

---

#### **Moderate Listings (admin/moderate.php)**
**Purpose:** Review and approve/reject user-submitted vinyl listings  
**Audience:** Administrators  
**Key Elements:**
- Table of pending listings: 
  - Thumbnail
  - Artist/Title
  - Submitted by (username)
  - Submission date
  - Actions (Approve/Reject/View)
- Filter options:
  - Show All / Pending / Approved / Rejected
  - Search by user
- Bulk actions (optional)
- Detail view modal/page

**User Actions:**
- Review pending listings
- Approve appropriate listings
- Reject inappropriate content
- View listing details
- Filter and search

**Security:**
- Only admins can access
- Log moderation actions (optional)

**Access:** Requires admin login

---

#### **View Users (admin/users.php)**
**Purpose:** Monitor registered users  
**Audience:** Administrators  
**Key Elements:**
- User table: 
  - Username
  - Email
  - User Type
  - Registration Date
  - Listing Count
  - Status (Active/Inactive)
  - Actions (View/Deactivate)
- Search and filter
- Sort options

**User Actions:**
- View all users
- Search for specific users
- View user details
- Deactivate problematic accounts

**Access:** Requires admin login

---

## 3. Navigation Structure

### 3.1 Primary Navigation (All Pages)

**Logo/Brand:** musicOnline.com (links to homepage)

**For Public/Non-Logged-In Users:**
```
Home | Browse | Register | Login
```

**For Logged-In Users:**
```
Home | Browse | My Dashboard | Logout
```

**For Admins (in admin area):**
```
Dashboard | Moderate | Users | Logout
```

### 3.2 Navigation Hierarchy

**Level 1: Main Navigation Bar**
- Always visible
- Responsive (hamburger menu on mobile)
- Active page highlighted

**Level 2: Sub-Navigation**
- User Dashboard:  Internal tabs/sections
- Admin Panel: Sidebar menu

**Level 3: Contextual Actions**
- Action buttons within pages (Edit, Delete, etc.)
- Breadcrumbs on detail pages

---

## 4. User Flows

### 4.1 New User Registration and First Listing

```
1. Visitor lands on Homepage
   ↓
2. Clicks "Register" in navigation
   ↓
3. Fills out registration form
   ↓
4. Selects user type (Individual/Retailer)
   ↓
5. Submits form → Account created
   ↓
6. Redirected to Login page
   ↓
7. Logs in with new credentials
   ↓
8. Redirected to User Dashboard
   ↓
9. Clicks "Add New Vinyl" button
   ↓
10. Fills out vinyl listing form
    ↓
11. Submits listing → Pending approval
    ↓
12. Returns to Dashboard
    ↓
13. Sees listing with "Pending" status
```

**Success Criteria:** User can successfully create account and add listing

---

### 4.2 Search and View Vinyl Details

```
1. Any visitor on Homepage
   ↓
2. Enters search query (e.g., "Beatles")
   ↓
3. Optionally selects vinyl type filter
   ↓
4. Clicks "Search" button
   ↓
5. Redirected to search. php with results
   ↓
6. Browses grid of vinyl records
   ↓
7. Clicks on vinyl card → vinyl-detail.php
   ↓
8. Views complete listing information
   ↓
9. Sees seller information
   ↓
10. Can return to search or browse more
```

**Success Criteria:** Search returns relevant results, details display correctly

---

### 4.3 User Edits Own Listing

```
1. User logs in
   ↓
2. Navigates to Dashboard
   ↓
3. Views table of their listings
   ↓
4. Clicks "Edit" button on a listing
   ↓
5. Redirected to edit-vinyl.php? id=X
   ↓
6. Form pre-populated with current data
   ↓
7. User modifies fields (e.g., price)
   ↓
8. Clicks "Update" button
   ↓
9. System validates changes
   ↓
10. Database updated
    ↓
11. Listing status → "Pending" (requires re-approval)
    ↓
12. Success message displayed
    ↓
13. Redirected to Dashboard
```

**Success Criteria:** User can edit only their own listings, changes persist

---

### 4.4 Admin Moderates Listings

```
1. Admin logs in via admin/login.php
   ↓
2. Redirected to Admin Dashboard
   ↓
3. Sees "X Pending Approvals" notification
   ↓
4. Clicks "Moderate Listings"
   ↓
5. Views table of pending listings
   ↓
6. Reviews listing details
   ↓
7. Decides:  Approve or Reject
   ↓
8. Clicks "Approve" button
   ↓
9. Listing status → Approved
   ↓
10. Listing now visible on public site
    ↓
11. Admin continues reviewing next listing
```

**Success Criteria:** Admin can approve/reject, changes reflect immediately

---

## 5. Responsive Behavior

### 5.1 Breakpoints

**Mobile:** 320px - 767px  
**Tablet:** 768px - 1023px  
**Desktop:** 1024px+

### 5.2 Navigation Adaptations

**Desktop:**
- Full horizontal navigation bar
- All menu items visible

**Tablet:**
- Horizontal navigation, may wrap
- Logo and hamburger menu

**Mobile:**
- Hamburger menu (collapsed)
- Vertical dropdown menu
- Logo centered or left-aligned

### 5.3 Content Layout Adaptations

**Vinyl Grid:**
- Desktop: 4 columns
- Tablet: 2-3 columns
- Mobile: 1 column (full width)

**Forms:**
- Desktop: Two-column layout
- Tablet: Two-column or single
- Mobile: Single column, full width

**Tables:**
- Desktop: Full table
- Tablet: Responsive scroll
- Mobile: Card-based layout or horizontal scroll

---

## 6. URL Structure

### Public URLs
```
/                           → Homepage
/search.php? query=beatles   → Search results
/vinyl-detail.php?id=5      → Vinyl details
/register.php               → Registration
/login.php                  → User login
```

### User Area URLs
```
/user/dashboard.php         → User dashboard
/user/add-vinyl.php         → Add new listing
/user/edit-vinyl. php?id=10  → Edit listing
/user/delete-vinyl. php?id=10 → Delete listing
/logout.php                 → Logout
```

### Admin Area URLs
```
/admin/login.php            → Admin login
/admin/index.php            → Admin dashboard
/admin/moderate.php         → Moderate listings
/admin/users.php            → View users
/admin/logout. php           → Admin logout
```

**URL Conventions:**
- Descriptive, lowercase
- Hyphens for multi-word pages
- ID parameters for specific items
- Separate /admin/ and /user/ directories

---

## 7. Access Control Matrix

| Page                  | Public | Logged-In User | Admin |
|-----------------------|--------|----------------|-------|
| Homepage              | ✓      | ✓              | ✓     |
| Search/Browse         | ✓      | ✓              | ✓     |
| Vinyl Detail          | ✓      | ✓              | ✓     |
| Register              | ✓      | ✗              | ✗     |
| Login                 | ✓      | ✗              | ✗     |
| User Dashboard        | ✗      | ✓ (own)        | ✗     |
| Add Vinyl             | ✗      | ✓              | ✗     |
| Edit Vinyl            | ✗      | ✓ (own only)   | ✗     |
| Delete Vinyl          | ✗      | ✓ (own only)   | ✗     |
| Admin Login           | ✓      | ✓              | ✗     |
| Admin Dashboard       | ✗      | ✗              | ✓     |
| Moderate Listings     | ✗      | ✗              | ✓     |
| View Users            | ✗      | ✗              | ✓     |

**Legend:**
- ✓ = Accessible
- ✗ = Redirects/Access Denied
- (own) = Can only access their own data

---

## 8. Error Pages and Redirects

### Error Handling

**404 Not Found:**
- Custom 404 page
- Helpful message
- Navigation back to homepage
- Search box

**403 Forbidden:**
- Access denied message
- Explanation (not logged in, wrong permissions)
- Link to login or homepage

**500 Internal Server Error:**
- Generic error message
- Contact information
- No technical details exposed

### Redirect Logic

**If not logged in, trying to access user area:**
→ Redirect to /login.php with message

**If logged in, visiting login/register:**
→ Redirect to /user/dashboard.php

**If not admin, trying to access admin area:**
→ Redirect to /admin/login. php

**After successful login:**
→ Redirect to dashboard (or originally requested page)

**After logout:**
→ Redirect to homepage with success message

---

**Document Version:** 1.0  
**Last Updated:** January 14, 2026  
**Author:** jjmiff