# 🌸 Beauty by Vicky's

A modern, responsive beauty salon website built with React, TypeScript, and Tailwind CSS. Features a fully functional admin dashboard for managing appointments, services, and gallery items.

## ✨ Features

### 🎨 Frontend
- **Responsive Design**: Mobile-first approach, perfect for all devices
- **Modern UI**: Beautiful design using Tailwind CSS and Framer Motion
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Fast Performance**: Optimized build with Vite and code splitting
- **Accessibility**: WCAG compliant with proper ARIA labels

### 💼 Admin Dashboard
- **Mobile Optimized**: Designed specifically for phone usage
- **Booking Management**: View, confirm, and manage appointments
- **Service Management**: Add, edit, and remove beauty services
- **Gallery Management**: Upload and organize portfolio images
- **Customer Messages**: View and respond to contact form submissions
- **Real-time Stats**: Track bookings, revenue, and client metrics

### 🔧 Backend Features
- **Supabase Integration**: Real-time database with authentication
- **Serverless Functions**: Vercel API endpoints for form submissions
- **Data Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error management
- **Security**: Row Level Security (RLS) policies

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/heisolly/beautybyvicky.git
   cd beautybyvicky
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Mobile Usage

The admin dashboard is specifically optimized for mobile devices:

- **Touch-friendly buttons** and large tap targets
- **Responsive navigation** with hamburger menu
- **Optimized forms** for mobile input
- **Swipe gestures** for gallery management
- **Compact layouts** for small screens

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Deployment
./deploy.sh          # Deploy to Vercel (recommended)
vercel --prod        # Manual Vercel deployment
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Easy deployment script**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Manual Vercel deployment**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Environment Variables**
   Set these in your Vercel dashboard:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 📁 Project Structure

```
beautybyvicky/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── admin/          # Admin dashboard components
│   │   ├── ui/             # UI components
│   │   └── layout/         # Layout components
│   ├── pages/              # Page components
│   ├── lib/                # Utility functions
│   ├── contexts/           # React contexts
│   └── styles/             # Global styles
├── api/                    # Vercel serverless functions
├── public/                 # Static assets
├── database/               # Database scripts
└── docs/                   # Documentation
```

## 🔑 Admin Access

### Default Admin Credentials
- **Email**: admin@beautybyvickys.com
- **Password**: admin123

## 🎨 Customization

### Brand Colors
The theme uses Vicky's brand colors:
- **Primary**: Custom beauty salon pink
- **Accent**: Complementary rose gold
- **Background**: Soft cream tones

## 📞 Support

For support and questions:
- 📧 Email: matthewvic217@gmail.com
- 📱 Instagram: @beautybyvicky___

---

Made with ❤️ for Beauty by Vicky's Salon