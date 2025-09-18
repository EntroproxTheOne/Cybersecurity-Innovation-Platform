const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 4050;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Default to index.html for root path
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Remove leading slash and resolve file path
    const filePath = path.join(__dirname, pathname);
    
    // Security check - prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - Page Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { color: #e74c3c; }
                        a { color: #3498db; text-decoration: none; }
                    </style>
                </head>
                <body>
                    <h1>404 - Page Not Found</h1>
                    <p>The requested page could not be found.</p>
                    <a href="/">← Back to Home</a>
                </body>
                </html>
            `);
            return;
        }
        
        // Read file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            
            // Get file extension
            const ext = path.extname(filePath).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            
            // Set headers
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            
            // Send file content
            res.end(data);
        });
    });
});

// Start server
server.listen(PORT, () => {
    console.log('🚀 THINK AI 3.0 Frontend Demo Server');
    console.log('=====================================');
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log('=====================================');
    console.log('📄 Available pages:');
    console.log(`   • Home: http://localhost:${PORT}/`);
    console.log(`   • Login: http://localhost:${PORT}/login.html`);
    console.log(`   • Register: http://localhost:${PORT}/register.html`);
    console.log(`   • Dashboard: http://localhost:${PORT}/dashboard.html`);
    console.log(`   • Threats: http://localhost:${PORT}/threats.html`);
    console.log(`   • Analytics: http://localhost:${PORT}/analytics.html`);
    console.log(`   • Users: http://localhost:${PORT}/users.html`);
    console.log(`   • Bug Reports: http://localhost:${PORT}/bug-reports.html`);
    console.log(`   • Settings: http://localhost:${PORT}/settings.html`);
    console.log('=====================================');
    console.log('🔑 Demo Credentials:');
    console.log('   Email: admin@thinkai3.com');
    console.log('   Password: admin123');
    console.log('=====================================');
    console.log('Press Ctrl+C to stop the server');
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please try a different port.`);
        console.log('💡 You can change the port by modifying the PORT variable in server.js');
    } else {
        console.error('❌ Server error:', err);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});
