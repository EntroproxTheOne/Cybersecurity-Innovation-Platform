# THINK AI 3.0 Frontend Demo Server

A simple HTTP server to run the THINK AI 3.0 frontend demo on port 4050.

## 🚀 Quick Start

### Option 1: Using the Start Scripts

**Windows:**
```bash
# Double-click start.bat or run in Command Prompt
start.bat
```

**Linux/WSL:**
```bash
# Make executable and run
chmod +x start.sh
./start.sh
```

### Option 2: Using Node.js Directly

```bash
# Navigate to frontend-demo directory
cd frontend-demo

# Start the server
node server.js
```

### Option 3: Using npm

```bash
# Navigate to frontend-demo directory
cd frontend-demo

# Start the server
npm start
```

## 🌐 Access the Demo

Once the server is running, open your browser and go to:

- **Home Page**: http://localhost:4050/
- **Login Page**: http://localhost:4050/login.html
- **Register Page**: http://localhost:4050/register.html
- **Dashboard**: http://localhost:4050/dashboard.html
- **Threats Page**: http://localhost:4050/threats.html

## 🔑 Demo Credentials

- **Email**: admin@thinkai3.com
- **Password**: admin123

## 📁 File Structure

```
frontend-demo/
├── server.js          # HTTP server
├── package.json       # Node.js package configuration
├── start.bat          # Windows start script
├── start.sh           # Linux/WSL start script
├── index.html         # Home page
├── login.html         # Login page
├── register.html      # Registration page
├── dashboard.html     # Main dashboard
├── threats.html       # Threat management
├── styles.css         # Main stylesheet
├── script.js          # JavaScript functionality
└── README-SERVER.md   # This file
```

## 🛠️ Server Features

- **Port 4050**: Runs on a custom port to avoid conflicts
- **Static File Serving**: Serves HTML, CSS, JS, and other assets
- **MIME Type Support**: Proper content types for all file extensions
- **Security**: Prevents directory traversal attacks
- **Error Handling**: Custom 404 and 500 error pages
- **CORS Headers**: Allows cross-origin requests
- **No Cache**: Disables caching for development

## 🔧 Customization

### Change Port
Edit the `PORT` variable in `server.js`:
```javascript
const PORT = 4050; // Change to your desired port
```

### Add New Routes
Add new route handling in `server.js`:
```javascript
// Add before the file serving logic
if (pathname === '/custom-route') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Custom Route</h1>');
    return;
}
```

## 🐛 Troubleshooting

### Port Already in Use
If port 4050 is already in use:
1. Change the port in `server.js`
2. Or stop the process using port 4050:
   ```bash
   # Windows
   netstat -ano | findstr :4050
   taskkill /PID <PID> /F
   
   # Linux/WSL
   lsof -ti:4050 | xargs kill -9
   ```

### Node.js Not Found
If you get "Node.js not found" error:
1. Install Node.js from https://nodejs.org/
2. Make sure Node.js is in your PATH
3. Restart your terminal/command prompt

### Permission Denied (Linux/WSL)
```bash
chmod +x start.sh
```

## 📊 Server Logs

The server provides detailed logging:
- Server startup information
- Available pages and URLs
- Demo credentials
- Error messages
- Request handling

## 🚀 Production Deployment

For production deployment, consider:
- Using a proper web server (nginx, Apache)
- Adding HTTPS support
- Implementing proper caching
- Adding security headers
- Using a process manager (PM2)

## 🔒 Security Notes

This is a development server and should not be used in production:
- No authentication
- No rate limiting
- No security headers
- File serving without restrictions

## 📝 License

This server is part of the THINK AI 3.0 project and follows the same MIT license.

---

**THINK AI 3.0 Frontend Demo Server** - Simple, fast, and reliable.
