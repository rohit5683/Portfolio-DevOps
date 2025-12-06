# Quick Deployment Checklist

## Before Deployment

### 1. Environment Setup

- [ ] MongoDB Atlas database created
- [ ] Gmail App Password generated (for email)
- [ ] GitHub repository created

### 2. Backend Configuration

- [ ] Update CORS origins in `backend/src/main.ts` (line 16)
- [ ] Verify all environment variables in `.env`
- [ ] Test backend locally: `npm run start:dev`

### 3. Frontend Configuration

- [ ] Create `.env.production` with backend URL
- [ ] Test build: `npm run build`
- [ ] Test preview: `npm run preview`

---

## Deployment Steps

### Backend

1. Push code to GitHub
2. Create new Vercel project
3. Set root directory to `backend`
4. Add all environment variables (see `.env.example`)
5. Deploy
6. Copy backend URL

### Frontend

1. Update `.env.production` with backend URL
2. Push code to GitHub
3. Create new Vercel project
4. Set root directory to `frontend`
5. Add `VITE_API_BASE_URL` environment variable
6. Deploy

---

## Post-Deployment

### 1. Update Backend CORS

- Add frontend URL to `allowedOrigins` in `main.ts`
- Add `FRONTEND_URL` environment variable in Vercel
- Redeploy backend

### 2. Test

- [ ] Backend health check
- [ ] Login flow
- [ ] MFA (email/TOTP)
- [ ] Forgot password
- [ ] Contact form

### 3. MongoDB Atlas

- [ ] Whitelist Vercel IPs (or 0.0.0.0/0)
- [ ] Verify connection string

---

## Environment Variables

### Backend (Vercel Dashboard)

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=random-secret-key
JWT_REFRESH_SECRET=another-random-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
RECIPIENT_EMAIL=admin@example.com
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (Vercel Dashboard)

```
VITE_API_BASE_URL=https://your-backend.vercel.app
```

---

## Troubleshooting

### CORS Error

✅ Check `FRONTEND_URL` in backend env vars
✅ Verify origin in `main.ts` allowedOrigins
✅ Check browser console for exact origin

### Database Connection Failed

✅ Verify MongoDB URI format
✅ Check network access in Atlas
✅ Ensure user has read/write permissions

### Build Failed

✅ Check Node version (18.x recommended)
✅ Verify package.json dependencies
✅ Check Vercel build logs

---

## Quick Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [GitHub Repository](https://github.com/your-repo)

---

## Need Help?

See full guide: `VERCEL_DEPLOYMENT.md`
