/**
 * Strix API - REST API Server
 * REST API for Security Recon in 60 seconds
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// In-memory storage (replace with database in production)
const scans = new Map();

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Start a new scan
app.post('/api/scans', async (req, res) => {
    const { target, options = {} } = req.body;
    
    if (!target) {
        return res.status(400).json({ error: 'Target is required' });
    }
    
    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const scan = {
        id: scanId,
        target,
        options,
        status: 'running',
        progress: 0,
        results: null,
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    scans.set(scanId, scan);
    
    // Run scan in background (would integrate with strix-core in production)
    runScan(scanId, target, options);
    
    res.status(201).json(scan);
});

// Get scan status
app.get('/api/scans/:id', (req, res) => {
    const scan = scans.get(req.params.id);
    
    if (!scan) {
        return res.status(404).json({ error: 'Scan not found' });
    }
    
    res.json(scan);
});

// List all scans
app.get('/api/scans', (req, res) => {
    const scanList = Array.from(scans.values()).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(scanList);
});

// Delete scan
app.delete('/api/scans/:id', (req, res) => {
    if (!scans.has(req.params.id)) {
        return res.status(404).json({ error: 'Scan not found' });
    }
    
    scans.delete(req.params.id);
    res.status(204).send();
});

// Get scan results (PDF)
app.get('/api/scans/:id/report', (req, res) => {
    const scan = scans.get(req.params.id);
    
    if (!scan) {
        return res.status(404).json({ error: 'Scan not found' });
    }
    
    if (scan.status !== 'completed') {
        return res.status(400).json({ error: 'Scan not completed yet' });
    }
    
    // In production, would return actual PDF
    res.json({ 
        message: 'PDF report available',
        scanId: scan.id,
        results: scan.results 
    });
});

// Simulated scan function
function runScan(scanId, target, options) {
    const scan = scans.get(scanId);
    
    // Simulate scan progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        
        if (progress <= 100) {
            scan.progress = progress;
            
            if (progress === 100) {
                scan.status = 'completed';
                scan.completedAt = new Date().toISOString();
                scan.results = {
                    summary: {
                        riskScore: Math.floor(Math.random() * 100),
                        riskLevel: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)],
                        target,
                        scanDuration: `${(Math.random() * 60).toFixed(2)}s`
                    },
                    vulnerabilities: {
                        critical: Math.floor(Math.random() * 3),
                        high: Math.floor(Math.random() * 5),
                        medium: Math.floor(Math.random() * 10),
                        low: Math.floor(Math.random() * 15)
                    },
                    openPorts: Math.floor(Math.random() * 10) + 1
                };
            }
        }
        
        scans.set(scanId, scan);
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 500);
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    STRIX API                             ║
║          Security Recon in 60 seconds                   ║
╠═══════════════════════════════════════════════════════════╣
║  API running at: http://localhost:${PORT}                ║
║                                                           ║
║  Endpoints:                                              ║
║  - POST   /api/scans      Start a scan                  ║
║  - GET    /api/scans      List all scans                ║
║  - GET    /api/scans/:id  Get scan status               ║
║  - DELETE /api/scans/:id  Delete a scan                 ║
║  - GET    /api/scans/:id/report  Get PDF report        ║
╚═══════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
