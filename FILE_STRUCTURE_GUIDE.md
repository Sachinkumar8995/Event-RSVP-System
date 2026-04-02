# Event RSVP System - Complete File Structure & Code Explanation

---

## 📁 PROJECT STRUCTURE

```
Event-RSVP/
├── client/                  # FRONTEND (React)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ExplorePage.jsx
│   │   │   ├── EventDetailsPage.jsx
│   │   │   ├── MyRSVPsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   └── ContactPage.jsx
│   │   └── services/
│   │       └── api.js
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── ...
│
└── server/                  # BACKEND (Node.js + Express)
    ├── index.js
    ├── seeder.js
    ├── package.json
    ├── config/
    │   ├── db.js
    │   └── email.js
    ├── models/
    │   ├── User.js
    │   ├── Event.js
    │   └── RSVP.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── eventRoutes.js
    │   ├── rsvpRoutes.js
    │   └── contactRoutes.js
    ├── controllers/
    │   ├── authController.js
    │   ├── eventController.js
    │   ├── rsvpController.js
    │   └── contactController.js
    └── middleware/
        └── authMiddleware.js
```

---

# 🖥️ FRONTEND FILES (React)

## **1. main.jsx** - Entry Point
**Location:** `client/src/main.jsx`

```jsx
// This is where the React app STARTS
// It imports the root App component and wraps it with:
// - ThemeProvider → provides dark/light mode
// - StrictMode → checks for bugs in React

// Process:
// 1. Creates root element
// 2. Wraps everything with ThemeProvider
// 3. Renders App.jsx inside it
```

**What it does:**
- Initializes the entire React application
- Sets up ThemeProvider to manage dark/light mode globally
- Used by Vite build tool

---

## **2. App.jsx** - Main Router
**Location:** `client/src/App.jsx`

```jsx
// The HEART of app navigation
// Uses React Router to define all routes/pages

Structure:
├── Router (BrowserRouter)
│   └── AuthProvider (wraps whole app)
│       └── Routes (defines pages)
│           ├── / → HomePage
│           ├── /explore → ExplorePage
│           ├── /events/:id → EventDetailsPage
│           ├── /login → LoginPage
│           ├── /register → RegisterPage
│           ├── /my-rsvps → MyRSVPsPage
│           ├── /profile → ProfilePage
│           ├── /admin → AdminPage
│           ├── /about → AboutPage
│           └── /contact → ContactPage
```

**What it does:**
- Defines ALL pages/routes in the application
- Wraps everything with AuthProvider for authentication
- Uses React Router DOM to navigate between pages

**Why it's important:**
- Central control point for app navigation
- Ensures user can access all pages
- AuthProvider means all pages can check if user is logged in

---

## **3. AuthContext.jsx** - Authentication Management
**Location:** `client/src/context/AuthContext.jsx`

**What is Context?** Think of it as a "global storage" for user information that ANY page can access.

```javascript
// Creates a Context object that stores:
const [user, setUser] = useState(null);      // Current logged-in user
const [loading, setLoading] = useState(true); // Is app still loading?

// On app start, checks if user is already logged in
useEffect(() => {
    const checkLoggedIn = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data);  // User already logged in!
        } catch (error) {
            setUser(null);  // No user logged in
        }
    };
    checkLoggedIn();
}, []);
```

**Functions it provides:**

| Function | What it does |
|----------|-------------|
| `login(email, password)` | Sends login request to backend, saves user if successful |
| `register(name, email, password)` | Creates new account, saves user if successful |
| `logout()` | Deletes login session, clears user data |

**How Pages Use It:**
```jsx
const { user, login, logout, loading } = useContext(AuthContext);

// Check if user is logged in
if (!user) {
    return <div>Please log in first</div>;
}

// Show user's name
<p>Welcome {user.name}!</p>
```

---

## **4. ThemeContext.jsx** - Dark/Light Mode
**Location:** `client/src/context/ThemeContext.jsx`

**Functions it provides:**
- `theme` - Current theme ('light' or 'dark')
- `toggleTheme()` - Switch between light and dark

**How it works:**
```javascript
// Checks localStorage for saved theme
// If not saved, checks system preference (OS dark mode)
const [theme, setTheme] = useState(() => {
    if (localStorage.getItem('theme')) {
        return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
});

// When theme changes, adds/removes 'dark' class to HTML element
// Tailwind CSS reads this class and applies dark styles
```

**Why Tailwind knows about dark mode?**
```html
<!-- Light mode CSS classes -->
<div className="bg-white text-gray-900">

<!-- Dark mode CSS classes (only applied when 'dark' class on html) -->
<div className="bg-white dark:bg-dark-900">
```

---

## **5. api.js** - HTTP Client Configuration
**Location:** `client/src/services/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',  // Backend server address
    withCredentials: true,                   // Send cookies with requests
});

// Now instead of: axios.get('http://localhost:5000/api/events')
// We can just do: api.get('/events')
// And it automatically adds the base URL
```

**Why we need this:**
- Don't repeat `http://localhost:5000/api` in every request
- Cookies automatically sent (needed for sessions)
- Easy to change backend URL later

---

## **6. Layout.jsx** - Main Page Wrapper
**Location:** `client/src/components/Layout.jsx`

**What it does:**
```jsx
return (
    <div>
        <Navbar />              {/* Navigation bar at top */}
        
        <main>
            <Outlet />          {/* This is where different pages load */}
        </main>
        
        <footer>                {/* Footer at bottom */}
            {/* Links, social media, etc */}
        </footer>
    </div>
);
```

**Why it's important:**
- Every page has same navbar and footer
- Outlet acts as placeholder for actual page content
- Prevents repeating navbar/footer code on each page

---

## **7. Navbar.jsx** - Navigation Bar
**Location:** `client/src/components/Navbar.jsx`

**Shows different things based on login status:**

```jsx
if (user) {
    // Show for logged-in users:
    // - Home, Explore, About, Contact links
    // - My RSVPs
    // - Admin (if user is admin)
    // - User's name
    // - Logout button
} else {
    // Show for not logged in:
    // - Home, Explore, About, Contact links
    // - Login button
    // - Sign Up button
}

// Always shows:
// - Theme toggle (sun/moon icon)
```

**Key Features:**
- Sticky navbar (stays at top when scrolling)
- Dark mode support
- Responsive (different layout on mobile)
- Links change based on user login status

---

## **8. HomePage.jsx** - Landing Page
**Location:** `client/src/pages/HomePage.jsx`

**Sections:**
1. **Hero Section** - Big welcome message + "Explore Events" button
2. **How It Works** - 3 steps (Discover → Book → Connect)
3. **Popular Categories** - 8 event categories with images
4. **Why Choose Us** - Benefits list
5. **Call to Action** - Final button to explore

**What it does:**
- Welcomes new visitors
- Explains the platform
- Encourages exploration or sign up
- Shows event categories

---

## **9. RegisterPage.jsx** - Sign Up Form
**Location:** `client/src/pages/RegisterPage.jsx`

```jsx
// Form fields:
// - Full Name
// - Email Address
// - Password

// When submitted:
// 1. Validate fields (check if empty)
// 2. Call register() from AuthContext
// 3. If success → User logged in → Redirect to home
// 4. If error → Show error message
```

**Flow:**
```
User fills form → Click Sign Up → 
Sends to backend → Backend creates user → 
User logged in automatically → Redirect home
```

---

## **10. LoginPage.jsx** - Login Form
**Location:** `client/src/pages/LoginPage.jsx`

```jsx
// Form fields:
// - Email Address
// - Password

// When submitted:
// 1. Call login() from AuthContext
// 2. If success → Log messages + Redirect to home
// 3. If error → Show error message
```

---

## **11. ExplorePage.jsx** - Browse All Events
**Location:** `client/src/pages/ExplorePage.jsx`

**Features:**
1. **Search Bar** - Find events by title/location
2. **Category Filter** - Filter by event type
3. **Event Grid** - Shows all events matching filters
4. **Event Cards** - Each shows:
   - Event title
   - Description
   - Date & Time
   - Location

**How filtering works:**
```javascript
// User types "tech" in search
// Filter by title/description containing "tech"
// Loop through all events
// Only show matching ones
```

**Category Filter:**
```javascript
const categories = [
    'Music & Concerts',
    'Tech & Workshops',
    'Food & Drink',
    // ... etc
];

// When user clicks category button
// Only show events with that category
```

---

## **12. EventDetailsPage.jsx** - Single Event Details
**Location:** `client/src/pages/EventDetailsPage.jsx`

**Shows:**
- Full event details: title, description, date, time, location
- RSVP buttons: Going / Maybe / Not Going
- Each button changes color when selected

**RSVP Logic:**
```javascript
// User clicks "Going" button
// 1. Check if user is logged in
// 2. If not → redirect to login
// 3. If yes → Send RSVP to backend
// 4. Change button color to green
// 5. Show success message
```

**Three RSVP states:**
- **Going** (Green) - User is attending
- **Maybe** (Yellow) - User is unsure
- **Not Going** (Red) - User won't attend

---

## **13. MyRSVPsPage.jsx** - User's Event List
**Location:** `client/src/pages/MyRSVPsPage.jsx`

**Shows two tabs:**
1. **Upcoming Events** - Events user is attending (not passed date)
   - Shows "Going" or "Maybe"
   - Can cancel RSVP
2. **Past Events** - Events that already happened
   - Shown in gray
   - Can't cancel (already happened)

**Features:**
- Special "Starts Soon" badge (if event is within 24 hours)
- Shows event date, time, location
- Links to view full event details

---

## **14. ProfilePage.jsx** - User Information
**Location:** `client/src/pages/ProfilePage.jsx`

**Shows:**
- User's name
- User's email
- Account role (Regular User or Administrator)
- Logout button

**Why it exists:**
- Users can view their account info
- Confirm which email is registered
- Verify if they're admin
- Easy logout from account page

---

## **15. AdminPage.jsx** - Admin Dashboard
**Location:** `client/src/pages/AdminPage.jsx`

**Three main sections:**

### **Section 1: Events Tab**
```jsx
// Admin can:
✓ See all events
✓ Create new event (click + Create button)
✓ Edit existing event
✓ Delete event
✓ View RSVPs for event
✓ Send reminder emails to attendees
```

**Create/Edit Event Form:**
```
- Title
- Description
- Date (YYYY-MM-DD)
- Time (HH:MM)
- Location
- Category (dropdown)
```

### **Section 2: Users Tab**
```jsx
// Admin can:
✓ See all registered users
✓ Delete user
✓ Make user an admin (give admin permissions)
```

### **Section 3: Features**
- Delete event (asks confirmation first)
- Edit event (opens form with current values)
- View attendees list
- Send reminders (sends email to all attendees)

---

## **16. ContactPage.jsx** - Contact Form
**Location:** `client/src/pages/ContactPage.jsx`

**Left side (Info):**
- Email address: noreplyeventhub12@gmail.com
- Phone: +91 1234567890
- Address: Lovely professional university, Phagwara, Punjab

**Right side (Form):**
```
Fields:
- First Name
- Last Name
- Email
- Message (textarea)

When submitted:
1. Validate all fields
2. Validate email format
3. Check message length (min 10 chars)
4. Send to backend
5. Admin receives email with message
6. User receives confirmation email
7. Show success message
```

---

## **17. AboutPage.jsx & Other Pages**
**Location:** `client/src/pages/AboutPage.jsx` and `ContactPage.jsx` (already explained above)

These are simple informational pages.

---

# ⚙️ BACKEND FILES (Node.js + Express)

## **1. index.js** - Server Entry Point
**Location:** `server/index.js`

**What it does:**
```javascript
// 1. Connect to MongoDB database
const connectDB = require('./config/db');
connectDB();

// 2. Create Express app
const express = require('express');
const app = express();

// 3. Setup middleware
app.use(cors());                    // Allow requests from frontend
app.use(express.json());            // Parse incoming JSON
app.use(session(...));              // Setup sessions for login

// 4. Setup routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/rsvp', require('./routes/rsvpRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// 5. Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
```

**Each route does:**
- `/api/auth` → User login, register, logout
- `/api/events` → Create, read, delete events
- `/api/rsvp` → Create RSVP, view RSVPs
- `/api/contact` → Submit contact form

---

## **2. config/db.js** - Database Connection
**Location:** `server/config/db.js`

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    const MONGO_URI = 'mongodb://localhost:27017/eventhub';
    
    // Connect to MongoDB
    const conn = await mongoose.connect(MONGO_URI);
    
    // Log success
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Using Database: ${conn.connection.name}`);
};
```

**What it does:**
- Connects to MongoDB database
- Database name: `eventhub`
- Database runs on localhost (your computer)
- Prints success message when connected

---

## **3. config/email.js** - Email Configuration
**Location:** `server/config/email.js`

```javascript
const nodemailer = require('nodemailer');

// Gmail account to send emails FROM
const GMAIL_USER = 'noreplyeventhub12@gmail.com';
const GMAIL_APP_PASSWORD = 'gyfjxybdnhixlfvn';

// Setup SMTP connection to Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
    }
});

// Function 1: Send event reminder
async function sendEventReminder(userEmail, userName, event) {
    // Sends email like:
    // "Hi John, reminder: Tech Conference coming up on March 15!"
    
    // Beautiful HTML email with event details
}

// Function 2: Send contact form email
async function sendContactEmail(firstName, lastName, email, message) {
    // Sends contact message to admin
    // Also sends confirmation email to user
    
    // Admin gets: "John Doe sent you a message"
    // User gets: "We received your message"
}
```

**Why Gmail + App Password?**
- Gmail is free and reliable
- App Password is more secure than real password
- Regular password would be detected as unsafe

---

## **4. Models - Database Schemas**

### **User.js** - User Model
```javascript
const userSchema = {
    name: String (required),
    email: String (unique, required),
    password: String (auto-hashed with bcrypt),
    isAdmin: Boolean (default: false),
    timestamps: true (createdAt, updatedAt)
};

// Methods:
matchPassword() → Compare entered password with stored hashed password
// Pre-save hook: Automatically hash password before saving
```

### **Event.js** - Event Model
```javascript
const eventSchema = {
    user: ObjectId (creator of event, references User),
    title: String,
    description: String,
    date: String (YYYY-MM-DD format),
    time: String (HH:MM format),
    location: String,
    category: Enum (one of 8 categories),
    timestamps: true
};
```

### **RSVP.js** - RSVP Model
```javascript
const rsvpSchema = {
    user: ObjectId (references User),
    event: ObjectId (references Event),
    status: Enum ('going', 'maybe', 'not_going'),
    timestamps: true
};

// Important: Unique index on (user + event)
// Means: One user can only RSVP once per event
```

**Example in database:**

User John → Event Tech Conference → Status: going
```
{
    user: ObjectId("123abc"),
    event: ObjectId("456def"),
    status: "going",
    createdAt: 2026-02-25
}
```

---

## **5. Routes - API Endpoints**

### **authRoutes.js**
```javascript
POST   /api/auth/register           → Register new user
POST   /api/auth/login              → Login user
POST   /api/auth/logout             → Logout user
GET    /api/auth/me                 → Get logged-in user info
GET    /api/auth/users              → Get all users (ADMIN only)
DELETE /api/auth/:id                → Delete user (ADMIN only)
PUT    /api/auth/:id/make-admin     → Make user admin (ADMIN only)
```

### **eventRoutes.js**
```javascript
GET    /api/events                  → Get all events
POST   /api/events                  → Create event (ADMIN only)
GET    /api/events/:id              → Get event by ID
PUT    /api/events/:id              → Update event (ADMIN only)
DELETE /api/events/:id              → Delete event (ADMIN only)
POST   /api/events/:id/send-reminder → Send reminder emails (ADMIN only)
```

### **rsvpRoutes.js**
```javascript
POST   /api/rsvp                    → RSVP to event (user logged in)
GET    /api/rsvp/my                 → Get my RSVPs (user logged in)
GET    /api/rsvp/event/:eventId     → Get RSVPs for event (public)
```

### **contactRoutes.js**
```javascript
POST   /api/contact                 → Submit contact form (public)
```

---

## **6. Controllers - Business Logic**

### **authController.js** - Authentication Logic

**registerUser()**
```javascript
// When user clicks Sign Up:
1. Get name, email, password from form
2. Check if email already exists in database
3. If exists → Error: "User already exists"
4. If not → Create user in database
5. Password automatically hashed (bcrypt)
6. Create session (mark user as logged in)
7. Send back user info to frontend
```

**loginUser()**
```javascript
// When user clicks Sign In:
1. Get email, password from form
2. Find user by email in database
3. Check if user found
4. Compare password with hashed password in database
5. If doesn't match → Error: "Invalid email or password"
6. If matches → Create session (mark as logged in)
7. Send back user info to frontend
```

**logoutUser()**
```javascript
// When user clicks Logout:
1. Destroy session
2. Clear login cookie
3. Send success message
```

**getMe()**
```javascript
// When frontend asks "Who is logged in?":
1. Check if session exists
2. If yes → Send back user info
3. If no → Error: "Not authorized"
```

**getUsers()** *(Admin only)*
```javascript
// When admin views Users tab:
1. Check if logged-in user is admin
2. If not → Error: "Not authorized"
3. If yes → Get all users from database
4. Send back full user list
```

**deleteUser()** *(Admin only)*
```javascript
// When admin clicks delete on user:
1. Check if logged-in user is admin
2. Get user ID from URL parameters
3. Find user in database
4. Delete user
5. Send success message
```

**makeUserAdmin()** *(Admin only)*
```javascript
// When admin makes someone admin:
1. Check if logged-in user is admin
2. Get user ID from URL parameters
3. Find user in database
4. Set isAdmin = true
5. Save user
6. Send back updated user
```

---

### **eventController.js** - Event Logic

**getEvents()**
```javascript
// When frontend loads explore page:
1. Get all events from database
2. Sort by date (earliest first)
3. Send back full list
```

**getEventById()**
```javascript
// When user clicks event:
1. Get event ID from URL
2. Find event in database
3. If found → Send event details
4. If not found → Error: "Event not found"
```

**createEvent()** *(Admin only)*
```javascript
// When admin creates new event:
1. Check if logged-in user is admin
2. Get form data (title, date, time, etc)
3. Create event in database
4. Set creator to logged-in admin's ID
5. Send back created event
```

**updateEvent()** *(Admin only)*
```javascript
// When admin edits event:
1. Check if logged-in user is admin
2. Get event ID and new data from request
3. Find event in database
4. Update only fields that were changed
5. Keep existing values for fields not changed
6. Save updated event
7. Send back updated event
```

**deleteEvent()** *(Admin only)*
```javascript
// When admin deletes event:
1. Check if logged-in user is admin
2. Get event ID
3. Find event in database
4. Delete event
5. Also delete all RSVPs for this event (cleanup)
6. Send success message
```

**sendEventReminders()** *(Admin only)*
```javascript
// When admin clicks "Send Reminder":
1. Check if logged-in user is admin
2. Get event ID
3. Find all RSVPs for this event where status = 'going' OR 'maybe'
4. For each RSVP:
   - Get user email
   - Send reminder email
   - Track if email sent successfully
5. Send back summary:
   - Total attended: 50
   - Successfully sent: 48
   - Failed: 2
```

---

### **rsvpController.js** - RSVP Logic

**rsvpToEvent()**
```javascript
// When user clicks "Going" / "Maybe" / "Not Going":
1. Check if user is logged in
2. Get event ID and status from form
3. Check if event exists
4. Look for existing RSVP by this user for this event
5. If RSVP exists:
   - Update status to new value
   - Save changes
6. If no RSVP exists:
   - Create new RSVP with this user, event, status
   - Save to database
7. Send back RSVP to frontend
```

**getMyRSVPs()**
```javascript
// When user clicks "My RSVPs":
1. Check if user is logged in
2. Find all RSVPs by this user
3. For each RSVP, also get the event details
4. Send back list of RSVPs with event info
```

**getEventRSVPs()**
```javascript
// When admin views attendees list:
1. Get event ID from URL
2. Find all RSVPs for this event
3. For each RSVP, get username and email
4. Send back list of attendees
```

---

### **contactController.js** - Contact Form Logic

**submitContact()**
```javascript
// When user submits contact form:
1. Get firstName, lastName, email, message
2. Validate:
   - All fields must be filled
   - Email must be valid format (has @, dot, etc)
   - Message must be at least 10 characters
3. If validation fails → Send error message, stop
4. If validation passes:
   - Call sendContactEmail()
   - Send email to admin with user's message
   - Send confirmation email to user
5. Send back success message
```

---

## **7. Middleware - Authentication Checks**

### **authMiddleware.js**

**protect()** - Check if user is logged in
```javascript
// Used on routes that need login (like /api/rsvp)

if (req.session && req.session.user) {
    // User is logged in!
    // Fetch fresh user from database
    // Add to req.user so controller can use it
    next(); // Continue to controller
} else {
    // User not logged in
    Error: "Not authorized, no session"
}
```

**admin()** - Check if user is admin
```javascript
// Used on routes only admin can access (like /api/events POST)

// Note: Must be used AFTER protect()
// So we already know user is logged in

if (req.user && req.user.isAdmin) {
    // User is admin!
    next(); // Continue to controller
} else {
    // User not admin
    Error: "Not authorized as an admin"
}
```

**Typical usage:**
```javascript
router.post('/events', protect, admin, createEvent);
//                       ↑      ↑
//              Check logged in  Check admin
```

---

## **8. seeder.js** - Database Seeding

**Location:** `server/seeder.js`

```javascript
// Creates default data for testing

const seedData = async () => {
    // 1. Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    
    // 2. Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@eventhub.com' });
    
    if (adminExists) {
        console.log('Admin user already exists');
    } else {
        // 3. Create admin user
        await User.create({
            name: 'Admin User',
            email: 'admin@eventhub.com',
            password: 'admin123',  // Auto-hashed by User model
            isAdmin: true
        });
        console.log('Admin created');
    }
    
    // 4. Exit process
    process.exit();
};
```

**How to run:**
```bash
node server/seeder.js
```

**What it does:**
- Creates admin account if it doesn't exist
- Email: admin@eventhub.com
- Password: admin123
- Doesn't delete existing users (preserves data)

---

# 🔄 HOW EVERYTHING WORKS TOGETHER

## **User Registration Flow**

```
1. USER CLICKS SIGN UP
   ↓
2. Frontend: RegisterPage.jsx
   - User fills: name, email, password
   ↓
3. Frontend: AuthContext.jsx
   - Calls register(name, email, password)
   - Sends POST to api.post('/auth/register')
   ↓
4. Backend: server/index.js
   - Express receives request at POST /api/auth/register
   ↓
5. Backend: authRoutes.js
   - Routes to registerUser() function
   ↓
6. Backend: authController.js - registerUser()
   - Checks if email exists
   - Creates user in MongoDB
   - Creates session
   - Sends back user info
   ↓
7. Frontend: AuthContext.jsx
   - Receives user data
   - Stores in state: setUser(data)
   ↓
8. Frontend: RegisterPage.jsx
   - Sees success
   - navigate('/') → Goes to home
   ↓
9. Home page shows: "Welcome John!"
```

---

## **RSVP Flow**

```
1. USER CLICKS "GOING" BUTTON
   ↓
2. Frontend: EventDetailsPage.jsx
   - handleRSVP('going')
   - Calls api.post('/rsvp', { eventId, status: 'going' })
   ↓
3. Backend: rsvpRoutes.js
   - Routes to rsvpToEvent() function
   ↓
4. Backend: authMiddleware.js - protect()
   - Checks: Is user logged in?
   - If no → Error
   - If yes → Continue
   ↓
5. Backend: rsvpController.js - rsvpToEvent()
   - Checks: Does event exist?
   - Checks: Does RSVP already exist?
   - If exists → Update status
   - If new → Create RSVP
   - Save to MongoDB
   ↓
6. Frontend: EventDetailsPage.jsx
   - Button turns green
   - Shows success message
   - setRsvpStatus('going')
   ↓
7. MyRSVPsPage shows this event in "Upcoming"
```

---

## **Admin Send Reminder Flow**

```
1. ADMIN CLICKS "SEND REMINDER" BUTTON
   ↓
2. Frontend: AdminPage.jsx
   - Calls api.post('/events/:id/send-reminder')
   ↓
3. Backend: eventRoutes.js
   - Routes to sendEventReminders() function
   ↓
4. Backend: authMiddleware.js
   - protect() → Check logged in
   - admin() → Check is admin
   ↓
5. Backend: eventController.js - sendEventReminders()
   - Get event details
   - Find all RSVP records for this event
   - Filter: only 'going' and 'maybe'
   - For each RSVP:
     - Get user's email
     - Call sendEventReminder()
   ↓
6. Backend: config/email.js - sendEventReminder()
   - Creates HTML email with event details
   - Sends via Gmail SMTP
   ↓
7. Email arrives in user's inbox:
   "Reminder: Tech Conference coming up on March 15!"
   ↓
8. Frontend: AdminPage.jsx
   - Shows summary: "Sent to 48 people"
```

---

# 🛡️ SECURITY FEATURES

## **1. Password Hashing**
- Raw passwords NEVER saved
- bcryptjs hashes with salt rounds = 10
- Even if database leaked, passwords safe

## **2. Session Management**
- User logs in → Session created
- Session stored in MongoDB
- Browser gets session cookie
- Every request includes cookie
- Server validates cookie

## **3. Admin Check**
- Routes like /api/events POST require:
  - protect() → User logged in
  - admin() → User.isAdmin === true

## **4. Data Validation**
- Contact form: Check email format
- Auth: Check password strength
- RSVP: Check event exists before saving

## **5. CORS**
- Only allow frontend URLs
- Prevents random websites from accessing API
- Configured in index.js

---

# 📊 DATABASE RELATIONSHIPS

```
User (1) ──────── (Many) Event
  |                          
  │ (creates)           
  │                    
  └─────────────────────┘

User (1) ──────── (Many) RSVP
                    |
                    | (references)
                    │
Event (1) ──────── (Many) RSVP
```

**Example:**
- User "John" creates Event "Cricket Match"
- User "John" RSVPs "Going" to Event "Cricket Match"
- User "Jane" RSVPs "Maybe" to Event "Cricket Match"

---

This guide explains EVERY file in the project in simple terms!

Feel free to ask about any specific file or feature! 🎉
