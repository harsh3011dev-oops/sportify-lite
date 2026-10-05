const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const NodeCache = require('node-cache');
const { spawn } = require('child_process');

const app = express();
app.use(cors());

// Initialize SQLite Database
const dbPath = path.join(__dirname, '../data/inventory.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error("Could not connect to database.", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

// Initialize Cache (expires in 2.5 hours = 9000 seconds)
const urlCache = new NodeCache({ stdTTL: 9000, checkperiod: 600 });

// Serve the Flutter Web App
app.use(express.static('/home/piet/sportify-tools/sportify_flutter/build/web'));

// API to get tracks with SQLite FTS
app.get('/api/tracks', (req, res) => {
    const query = req.query.q ? req.query.q.trim() : '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    if (query) {
        // Using FTS5 match
        const sql = `
            SELECT t.* FROM tracks t
            JOIN tracks_fts f ON t.rowid = f.rowid
            WHERE tracks_fts MATCH ?
            ORDER BY rank
            LIMIT ? OFFSET ?
        `;
        const ftsQuery = query.split(/\s+/).map(word => `"${word}"*`).join(' AND ');
        
        db.all(sql, [ftsQuery, limit, offset], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database query failed' });
            }
            res.json({ data: rows, page, limit });
        });
    } else {
        // Fallback if no query
        const sql = 'SELECT * FROM tracks LIMIT ? OFFSET ?';
        db.all(sql, [limit, offset], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database query failed' });
            }
            res.json({ data: rows, page, limit });
        });
    }
});

// Helper function to extract direct URL via yt-dlp
function getDirectUrl(target) {
    return new Promise((resolve, reject) => {
        // -g gets the URL without downloading
        const ytDlp = spawn('yt-dlp', ['-f', 'bestaudio[ext=m4a]/bestaudio', '-g', target]);
        let output = '';
        ytDlp.stdout.on('data', (data) => {
            output += data.toString();
        });
        ytDlp.on('close', (code) => {
            if (code === 0 && output.trim()) {
                resolve(output.trim());
            } else {
                reject(new Error('Failed to extract URL'));
            }
        });
    });
}

// Zero-Load Redirect API
app.get('/api/play/:id', async (req, res) => {
    const queryOrId = req.params.id;
    const isVideoId = queryOrId.length === 11 && !queryOrId.includes(' ');
    const target = isVideoId ? `https://www.youtube.com/watch?v=${queryOrId}` : `ytsearch1:${queryOrId}`;
    
    // Check Cache
    const cachedUrl = urlCache.get(target);
    if (cachedUrl) {
        console.log(`[CACHE HIT] Redirecting to cached URL for: ${target}`);
        return res.redirect(cachedUrl);
    }
    
    // If not in cache, extract it
    console.log(`[CACHE MISS] Extracting new URL for: ${target}`);
    try {
        const directUrl = await getDirectUrl(target);
        urlCache.set(target, directUrl);
        console.log(`[CACHE SET] Extracted successfully.`);
        return res.redirect(directUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to extract stream URL');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend API Server running on http://localhost:${PORT}`);
});
