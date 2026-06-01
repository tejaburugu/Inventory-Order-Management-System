# Deployment Guide: Render.com

This guide walks you through deploying the Inventory & Order Management System to **Render.com** for free.

## Prerequisites

- GitHub account with the repository pushed
- Render.com account (free signup at https://render.com)
- 5-10 minutes to set everything up

## Architecture Overview

On Render, we'll deploy:
1. **PostgreSQL Database** (free tier)
2. **Backend API** (FastAPI service)
3. **Frontend** (Static React site)

All three components communicate over Render's internal network.

---

## Step 1: Create a PostgreSQL Database

### 1.1 Sign in to Render
Go to https://render.com and sign in with your GitHub account.

### 1.2 Create PostgreSQL Instance
1. Click **New +** → **PostgreSQL**
2. Fill in the details:
   - **Name**: `inventory-db`
   - **Database**: `inventory_db`
   - **User**: `inventory_user`
   - **Region**: Select closest to you
   - **Plan**: Free (0.4 GB RAM, 512 MB storage)
3. Click **Create Database**
4. Wait 2-3 minutes for the database to be created
5. Copy the **Internal Database URL** (you'll need this for the backend)

**Note**: The free plan will be put to sleep after 15 minutes of inactivity. This is normal.

---

## Step 2: Deploy the Backend API

### 2.1 Create Backend Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Fill in the details:
   - **Name**: `inventory-backend`
   - **Runtime**: `Docker`
   - **Region**: Same as database
   - **Plan**: Free
4. Click **Create Web Service**

### 2.2 Set Environment Variables

While the backend is building, configure environment variables:

1. Go to the **inventory-backend** service page
2. Scroll down to **Environment** section
3. Add the following variables:

```
DATABASE_URL=postgresql://inventory_user:YOUR_PASSWORD@YOUR_INTERNAL_HOST:5432/inventory_db
SECRET_KEY=your-random-32-character-secret-key-here
FASTAPI_HOST=0.0.0.0
FASTAPI_PORT=3000
```

**To get DATABASE_URL**:
- Go back to your PostgreSQL instance in Render
- Copy the **Internal Database URL** from the info panel
- Replace the password with your actual database password

**Example DATABASE_URL**:
```
postgresql://inventory_user:abc123def456@dpg-abc123def456.oregon-postgres.render.com:5432/inventory_db
```

### 2.3 Configure Build & Deploy Settings

1. In the **inventory-backend** service, go to **Settings** tab
2. Under **Build Command**, enter:
   ```
   pip install -r backend/requirements.txt
   ```
3. Under **Start Command**, enter:
   ```
   uvicorn backend.app.main:app --host 0.0.0.0 --port 3000
   ```
4. Click **Save Changes**

The backend will redeploy automatically.

### 2.4 Wait for Backend Deployment
The backend should deploy in 3-5 minutes. You'll see a green checkmark when it's live.

**Note the Backend URL** (example: `https://inventory-backend-abc123.onrender.com`)

---

## Step 3: Deploy the Frontend

### 3.1 Create Frontend Service
1. Click **New +** → **Static Site**
2. Connect your GitHub repository
3. Fill in the details:
   - **Name**: `inventory-frontend`
   - **Region**: Same as backend
4. Leave **Build Command** and **Publish Directory** empty for now
5. Click **Create Static Site**

### 3.2 Configure Frontend Build

1. Go to the **inventory-frontend** service
2. Go to **Settings** tab
3. Under **Build Command**, enter:
   ```
   cd frontend && npm install && npm run build
   ```
4. Under **Publish Directory**, enter:
   ```
   frontend/dist
   ```
5. Click **Save Changes**

### 3.3 Set Frontend Environment Variables

1. In the **inventory-frontend** service, scroll to **Environment** section
2. Add this variable:
   ```
   VITE_API_URL=https://inventory-backend-abc123.onrender.com
   ```
   
   Replace `inventory-backend-abc123.onrender.com` with your actual backend URL from Step 2.4

3. Click **Save Changes**

The frontend will redeploy with the correct API URL.

---

## Step 4: Verify Deployment

### 4.1 Test Backend API
Open in your browser:
```
https://inventory-backend-abc123.onrender.com/docs
```

You should see the interactive API documentation (Swagger UI).

### 4.2 Test Frontend
Open in your browser:
```
https://inventory-frontend-abc123.onrender.com
```

You should see the Inventory Management dashboard.

### 4.3 Test API Connection
1. Go to the **Products** page
2. Try creating a product
3. If it appears in the list, the frontend-to-backend connection works! ✅

---

## Troubleshooting

### Database Connection Error
**Problem**: Backend service fails with database connection error.

**Solution**:
1. Check DATABASE_URL is correct (from PostgreSQL instance)
2. Ensure password is correct
3. Use **Internal Database URL** (not External)
4. Restart the backend service: Click **Manual Deploy** → **Deploy latest commit**

### Frontend Shows "Failed to load dashboard data"
**Problem**: Dashboard displays error message.

**Solution**:
1. Check `VITE_API_URL` environment variable is set to correct backend URL
2. Open browser DevTools (F12) → Network tab
3. See if API requests are being made to correct backend URL
4. Redeploy frontend if you changed the variable

### Service Won't Start
**Problem**: Service shows "Deploy failed" status.

**Solution**:
1. Check the **Logs** tab for error messages
2. For backend: Verify all Python dependencies installed correctly
3. For frontend: Ensure build command runs without errors locally first
4. Restart the service from the **Settings** tab

### Cold Start Takes Too Long
Render's free tier puts services to sleep after 15 minutes of inactivity. The first request after sleep takes 30-60 seconds as the service wakes up. This is normal and acceptable for a portfolio project.

---

## Upgrade to Paid Tier (Optional)

If you want to:
- Remove service sleep/cold starts: Upgrade to **Starter** tier ($7/month per service)
- Increase database storage: Upgrade PostgreSQL to **Standard** tier ($7/month)

To upgrade:
1. Go to service **Settings**
2. Under **Plan**, click **Change Plan**
3. Select desired plan

---

## Next Steps

### 1. Custom Domain (Optional)
To use your own domain:
1. In Render dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records at your domain registrar following Render's instructions

### 2. Environment Secrets
For production, store sensitive data securely:
1. Use Render's encrypted environment variables (already doing this)
2. Never commit `.env` files to GitHub
3. Rotate `SECRET_KEY` regularly

### 3. Database Backups
Enable automatic backups on your PostgreSQL instance:
1. Go to PostgreSQL instance
2. Check backup settings in **Settings** tab

### 4. Monitoring
Set up alerts for service failures:
1. Go to service **Settings**
2. Enable notifications for failures

---

## Live URL Reference

After deployment, your URLs will be:

- **Frontend**: `https://inventory-frontend-XXXXX.onrender.com`
- **Backend API**: `https://inventory-backend-XXXXX.onrender.com`
- **API Docs**: `https://inventory-backend-XXXXX.onrender.com/docs`
- **Database**: Managed by Render (internal only)

---

## Cost Summary

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Backend | Free | Up to 750 compute hours/month (sleeps after 15 min inactivity) |
| Frontend | Free | Unlimited deployments |
| Database | Free | 0.4 GB RAM, 512 MB storage |
| **Total** | **Free** | Suitable for portfolio & demos |

---

## Support

- **Render Docs**: https://render.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/

Happy deploying! 🚀
