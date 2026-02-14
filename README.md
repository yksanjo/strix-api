# Strix API

REST API for Security Recon in 60 seconds.

## Features

- ⚡ Fast REST API
- 🔒 Security headers with Helmet
- 📊 Scan management
- 🔄 Real-time progress tracking
- 📄 PDF report endpoints

## Installation

```bash
cd strix-api
npm install
```

## Usage

```bash
npm start
```

API will be available at http://localhost:8080

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/scans | Start a new scan |
| GET | /api/scans | List all scans |
| GET | /api/scans/:id | Get scan status |
| DELETE | /api/scans/:id | Delete a scan |
| GET | /api/scans/:id/report | Get PDF report |

## Example Usage

```bash
# Start a scan
curl -X POST http://localhost:8080/api/scans \
  -H "Content-Type: application/json" \
  -d '{"target": "example.com"}'

# Get scan status
curl http://localhost:8080/api/scans/:id
```
