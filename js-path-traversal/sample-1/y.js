const fs = require('fs');
const path = require('path');
const express = require('express');

/**
 * Safely reads a file after checking for path traversal attempts
 * @param {string} filePath - The path to the file to read
 * @returns {string} The file contents
 * @throws {Error} If path traversal is detected or file cannot be read
 */
function safeRead(filePath) {
    // Check for path traversal attempts
    if (filePath.includes('../') || filePath.includes('..\\')) {
        throw new Error('Path traversal detected');
    }
    
    return fs.readFileSync(filePath, 'utf8');
}

/**
 * Reads a file using path.join with current directory
 * @param {string} userId - The user ID to construct the path
 * @returns {string} The file contents
 */
function function1(userId) {
    const filePath = path.join(__dirname, userId);
    return safeRead(filePath);
}

/**
 * Reads a file using path.resolve with current directory
 * @param {string} userId - The user ID to construct the path
 * @returns {string} The file contents
 */
function function2(userId) {
    const filePath = path.resolve(__dirname, userId);
    return safeRead(filePath);
}

// Create Express app
const app = express();
const port = 5692;

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Endpoint for function1
app.get('/read1/:userId', (req, res) => {
    try {
        const result = function1(req.params.userId);
        res.send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint for function2
app.get('/read2/:userId', (req, res) => {
    try {
        const result = function2(req.params.userId);
        res.send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start the server
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}).on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});

// Keep the process alive
const keepAlive = setInterval(() => {
    console.log('Server is running...');
}, 30000);

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    clearInterval(keepAlive);
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\nShutting down server...');
    clearInterval(keepAlive);
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    clearInterval(keepAlive);
    server.close(() => {
        process.exit(1);
    });
});

module.exports = {
    function1,
    function2
};

// console.log(function1("../README.md"))
// console.log(function2("../README.md"))

// cd into the directory and run `node y.js`
// then `curl http://localhost:5692/read1/..%2FREADME.md`
