# ⚠️ CRITICAL Railway Configuration

## The Problem
Railway cannot find `/app/src/index.js` because it's looking in the wrong directory.

## ✅ SOLUTION: Set Root Directory in Railway

You MUST set the **Root Directory** in Railway dashboard. Here's how:

### Step-by-Step Fix:

1. **Go to Railway Dashboard**
   - Open your project: https://railway.app/dashboard

2. **Click on your Backend Service**
   - Select the service that's failing

3. **Go to Settings Tab**
   - Click "Settings" in the left sidebar

4. **Scroll to "Root Directory"**
   - Find the "Root Directory" section
   - Click "Configure"

5. **Enter EXACTLY:**
   ```
   apps/backend
   ```
   - NO leading slash
   - NO trailing slash
   - Just: `apps/backend`

6. **Click "Save"**

7. **Redeploy**
   - Go back to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - OR push a dummy commit to trigger rebuild

---

## 🔍 Verify It's Working

After redeploying, check the build logs. You should see:

✅ **Good Signs:**
```
Working directory: /app/apps/backend
Installing dependencies...
npm install --production
Starting: node src/index.js
Server running on port 5000
```

❌ **Bad Signs (means root dir not set):**
```
Error: Cannot find module '/app/src/index.js'
```

---

## 🎯 Alternative: Manual Start Command Override

If setting root directory doesn't work, try this:

1. Go to **Settings** → **Deploy**
2. Find **"Start Command"**
3. Override with:
   ```
   cd apps/backend && node src/index.js
   ```
4. Click Save
5. Redeploy

---

## 📸 Visual Guide

**Where to find Root Directory setting:**

```
Railway Dashboard
└── Your Project
    └── Backend Service
        └── Settings (tab)
            └── Root Directory Section
                └── Configure button
                    └── Enter: apps/backend
                        └── Save
```

---

## 🚨 Still Not Working?

### Option 1: Delete and Recreate Service

1. Delete the current backend service in Railway
2. Click "New" → "GitHub Repo"
3. Select your repository
4. **IMMEDIATELY** go to Settings
5. Set Root Directory to `apps/backend`
6. Add environment variables
7. Deploy

### Option 2: Use Dockerfile Instead

If nixpacks keeps failing, I can create a Dockerfile for you that will work 100%.

Just let me know!

---

## ✅ Quick Checklist

Before redeploying, verify:

- [ ] Root Directory = `apps/backend` (in Railway Settings)
- [ ] Environment variables added (JWT_SECRET, NODE_ENV, etc.)
- [ ] MongoDB database added to project
- [ ] Code pushed to GitHub
- [ ] Redeployed after setting root directory

---

## 🎓 Why This Happens

Railway by default assumes your code is in the repository root (`/app/`).

Your monorepo structure:
```
/app/                          ← Railway starts here
  ├── apps/
  │   └── backend/             ← Backend is here!
  │       └── src/
  │           └── index.js     ← This is what we need to run
```

Without setting Root Directory, Railway runs `node src/index.js` from `/app/`, looking for `/app/src/index.js` which doesn't exist.

With Root Directory set to `apps/backend`, Railway changes to `/app/apps/backend/` first, then runs `node src/index.js`, finding `/app/apps/backend/src/index.js` ✅

---

The fix is simple: **Set Root Directory to `apps/backend` in Railway Settings!**
