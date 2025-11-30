# Ride Pool - Campus Transportation Solution

Ride Pool is a modern web application that connects students traveling on similar routes to share cab rides, reducing costs and environmental impact.

## 🚀 Project Structure

```
cabGroups/
├── backend/           # Node.js + TypeScript backend
│   ├── src/           # Source code
│   │   ├── config/    # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/ # Custom middleware
│   │   ├── models/    # MongoDB models
│   │   ├── routes/    # API routes
│   │   ├── utils/     # Utility functions
│   │   └── server.ts  # Main server file
│   ├── package.json   # Backend dependencies
│   └── tsconfig.json  # TypeScript configuration
├── frontend/          # React + TypeScript frontend
│   ├── src/           # Source code
│   │   ├── components/ # React components
│   │   ├── pages/     # Page components
│   │   ├── contexts/  # React contexts
│   │   ├── services/  # API services
│   │   ├── styles/    # CSS styles
│   │   ├── App.tsx    # Main App component
│   │   └── main.tsx   # Entry point
│   ├── package.json   # Frontend dependencies
│   └── vite.config.ts # Vite configuration
└── README.md          # This file
```

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS v4
- Vite build tool
- React Router for navigation
- Axios for HTTP requests

### Backend
- Node.js with TypeScript
- Express.js framework
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT for authentication

### External Services
- Geoapify for maps and geocoding
- MongoDB Atlas for database hosting

## 🎨 Features

- Dark theme with animations and modern UI
- User authentication (login/register)
- Pool matching algorithm
- Real-time group chat
- Location tracking
- Fare calculator
- Responsive design for all devices

## 🚀 Deployment

### Backend (Render)
1. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=production
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
2. Deploy using Render's GitHub integration

### Frontend (Vercel)
1. Update API URLs to use your Render backend URL
2. Deploy using Vercel's GitHub integration

## 🏁 Getting Started Locally

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `.env` files in both backend and frontend directories with required variables.

## 📁 Git Strategy

This repository contains both frontend and backend in a single repository with proper `.gitignore` files for each:
- Root `.gitignore` for general files
- `backend/.gitignore` for backend-specific files
- `frontend/.gitignore` for frontend-specific files

## 🔐 Security

- All sensitive data should be stored in environment variables
- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Regularly update dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🆘 Support

For issues and questions, please contact the development team.