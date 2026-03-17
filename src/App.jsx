import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleGuard from './components/common/RoleGuard';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const MentorListPage = lazy(() => import('./pages/MentorListPage'));
const MentorDetailPage = lazy(() => import('./pages/MentorDetailPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const BookingConfirmPage = lazy(() => import('./pages/BookingConfirmPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MenteeDashboard = lazy(() => import('./pages/MenteeDashboard'));
const MentorDashboard = lazy(() => import('./pages/MentorDashboard'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const GuidesPage = lazy(() => import('./pages/GuidesPage'));
const GuideCategoryPage = lazy(() => import('./pages/GuideCategoryPage'));
const GuideDetailPage = lazy(() => import('./pages/GuideDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <LoadingSpinner size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="mentors" element={<MentorListPage />} />
                <Route path="mentors/:id" element={<MentorDetailPage />} />
                <Route path="guides" element={<GuidesPage />} />
                <Route path="guides/:categorySlug" element={<GuideCategoryPage />} />
                <Route path="guides/:categorySlug/:topicSlug" element={<GuideDetailPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="booking" element={<BookingPage />} />
                  <Route path="booking/confirm" element={<BookingConfirmPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="reviews" element={<ReviewsPage />} />
                  <Route path="dashboard" element={
                    <RoleGuard role="mentee">
                      <MenteeDashboard />
                    </RoleGuard>
                  } />
                  <Route path="mentor-dashboard" element={
                    <RoleGuard role="mentor">
                      <MentorDashboard />
                    </RoleGuard>
                  } />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
