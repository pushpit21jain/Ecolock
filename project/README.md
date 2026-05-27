# EchoLock - Voice Biometric Authentication System

A modern, secure voice biometric authentication system built with React, TypeScript, and Node.js.

## 🚀 Features
      
- **Real Voice Processing**: Actual microphone recording and audio analysis
- **Secure Backend API**: JWT authentication, rate limiting, and data validation
- **Voice Profile Management**: Create, manage, and authenticate with voice profiles 
- **Real-time Analytics**: Live voice visualization and authentication metrics
- **Database Integration**: SQLite database with user management and audit logs
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## 🛠️ Tech Stack
 
### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons
- Framer Motion for animations
- Web Audio API for voice recording

### Backend
- Node.js with Express
- SQLite database
- JWT authentication
- Multer for file uploads
- bcryptjs for password hashing
- Express validator for input validation

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern browser with microphone access

## 🚀 Quick Start

### 1. Clone and Setup 

```bash
# Navigate to the project directory
cd project

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Configuration

Create environment files:

**Frontend** (optional - uses defaults):
```bash
# Create .env file in project root
VITE_API_URL=http://localhost:3001/api
```

**Backend**:
```bash
# Copy example env file
cp backend/env.example backend/.env

# Edit backend/.env with your settings
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
```

### 3. Start the Backend

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3001`

### 4. Start the Frontend

```bash
# In a new terminal, from project root
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📖 Usage Guide

### 1. User Registration
1. Navigate to the Register tab
2. Enter your email, password, and name
3. Click "Register" to create your account

### 2. Voice Profile Creation
1. Go to the Register tab (after login)
2. Record 3 different phrases as prompted
3. Provide a name for your voice profile
4. Submit to create your voice biometric profile

### 3. Voice Authentication
1. Go to the Authenticate tab
2. Select your voice profile
3. Record the same phrase you used during registration
4. View real-time authentication results

### 4. Dashboard & Analytics
- View authentication statistics
- Monitor system health
- Manage API keys
- Review authentication logs

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Voice Processing
- `POST /api/voice/register` - Register voice profile
- `POST /api/voice/authenticate` - Authenticate with voice
- `GET /api/voice/profiles` - Get user's voice profiles
- `DELETE /api/voice/profiles/:id` - Delete voice profile

### User Management
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/logs` - Get authentication logs
- `PATCH /api/users/profile` - Update user profile
- `POST /api/users/api-keys` - Generate API key

## 🗄️ Database Schema
              /
### Users Table
- `id` - Unique user identifier
- `email` - User email (unique)
- `password_hash` - Hashed password
- `name` - User's full name
- `created_at` - Account creation timestamp
- `last_login` - Last login timestamp

### Voice Profiles Table
- `id` - Profile identifier
- `user_id` - Associated user
- `profile_name` - Profile name
- `voice_data` - JSON with voice analysis data
- `liveness_threshold` - Liveness detection threshold
- `confidence_threshold` - Voice match threshold

### Authentication Logs Table
- `id` - Log identifier
- `user_id` - Associated user
- `profile_id` - Voice profile used
- `auth_type` - Authentication method
- `status` - Success/failure status
- `confidence_score` - Voice match confidence
- `liveness_score` - Liveness detection score

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: API request throttling
- **Input Validation**: Express validator for all inputs
- **CORS Protection**: Configured for frontend domain
- **File Upload Security**: Audio file validation and size limits

## 🎯 Development

### Project Structure
```
project/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── backend/               # Backend source
│   ├── routes/            # API routes
│   ├── database/          # Database setup
│   └── uploads/           # Voice file storage
└── README.md
```

### Adding New Features

1. **Backend API**: Add routes in `backend/routes/`
2. **Frontend Components**: Create components in `src/components/`
3. **API Integration**: Update `src/services/api.ts`
4. **Database Changes**: Modify `backend/database/init.js`

### Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (when implemented)
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Set up reverse proxy (nginx)
4. Configure SSL certificates

### Frontend Deployment
1. Build for production: `npm run build`
2. Deploy to CDN or static hosting
3. Update API URL in environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details

## 🔮 Roadmap

- [ ] Advanced voice biometric algorithms
- [ ] Multi-language voice recognition
- [ ] Mobile app development
- [ ] Enterprise SSO integration
- [ ] Real-time voice analysis
- [ ] Advanced security features
- [ ] Performance optimization
- [ ] Comprehensive testing suite 
