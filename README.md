# THINK AI 3.0 - Cybersecurity Innovation Platform

A next-generation cybersecurity platform built with Node.js, TypeScript, React, and MongoDB. This full-stack application provides AI-powered threat detection, real-time monitoring, and comprehensive security analytics.

## 🚀 Features

### Core Functionality
- **AI-Powered Threat Detection**: Machine learning algorithms for identifying and neutralizing threats
- **Real-time Monitoring**: 24/7 surveillance with instant alerts and automated responses
- **Decentralized Architecture**: Distributed network design eliminating single points of failure
- **Advanced Analytics**: Comprehensive insights with detailed reports and predictive analytics
- **User Management**: Role-based access control with admin, analyst, and user roles
- **Threat Management**: Complete lifecycle management of security threats
- **Contact System**: Integrated communication and support system

### Technical Features
- **Modern Tech Stack**: Node.js, Express, TypeScript, React, MongoDB
- **Responsive Design**: Mobile-first approach with beautiful UI/UX
- **Real-time Updates**: WebSocket integration for live data
- **Security**: JWT authentication, bcrypt password hashing, rate limiting
- **API Documentation**: Swagger/OpenAPI integration
- **Error Handling**: Comprehensive error handling and logging
- **Performance**: Optimized queries, caching, and compression

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety and better development experience
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Rate Limit** - API rate limiting
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Nodemailer** - Email functionality

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Yup** - Form validation
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Hot Toast** - Notifications

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/think-ai-3
   JWT_SECRET=your_super_secret_jwt_key_here
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@thinkai3.com
   ```

3. **Start the server**
   ```bash
   npm run server
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Full Application

To run both backend and frontend simultaneously:

```bash
npm run dev
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd think-ai-3-cybersecurity
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
think-ai-3-cybersecurity/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── styles/        # Global styles
│   │   └── App.tsx        # Main app component
│   ├── package.json
│   └── tsconfig.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── index.js         # Server entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Threats
- `GET /api/threats` - Get all threats (with filtering)
- `GET /api/threats/:id` - Get threat by ID
- `POST /api/threats` - Create new threat
- `PUT /api/threats/:id` - Update threat
- `DELETE /api/threats/:id` - Delete threat
- `GET /api/threats/stats/overview` - Get threat statistics

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/threats/timeline` - Threat timeline
- `GET /api/analytics/geographic` - Geographic data
- `GET /api/analytics/performance` - Performance metrics

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Contact
- `POST /api/contact` - Send contact message
- `GET /api/contact` - Get contact messages (Admin only)
- `PUT /api/contact/:id` - Update contact status
- `DELETE /api/contact/:id` - Delete contact message

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Secure error handling without information leakage

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with cyber theme
- **Responsive Layout**: Mobile-first responsive design
- **Dark/Light Theme**: Theme switching capability
- **Animations**: Smooth animations with Framer Motion
- **Interactive Components**: Hover effects and transitions
- **Accessibility**: WCAG compliant accessibility features

## 📊 Database Schema

### User Model
- Personal information (name, email, company, phone)
- Authentication (password, role, isActive)
- Preferences (theme, notifications, dashboard widgets)
- Security settings (2FA, API keys, login attempts)

### Threat Model
- Threat details (title, description, severity, type)
- Detection info (source, IP, location, detectedBy)
- Status tracking (status, resolution, timeline)
- Additional data (tags, indicators, attachments)

### Contact Model
- Contact information (name, email, company, phone)
- Message details (subject, message, category)
- Status tracking (status, priority, assignedTo)
- Follow-up management (scheduledAt, completed)

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set:
- `NODE_ENV` - Environment (production/development)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `EMAIL_USER` - Email service username
- `EMAIL_PASS` - Email service password

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
npm start
```

### Docker Deployment
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN cd client && npm install && npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@thinkai3.com or create an issue in the repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- Node.js community for excellent packages
- MongoDB for the flexible database
- All open-source contributors

---

**THINK AI 3.0** - Securing the future with artificial intelligence.