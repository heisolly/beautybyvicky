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
            <div className="h-screen flex flex-col overflow-hidden">
              <SEO />
              <Header />
              <main className="flex-1 overflow-hidden">
                <Suspense fallback={<Loading fullScreen text="Loading beauty..." />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </Router>
        </ToastProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;
