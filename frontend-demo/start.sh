#!/bin/bash

echo ""
echo "========================================"
echo "  THINK AI 3.0 Frontend Demo Server"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo ""
    echo "Please install Node.js from https://nodejs.org/"
    echo "Then run this script again."
    echo ""
    exit 1
fi

echo "✅ Node.js found"
echo ""

# Make sure we're in the right directory
cd "$(dirname "$0")"

# Start the server
echo "🚀 Starting server on port 4050..."
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

node server.js
