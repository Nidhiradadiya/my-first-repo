# 🚀 Deploy Both Backend & Frontend on Vercel

## ✅ Changes Made

I've configured your backend to work as a Vercel serverless function:

1. ✅ Added `apps/backend/vercel.json` - Vercel configuration
2. ✅ Modified `apps/backend/src/index.js` - Export app module for serverless
3. ✅ Pushed to GitHub

---

## 📦 Deployment Strategy

You'll create **TWO separate Vercel projects**:

1. **Project 1**: Backend API (`apps/backend`)
2. **Project 2**: Frontend App (`apps/frontend`)

---

## 🎯 Step 1: Deploy Backend to Vercel

### 1.1 Go to Vercel
- Visit: https://vercel.com
- Sign in with GitHub

### 1.2 Create New Project
- Click **"Add New..."** → **"Project"**
- Select **"my-first-repo"**
- Click **"Import"**

### 1.3 Configure Backend Project

**IMPORTANT Settings:**

```
Project Name: erp-backend
Framework Preset: Other
Root Directory: apps/backend        ← CRITICAL!
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: npm install
```

### 1.4 Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `PORT` | `5000` |
| `JWT_SECRET` | `your-super-secret-key` |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | (Get from MongoDB Atlas - see below) |

### 1.5 Deploy Backend

- Click **"Deploy"**
- Wait 2-3 minutes
- **Copy the backend URL** (e.g., `https://erp-backend.vercel.app`)

---

## 🗄️ Step 2: Set Up MongoDB Atlas

### 2.1 Create MongoDB Atlas Account
- Go to: https://cloud.mongodb.com
- Sign up / Sign in

### 2.2 Create Free Cluster
- Click **"Create"**
- Choose **"M0 Free"** tier
- Select region closest to you
- Click **"Create Cluster"**

### 2.3 Create Database User
- Go to **"Database Access"**
- Click **"Add New Database User"**
- Username: `admin`
- Password: (generate strong password - save it!)
- Click **"Add User"**

### 2.4 Whitelist IP
- Go to **"Network Access"**
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"** (0.0.0.0/0)
- Click **"Confirm"**

### 2.5 Get Connection String
- Go back to **"Database"**
- Click **"Connect"** on your cluster
- Choose **"Connect your application"**
- Copy the connection string:
  ```
  mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- Replace `<password>` with your user password
- Replace database name with `erp_billing`

### 2.6 Add to Vercel
- Go back to Vercel → Your backend project
- Go to **"Settings"** → **"Environment Variables"**
- Add:
  ```
  MONGODB_URI = mongodb+srv://admin:your-password@cluster0.xxxxx.mongodb.net/erp_billing?retryWrites=true&w=majority
  ```
- Click **"Save"**
- Go to **"Deployments"** → **"Redeploy"**

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create Another Project
- Go back to Vercel dashboard
- Click **"Add New..."** → **"Project"**
- Select **"my-first-repo"** again
- Click **"Import"**

### 3.2 Configure Frontend Project

**IMPORTANT Settings:**

```
Project Name: erp-frontend
Framework Preset: Next.js
Root Directory: apps/frontend       ← CRITICAL!
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 3.3 Add Environment Variable

**BEFORE deploying**, add:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://erp-backend.vercel.app/api` | Production, Preview, Development |

⚠️ Use YOUR actual backend URL from Step 1.5!

### 3.4 Deploy Frontend

- Click **"Deploy"**
- Wait 2-3 minutes
- **You're done!** 🎉

---

## ✅ Final Setup

After both are deployed:

### Update Backend CORS

1. Go to backend project in Vercel
2. Go to **"Settings"** → **"Environment Variables"**
3. Add:
   ```
   FRONTEND_URL = https://erp-frontend.vercel.app
   ```
   (Use YOUR frontend URL)
4. Redeploy backend

---

## 🎯 Your Live URLs

After deployment:

- **Frontend**: `https://erp-frontend.vercel.app`
- **Backend API**: `https://erp-backend.vercel.app/api`
- **Database**: MongoDB Atlas (Free tier)

**Total Cost**: $0/month! 🎊

---

## 🧪 Test Your Deployment

1. Visit your frontend URL
2. Try to register a new user
3. Login
4. Create a sale
5. Check Sales History

If everything works, you're done! 🚀

---

## ⚠️ Important Notes

### Vercel Serverless Limitations

1. **Cold Starts**: First request may be slow (1-2 seconds)
2. **Timeout**: Functions timeout after 10 seconds (Hobby plan)
3. **Memory**: 1024 MB max (Hobby plan)
4. **No WebSockets**: Can't use WebSocket connections

These limitations are fine for your ERP app!

### MongoDB Connection Pooling

Vercel manages MongoDB connections automatically. Each serverless function invocation may create a new connection, but Mongoose handles this efficiently.

---

## 🔧 Troubleshooting

### Issue: Backend API not responding

**Solution**: Check Environment Variables are set correctly in Vercel Settings

### Issue: MongoDB connection error

**Solution**: 
1. Verify MONGODB_URI is correct
2. Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
3. Verify database user credentials

### Issue: CORS errors

**Solution**: Add FRONTEND_URL environment variable to backend

### Issue: Frontend can't connect to backend

**Solution**: Verify NEXT_PUBLIC_API_URL in frontend project settings

---

## 📊 Monitoring

### View Logs

**Backend Logs:**
1. Go to backend project in Vercel
2. Click on latest deployment
3. Click **"Functions"** tab
4. Click on any function to see logs

**Frontend Logs:**
1. Go to frontend project in Vercel
2. Click on latest deployment
3. Click **"Build Logs"** or **"Function Logs"**

---

## 🎉 You're All Set!

Both backend and frontend are now deployed on Vercel!

- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub
- ✅ MongoDB Atlas database
- ✅ Zero server management

Enjoy your deployed ERP system! 🚀
