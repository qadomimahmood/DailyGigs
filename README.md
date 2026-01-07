# Daily Gigs 💼

A React Native / Expo application that connects **Requesters** (job providers) with **Workers** seeking short-term gig opportunities. Built for web with Expo.

## ✨ Features

### For Requesters (Job Providers)
- **Create Gigs** - Post job opportunities with title, description, pay, location, date, and contact info
- **Manage Applications** - View and accept worker applications for your gigs
- **Assign Workers** - Choose and assign the right worker for your gig
- **Real-time Chat** - Communicate instantly with assigned workers via WebSocket
- **Complete & Rate** - Mark jobs as completed and rate workers with a 5-star system

### For Workers
- **Browse Gigs** - View available gig opportunities
- **Apply to Gigs** - Submit applications to jobs you're interested in
- **Track Applications** - See the status of your applications (pending/accepted/rejected)
- **Real-time Chat** - Chat with requesters after being hired
- **View Ratings** - See your received ratings and overall rating score

### Core Features
- 🔐 **User Authentication** - Simple role-based login (Requester/Worker)
- 💬 **Real-time Messaging** - WebSocket-powered instant chat using Socket.io
- ⭐ **5-Star Rating System** - Rate workers after job completion
- 💾 **Persistent Storage** - Data saved locally using AsyncStorage
- 📱 **Cross-platform** - Works on Web, iOS, and Android (via Expo)

## 🛠️ Tech Stack

- **Frontend**: React Native + Expo
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Real-time Communication**: Socket.io
- **Storage**: AsyncStorage
- **Styling**: React Native StyleSheet

## 📁 Project Structure

```
daily-gigs/
├── App.js                     # Main app entry with navigation
├── src/
│   ├── components/
│   │   ├── AppButton.js       # Reusable button component
│   │   ├── GigListItem.js     # Gig card component
│   │   ├── Input.js           # Styled text input
│   │   ├── ScreenWrapper.js   # Screen container wrapper
│   │   └── StarRating.js      # 5-star rating component
│   ├── constants/
│   │   └── colors.js          # App color palette
│   ├── context/
│   │   └── AppContext.js      # Global state management
│   └── screens/
│       ├── LoginScreen.js           # Role selection & login
│       ├── RequesterHomeScreen.js   # Requester dashboard
│       ├── RequesterCreateScreen.js # Create new gig
│       ├── RequesterManageGigScreen.js # Manage gig & rate workers
│       ├── WorkerHomeScreen.js      # Worker dashboard
│       ├── GigDetailsScreen.js      # Gig details & apply
│       └── ChatScreen.js            # Real-time chat
└── server/
    └── index.js               # Socket.io server for real-time chat
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd daily-gigs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Socket.io server** (for real-time chat)
   ```bash
   cd server
   node index.js
   ```
   The server will run on `http://localhost:3000`

4. **Start the Expo app** (in a new terminal)
   ```bash
   npm start -- --web
   ```
   The app will open at `http://localhost:8081`

## 📖 Usage Guide

### As a Requester:
1. Login and select "Requester" role
2. Create a gig from the home screen
3. Wait for workers to apply
4. Accept a worker's application
5. Chat with the worker if needed
6. Mark the job as completed
7. Rate the worker (1-5 stars)

### As a Worker:
1. Login and select "Worker" role
2. Browse available gigs
3. Apply to gigs you're interested in
4. Check your application status
5. If accepted, chat with the requester
6. View your ratings after job completion

## ⚙️ Configuration

### Socket Server URL
The WebSocket server URL is configured in `src/context/AppContext.js`:
```javascript
const SOCKET_URL = 'http://localhost:3000';
```

Update this if deploying to a different server.

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#2563eb` | Buttons, links, accents |
| Success | `#16a34a` | Payments, confirmations |
| Danger | `#dc2626` | Errors, warnings |
| Text | `#111827` | Primary text |
| Text Secondary | `#6b7280` | Labels, hints |
| Background | `#ffffff` | Screen backgrounds |
| Border | `#e5e7eb` | Borders, dividers |

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using React Native & Expo
