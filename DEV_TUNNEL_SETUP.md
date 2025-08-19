# VS Code Dev Tunnel Setup Guide

This guide explains how to set up the TodoApp to work with VS Code dev tunnels for remote access.

## Problem
When accessing the TodoApp through VS Code dev tunnels (like dwj7zvc-3000.inc1.devtunnels.ms), the frontend cannot communicate with the backend because:
- Frontend runs on tunnel port 3000
- Backend runs on local port 5000 (not accessible remotely)

## Solution
You need to expose BOTH frontend and backend through dev tunnels.

## Step-by-Step Setup

### 1. Start Both Servers Locally
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### 2. Create Dev Tunnels for Both Ports

#### Option A: Using VS Code Command Palette
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "Ports: Focus on Ports View"
3. In the Ports panel, click "Forward a Port"
4. Add port `3000` (Frontend)
5. Add port `5000` (Backend)
6. Set both ports to "Public" visibility

#### Option B: Using VS Code Terminal
```bash
# Make port 3000 public (Frontend)
code tunnel --accept-server-license-terms port 3000

# Make port 5000 public (Backend) - in another terminal
code tunnel --accept-server-license-terms port 5000
```

### 3. Get Your Tunnel URLs
After creating tunnels, you'll get URLs like:
- Frontend: `https://dwj7zvc-3000.inc1.devtunnels.ms`
- Backend: `https://dwj7zvc-5000.inc1.devtunnels.ms`

### 4. Verify Setup
1. Access your frontend tunnel URL
2. Try creating an account
3. Check browser console for any errors

## Automatic Configuration
The app is now configured to automatically detect dev tunnel access and adjust the API endpoints accordingly.

## Troubleshooting

### Issue: "Load failed" when creating account
**Cause:** Backend tunnel not accessible
**Solution:** 
1. Ensure backend server is running (`cd backend && npm run dev`)
2. Ensure port 5000 is forwarded and public
3. Check that backend tunnel URL is accessible

### Issue: CORS errors in browser console
**Cause:** Backend CORS not allowing tunnel origin
**Solution:** Backend is now configured to allow all devtunnels.ms origins

### Issue: Backend tunnel shows "Cannot GET /"
**This is normal!** The backend is an API server. Test it with:
- `https://your-backend-tunnel.devtunnels.ms/api/health`

### Issue: Different tunnel URLs each time
**Solution:** Use consistent tunnel names:
```bash
# Use named tunnels
code tunnel --name todoapp-frontend port 3000
code tunnel --name todoapp-backend port 5000
```

## Quick Commands

### Start Everything for Dev Tunnel Access
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - Create tunnels (or use VS Code Ports panel)
code tunnel port 3000
code tunnel port 5000
```

### Check if Backend is Working
Visit: `https://your-backend-tunnel.devtunnels.ms/api/health`
Should return: `{"status":"OK","timestamp":"..."}`

## Important Notes
- Both frontend (port 3000) AND backend (port 5000) must be tunneled
- The app automatically detects tunnel access and adjusts API URLs
- Backend CORS is configured to allow all devtunnels.ms origins
- Keep both servers running while using tunnels
