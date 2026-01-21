# Backend Server Restart Instructions

## Quick Fix for Network Connection Error

If you're seeing "Cannot connect to backend server" error, follow these steps:

### Step 1: Stop the Current Backend Server
1. Find the terminal/command prompt where the backend is running
2. Press `Ctrl + C` to stop the server

### Step 2: Restart the Backend Server
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Start the server:
   ```bash
   npm run dev
   ```
   
   OR if you don't have nodemon:
   ```bash
   npm start
   ```

### Step 3: Verify Server is Running
You should see:
```
Server started on port 5000
Server accessible at http://localhost:5000
API endpoints available at http://localhost:5000/api
```

### Step 4: Test the Connection
Open your browser and go to:
- http://localhost:5000 - Should show "Viraya API running"
- http://localhost:5000/health - Should show JSON with status

### Step 5: Try Login Again
Go back to the admin login page and try logging in again.

## Troubleshooting

### If port 5000 is already in use:
1. Check what's using port 5000:
   ```bash
   netstat -ano | findstr :5000
   ```
2. Kill the process (replace PID with the process ID):
   ```bash
   taskkill /PID <PID> /F
   ```
3. Restart the server

### If you see MongoDB connection errors:
- Make sure MongoDB is running (if using local MongoDB)
- Or check your MongoDB Atlas connection string in `.env`

### If CORS errors appear:
- The CORS is already configured to allow localhost:5173
- Make sure your frontend is running on port 5173 (default Vite port)
