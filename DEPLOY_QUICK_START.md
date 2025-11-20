# 🚀 Quick Start: Deploy to Vercel

Follow these steps to deploy your ERP system to Vercel (Frontend) and Railway (Backend).

## Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com)
- Railway account (sign up at railway.app)
- Your code pushed to GitHub

---

## Step 1: Deploy Backend to Railway (5 minutes)

### 1.1 Go to Railway
Visit [railway.app](https://railway.app) and sign in with GitHub

### 1.2 Create New Project
- Click **"New Project"**
- Select **"Deploy from GitHub repo"**
- Choose your `billingSoftware` repository
- Select **"Deploy Now"**

### 1.3 Configure Backend Service
After deployment starts:
- Click on the service
- Go to **Settings** → **Root Directory**
- Set to: `apps/backend`
- Click **"Save"**

### 1.4 Add MongoDB
- In your project, click **"New"**
- Select **"Database"** → **"Add MongoDB"**
- Railway will automatically create the database
- Copy the `MONGODB_URI` from the connection string

### 1.5 Add Environment Variables
Go to **Variables** tab and add:

```
PORT=5000
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=production
```

(MONGODB_URI should already be auto-added)

### 1.6 Redeploy
- Click **"Deploy"** to apply changes
- Wait for deployment to complete

### 1.7 Get Backend URL
- Go to **Settings** → **Networking**
- Click **"Generate Domain"**
- Copy the URL (e.g., `https://your-app-production.up.railway.app`)

**✅ Backend is now live!**

---

## Step 2: Deploy Frontend to Vercel (5 minutes)

### 2.1 Go to Vercel
Visit [vercel.com](https://vercel.com) and sign in with GitHub

### 2.2 Import Project
- Click **"Add New..."** → **"Project"**
- Import your `billingSoftware` repository
- Click **"Import"**

### 2.3 Configure Build Settings
Vercel should auto-detect Next.js, but verify:

**Framework Preset:** Next.js  
**Root Directory:** `apps/frontend`  
**Build Command:** `npm run build`  
**Output Directory:** `.next`  
**Install Command:** `npm install`

### 2.4 Add Environment Variable
Before deploying, add environment variable:

- Click **"Environment Variables"**
- Add:
  - **Name:** `NEXT_PUBLIC_API_URL`
  - **Value:** `https://your-backend-url.railway.app/api` (from Step 1.7)
  - **Environments:** Production, Preview, Development

### 2.5 Deploy
- Click **"Deploy"**
- Wait 2-3 minutes for build to complete

### 2.6 Get Frontend URL
- After deployment, you'll get a URL like: `https://your-app.vercel.app`

**✅ Frontend is now live!**

---

## Step 3: Update Backend CORS

### 3.1 Add Vercel Domain to CORS
In Railway dashboard:
- Go to your backend service
- Click **"Variables"**
- Add a new variable:
  - **Name:** `FRONTEND_URL`
  - **Value:** `https://your-app.vercel.app`

### 3.2 Update Backend Code
Edit `apps/backend/src/index.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

Push changes to GitHub, Railway will auto-redeploy.

---

## Step 4: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try to login
3. Create a sale
4. Check if data is saved

**🎉 If everything works, you're done!**

---

## Quick Commands Reference

### Deploy Frontend Updates
```bash
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys from GitHub
```

### Deploy Backend Updates
```bash
git add .
git commit -m "Update backend"
git push
# Railway auto-deploys from GitHub
```

### View Logs

**Railway (Backend):**
- Go to your Railway project
- Click on backend service
- Click **"Deployments"** → Latest deployment → **"View Logs"**

**Vercel (Frontend):**
- Go to your Vercel project
- Click on latest deployment
- Click **"View Function Logs"**

---

## Troubleshooting

### Problem: Frontend can't connect to backend

**Solution:**
1. Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Verify backend is running on Railway
3. Check CORS settings in backend

### Problem: Login not working

**Solution:**
1. Check JWT_SECRET is set in Railway
2. Verify MongoDB is connected
3. Check browser console for errors

### Problem: Build failing on Vercel

**Solution:**
1. Check build logs in Vercel
2. Ensure all dependencies are in package.json
3. Verify Next.js version compatibility

---

## Cost: $0/month

Both services offer generous free tiers:
- **Vercel:** Free for hobby projects
- **Railway:** $5 free credit/month (enough for small apps)
- **MongoDB Atlas:** 512MB free tier

---

## Next Steps

- [ ] Set up custom domain (optional)
- [ ] Configure SSL (automatic on Vercel & Railway)
- [ ] Set up monitoring and alerts
- [ ] Configure automatic backups for MongoDB
- [ ] Add CI/CD pipeline (optional)

---

## Support

If you encounter any issues, check the detailed guide in `vercel_deployment.md` or ask for help!
