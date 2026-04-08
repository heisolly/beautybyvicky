# Vercel Deployment Guide

This guide will help you deploy Beauty by Vicky's website to Vercel.

## 🚀 Quick Deployment Steps

### 1. Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy Your Project
```bash
vercel
```

## 📋 Environment Variables Setup

In your Vercel dashboard, go to **Settings → Environment Variables** and add:

### Required Variables:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Optional Variables:
```
VITE_SITE_URL=https://your-domain.vercel.app
VITE_SITE_NAME=Beauty by Vicky's
VITE_CONTACT_EMAIL=your-email@example.com
VITE_CONTACT_PHONE=+2348012345678
VITE_CONTACT_INSTAGRAM=beautybyvicky___
VITE_BUSINESS_ADDRESS=Lagos, Nigeria
```

## 🔧 Configuration Files

### vercel.json
Your project includes a pre-configured `vercel.json` file with:
- Build configuration
- Rewrites for SPA routing
- Headers for caching
- Environment variable mapping

### API Routes
The following serverless functions are included:
- `/api/health` - Health check endpoint
- `/api/contact` - Contact form submissions
- `/api/booking` - Booking creation
- `/api/newsletter` - Newsletter subscriptions

## 📦 Build Process

Vercel will automatically:
1. Install dependencies (`npm install`)
2. Build the project (`npm run build`)
3. Deploy the `dist` folder
4. Configure serverless functions

## 🌍 Custom Domain (Optional)

### Add Custom Domain:
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `beautybyvickys.com`)
3. Configure DNS records as instructed by Vercel

### DNS Records:
```
Type: CNAME
Name: @ (or your subdomain)
Value: cname.vercel-dns.com
```

## 🔍 Pre-Deployment Checklist

### ✅ Before Deploying:
- [ ] Update `.env.example` with your actual values
- [ ] Test all forms locally
- [ ] Verify Supabase connection
- [ ] Check responsive design
- [ ] Test admin dashboard functionality

### ✅ After Deploying:
- [ ] Test contact form
- [ ] Test booking system
- [ ] Test newsletter signup
- [ ] Verify admin login
- [ ] Check all page routes
- [ ] Test mobile responsiveness

## 🐛 Common Issues & Solutions

### Issue: "Supabase connection failed"
**Solution:** Ensure environment variables are correctly set in Vercel dashboard.

### Issue: "Form submissions not working"
**Solution:** Check API routes are properly deployed and environment variables are set.

### Issue: "Admin dashboard not loading"
**Solution:** Verify Supabase RLS policies allow admin operations.

### Issue: "Images not displaying"
**Solution:** Ensure image URLs are accessible and CORS is configured.

## 📊 Monitoring

### Vercel Analytics:
- Go to Vercel Dashboard → Your Project → Analytics
- Monitor page views, visitors, and performance

### Error Logs:
- Check Vercel Functions tab for API errors
- Monitor Supabase logs for database issues

## 🔄 Continuous Deployment

### Automatic Deployments:
Vercel automatically deploys when you push to your connected Git repository.

### Manual Deployments:
```bash
vercel --prod
```

## 🛠️ Local Development with Vercel

### Run locally:
```bash
vercel dev
```

This will:
- Start local development server
- Simulate Vercel serverless functions
- Use local environment variables

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check Supabase connection
5. Review this guide for common solutions

## 🎉 Success!

Once deployed, your Beauty by Vicky's website will be live at:
- Primary: `https://your-project.vercel.app`
- Custom: `https://beautybyvickys.com` (if configured)

The website includes:
- ✅ Responsive design for all devices
- ✅ Admin dashboard for management
- ✅ Contact and booking forms
- ✅ Gallery management
- ✅ Newsletter subscriptions
- ✅ SEO optimization
- ✅ Fast loading times
