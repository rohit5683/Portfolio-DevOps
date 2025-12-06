# Vercel Deployment Guide

## Prerequisites

- GitHub account
- Vercel account
- MongoDB Atlas database

## Backend Deployment

### 1. Prepare Backend

```bash
cd backend
npm install
```

### 2. Push to GitHub

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `backend` folder as root directory
5. Configure environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `RECIPIENT_EMAIL`
   - `FRONTEND_URL` (your frontend Vercel URL)
   - `NODE_ENV=production`
6. Click "Deploy"

### 4. Get Backend URL

After deployment, copy your backend URL (e.g., `https://your-backend.vercel.app`)

---

## Frontend Deployment

### 1. Update Environment Variable

Create `.env.production` file:

```env
VITE_API_BASE_URL=https://your-backend.vercel.app
```

### 2. Test Build Locally

```bash
cd frontend
npm run build
npm run preview
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as root directory
5. Configure environment variables:
   - `VITE_API_BASE_URL=https://your-backend.vercel.app`
6. Click "Deploy"

---

## Post-Deployment Configuration

### 1. Update CORS in Backend

Update `backend/src/main.ts` line 16:

```typescript
'https://your-frontend.vercel.app', // Replace with actual domain
```

Redeploy backend after this change.

### 2. Update Frontend URL in Backend Environment

In Vercel backend project settings:

- Add/Update `FRONTEND_URL=https://your-frontend.vercel.app`

### 3. MongoDB Atlas Whitelist

1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Vercel's IP ranges

---

## Testing

### Test Backend

```bash
curl https://your-backend.vercel.app/health
```

### Test CORS

Open browser console on frontend:

```javascript
fetch("https://your-backend.vercel.app/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@example.com", password: "test" }),
});
```

### Test Full Flow

1. Open frontend URL
2. Try to login
3. Check if MFA works
4. Test forgot password
5. Test all features

---

## Troubleshooting

### CORS Errors

- Check `FRONTEND_URL` environment variable in backend
- Verify allowed origins in `main.ts`
- Check browser console for exact error

### Database Connection

- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access
- Ensure database user has proper permissions

### Email Not Sending

- Verify SMTP credentials
- Check if Gmail "Less secure app access" is enabled
- Use App-Specific Password for Gmail

### Build Failures

- Check Node version compatibility
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

---

## Environment Variables Summary

### Backend (Vercel)

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
RECIPIENT_EMAIL=admin@example.com
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)

```
VITE_API_BASE_URL=https://your-backend.vercel.app
```

---

## Custom Domain (Optional)

### Add Custom Domain to Frontend

1. Go to Vercel project settings
2. Domains → Add Domain
3. Follow DNS configuration instructions

### Add Custom Domain to Backend

1. Go to Vercel backend project settings
2. Domains → Add Domain
3. Update `FRONTEND_URL` and CORS settings

---

## Continuous Deployment

Once connected to GitHub:

- Push to `main` branch → Auto-deploys to production
- Create PR → Auto-creates preview deployment
- Merge PR → Auto-deploys to production

---

## Monitoring

### Vercel Dashboard

- View deployment logs
- Monitor function invocations
- Check error rates

### MongoDB Atlas

- Monitor database connections
- Check query performance
- View slow queries

---

## Security Checklist

✅ Environment variables are set in Vercel (not in code)
✅ CORS is properly configured
✅ JWT secrets are strong and unique
✅ MongoDB has network access restrictions
✅ HTTPS is enabled (automatic with Vercel)
✅ Security headers are configured (in vercel.json)

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for frontend errors
3. Check MongoDB Atlas logs
4. Verify all environment variables are set correctly
