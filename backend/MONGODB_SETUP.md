# MongoDB Atlas Setup Guide

## ✅ Password Fixed!
Your authentication is now working. The current issue is that your IP address needs to be whitelisted.

## Current Issue: IP Address Not Whitelisted

MongoDB Atlas requires you to whitelist IP addresses that can connect to your database for security reasons.

## Quick Fix Steps:

### 1. Whitelist Your IP Address

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Log in to your account
3. Click on **"Network Access"** in the left sidebar (under Security)
4. Click the **"Add IP Address"** button (green button)
5. Choose one of these options:
   - **Option A (Recommended for Development)**: Click **"Add Current IP Address"** - This will automatically add your current IP
   - **Option B (Less Secure)**: Add `0.0.0.0/0` to allow all IPs (only use for development/testing)
6. Click **"Confirm"**
7. **Wait 1-2 minutes** for the changes to take effect
8. Restart your backend server

### 2. Restart Your Server

After whitelisting your IP:
```bash
npm start
```

## Direct Links:

- **Network Access (IP Whitelist)**: https://cloud.mongodb.com/v2#/security/network/whitelist
- **Database Access**: https://cloud.mongodb.com/v2#/security/database/users

## Complete Setup Checklist:

- ✅ MongoDB Atlas account created
- ✅ Cluster created (Cluster0)
- ✅ Database user created
- ✅ Password set in `.env` file
- ⏳ **IP address whitelisted** ← You are here
- ⏳ Test connection

## Troubleshooting

### "IP not whitelisted" error:
- Make sure you added your IP in Network Access
- Wait 1-2 minutes after adding IP
- Check if you're behind a VPN (you may need to add VPN IP)
- For development, you can temporarily allow all IPs with `0.0.0.0/0` (NOT recommended for production)

### Authentication Error:
- Double-check your username and password in `.env`
- Make sure password is URL-encoded if it has special characters
- Verify database user exists in MongoDB Atlas

### Connection Timeout:
- Check your internet connection
- Verify the connection string is correct
- Make sure your cluster is running (not paused)

## Password URL Encoding Reference

If your password contains special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `/` → `%2F`
- `:` → `%3A`
- `?` → `%3F`
- `=` → `%3D`
- ` ` (space) → `%20`

## Example .env File

```env
MONGO_URI=mongodb+srv://varunmk2004:your_password_here@cluster0.pwvpd0g.mongodb.net/viraya?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
CLIENT_URL=http://localhost:5173
```

Replace `your_password_here` with your actual password (URL-encoded if needed).
