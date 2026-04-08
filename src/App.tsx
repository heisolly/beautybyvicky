import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import SEO from './components/SEO';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ToastProvider>
          <Router>
            <SEO />
            <Routes>
              {/* Admin route - standalone without header */}
              <Route path="/admin/*" element={
                <Suspense fallback={<Loading fullScreen text="Loading admin..." />}>
                  <AdminPage />
                </Suspense>
              } />
              
              {/* Public routes with header */}
              <Route path="/*" element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Suspense fallback={<Loading fullScreen text="Loading beauty..." />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/services/:id" element={<ServiceDetailPage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/booking" element={<BookingPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                      </Routes>
                    </Suspense>
                  </main>
                </div>
              } />
            </Routes>
          </Router>
        </ToastProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;
