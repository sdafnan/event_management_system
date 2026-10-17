# EventSphere — Event Management & Discovery System

**Course:** Web Programming (Assignment 2)  
**Instructor:** Mahhek Tahir  
**Student:** Raja Omar  
**Architecture:** React.js, Redux Toolkit, React Router, Ticketmaster Discovery API  

---

## 🌟 Project Overview

**EventSphere** is an event management and live experience discovery platform developed with **React.js**, **Redux Toolkit**, and **React Router**, powered by the **Ticketmaster Discovery API v2**. 

The system enables users to explore global events (concerts, sports tournaments, Broadway musicals, indie film festivals, conferences), view rich venue and pricing specifications, register for events with duplicate-prevention safeguards, and manage attendance via a dedicated dashboard complete with downloadable/printable digital QR event passes.

---

## 🎯 Key Assignment Requirements & Implementation

### 1. User Authentication Simulation
- **Registration, Login, and Logout**: Complete user registration with name, email, password, and password confirmation.
- **Form Validation**: Real-time validation checks for email syntax, password minimum length (6+ chars), password matching, and mandatory fields.
- **Redux State Management**: Managed via `authSlice` using Redux Toolkit `createSlice`.
- **Session Persistence**: User sessions and registered accounts persist across browser refreshes via `localStorage` (`eventsphere_registered_users` and `eventsphere_session_user`).
- **Quick Demo Account**: Pre-seeded demo account (`alex@example.com` / `password123`) with a one-click auto-fill button on the Login page for instant instructor evaluation.

### 2. Event Exploration & Discovery
- **Ticketmaster Discovery API Integration**: Fetches real-time event listings directly from `https://app.ticketmaster.com/discovery/v2/events.json`.
- **Search**: Interactive search bar with debounced keyword querying across event titles, artists, venues, and descriptions.
- **Category Filter**: Category pills for `Music`, `Sports`, `Arts & Theatre`, `Film`, and `All`.
- **Location & City Filter**: Instant filtering by major metropolitan hubs (`New York`, `Los Angeles`, `London`, `Chicago`, `Las Vegas`, `Toronto`, `Austin`).
- **Sorting**: Multi-option sorting by Date (Soonest first), Date (Furthest first), and Name (A–Z).
- **Pagination**: Responsive pagination controls navigating through pages of results.
- **Zero-Failure Fallback System**: If no API key is provided or if Ticketmaster API quota is exceeded, the application automatically activates **Demo Mode** with a rich 12-event dataset matching the official Ticketmaster schema, ensuring 100% uptime and smooth grading.

### 3. Detailed Event Specifications
- **Metadata**: High-resolution imagery, date, start time, timezone, countdown badge ("In X Days").
- **Venue & Location**: Venue name, street address, city, state, postal code, and direct Google Maps directions link.
- **Classification Badges**: Segment, genre, and sub-genre tags.
- **Pricing & Status**: Ticket price ranges (minimum to maximum with currency codes), sales window, and availability status (`onsale`, etc.).
- **Official Ticketing Link**: Direct link to the event's primary ticketing page on Ticketmaster.com.
- **Health & Safety / Please Note**: Formatted callouts for promoter advisories and bag policies.

### 4. Event Registration & Digital Ticketing
- **Protected Action**: Unauthenticated users clicking "Register" are routed to the Login page and returned automatically to the event after authenticating.
- **Duplicate Prevention**: Redux state checks verify if the logged-in user is already registered for the event, prohibiting duplicate submissions.
- **Custom Attendee Configuration**: Collects attendee name, delivery email, ticket quantity (1 to 10), ticket tier (`Standard Admission`, `VIP Experience & Fast Track`, `Early Bird Pass`), and special requests/notes.
- **Instant Digital Pass**: Registration triggers a celebratory toast notification and generates a digital **Event Pass** modal featuring a unique confirmation code (`ES-XXXXXX`), attendee details, ticket tier, barcode, and scannable QR code graphic.
- **Print & Save**: One-click "Print / Save PDF" feature formatted with dedicated CSS print stylesheets.

### 5. My Events Management Dashboard
- **Protected View**: Route `/my-events` guarded by `ProtectedRoute`.
- **Attendance Metrics**: Overview badges for Total Registrations, Upcoming Events, Completed Shows, and Cancelled Registrations.
- **Temporal Separation**: Dynamically separates events into **Upcoming** vs **Completed/Past** by comparing event dates against the current system date.
- **Registration Actions**:
  - Open Digital QR Ticket Pass anytime.
  - Cancel registration with confirmation dialog.
  - View full event details page.

### 6. Redux Toolkit Architecture
The Redux state is configured with `configureStore` in `src/redux/store.js` and structured cleanly into four modular slices:
- `authSlice.js`: Manages user credentials, active session, authentication status, and profile updates.
- `eventsSlice.js`: Contains `fetchEvents` and `fetchEventById` async thunks, active filters (keyword, category, city, sort), pagination, and API key settings.
- `registrationsSlice.js`: Manages user-specific event registrations, duplicate validation, cancellation, and digital pass modal payload.
- `uiSlice.js`: Manages toast notifications and global modal visibilities.

---

## 🛠️ Project Structure

```
web_a2/
├── .env.example              # Sample environment variable template
├── .gitignore                # Git ignore rules (includes .env, dist, node_modules)
├── index.html                # HTML entry point with Google Fonts
├── package.json              # Project dependencies and npm scripts
├── vite.config.js            # Vite build configuration
├── guides/                   # Assignment prompt & guidelines
│   └── Web_Programming_Assignment_2_Event_Management_System.pdf
└── src/
    ├── App.css               # Responsive breakpoints, print styles, animations
    ├── App.jsx               # Root component with routing and modal containers
    ├── index.css             # Cyber-luxe design system, tokens, and utilities
    ├── main.jsx              # Mount point with Redux Provider & BrowserRouter
    ├── components/
    │   ├── ApiKeyModal.jsx         # Live API key settings dialog
    │   ├── DigitalPassModal.jsx    # QR digital pass modal
    │   ├── EventCard.jsx           # Reusable event card with badges
    │   ├── Footer.jsx              # Polished footer with course info
    │   ├── Navbar.jsx              # Sticky navbar with auth dropdown & status pill
    │   ├── ProtectedRoute.jsx      # Navigation guard for private views
    │   ├── RegistrationModal.jsx   # Event registration dialog with validation
    │   └── ToastContainer.jsx      # Animated toast notifications container
    ├── pages/
    │   ├── EventDetails.jsx        # Detailed event specs & directions
    │   ├── Events.jsx              # Main event exploration & search
    │   ├── Login.jsx               # Sign in page with demo auto-fill
    │   ├── MyEvents.jsx            # Registrations dashboard (Upcoming vs Past)
    │   ├── NotFound.jsx            # 404 page
    │   ├── Profile.jsx             # User profile and session overview
    │   └── Register.jsx            # Registration page with validation
    ├── redux/
    │   ├── store.js                # Central Redux store configured via configureStore
    │   └── slices/
    │       ├── authSlice.js        # Auth state, session persistence
    │       ├── eventsSlice.js      # Async thunks, search, filter, pagination
    │       ├── registrationsSlice.js # Registrations, duplicate checks, cancellation
    │       └── uiSlice.js          # Toasts, active modal states
    └── services/
        └── ticketmasterApi.js      # Ticketmaster API client & high-fidelity mock dataset
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0 or later (tested on v22)
- **npm**: v9.0 or later (tested on v10)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/event-management-system.git
cd event-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
The project works out of the box in **Demo Mode** with curated events. To connect to the live Ticketmaster Discovery API:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Obtain a free Consumer API Key from the [Ticketmaster Developer Portal](https://developer.ticketmaster.com/).
3. Add your key to `.env`:
   ```env
   VITE_TICKETMASTER_API_KEY=your_actual_ticketmaster_api_key
   ```
*(Alternatively, you can click the **Demo Mode / Live API** pill in the top navigation bar at any time to paste your key directly into the application!)*

### 4. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Production Build
```bash
npm run build
npm run preview
```

### 6. Run Tests
```bash
npm test
```
The tests cover mock-event fallback behavior and event registration state, including duplicate prevention.

---

## 🔑 Demo Account Credentials

For quick testing without creating a new user, you can use the pre-seeded account:
- **Email:** `alex@example.com`
- **Password:** `password123`
- *(Or simply click the **"Fill Demo Account"** button on the Login page!)*

---

## 📜 Version Control History

The project follows a structured, incremental commit history reflecting feature milestones:
1. `Initial React project setup`
2. `Add authentication pages and implement Redux authentication`
3. `Add Ticketmaster API integration and event listing`
4. `Add event details view and venue routing`
5. `Add event registration with Redux state and digital ticket pass`
6. `Add My Events dashboard with upcoming and completed tabs`
7. `Add protected routes, user profile, and app navigation`
8. `Polish responsive UI, animations, and documentation`

---

## 📄 License & Academic Integrity
Developed as part of the Web Programming course curriculum at university under the instruction of Mahhek Tahir. All event data and trademarks belong to Ticketmaster and their respective organizers.
