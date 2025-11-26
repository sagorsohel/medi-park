import { createBrowserRouter } from 'react-router'
import HomePage from '../pages/home/home-page'
import AboutPage from '../pages/about/about-page'
import AwardsPage from '../pages/awards/awards-page'
import CareerPage from '../pages/career/career-page'
import JobDetailPage from '../pages/career/job-detail-page'
import LoginPage from '../pages/auth/login-page'
import RegisterPage from '../pages/auth/register-page'
import ForgotPasswordPage from '../pages/auth/forgot-password-page'
import DashboardPage from '../pages/dashboard/dashboard-page'
import UserDashboardPage from '../pages/user/user-dashboard-page'
import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import UserPanelLayout from '@/components/user-panel/user-panel-layout'
import { WebsiteLayout } from '@/components/website/website-layout'

const router = createBrowserRouter([
  // 🌐 Website routes (with website layout - sticky navbar & footer)
  {
    path: "/",
    element: <WebsiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "awards", element: <AwardsPage /> },
      { path: "careers", element: <CareerPage /> },
      { path: "careers/job/:id", element: <JobDetailPage /> },
    ],
  },

  // 🧭 Admin Auth routes (no layout)
  {
    path: "/admin/login",
    element: <LoginPage />,
  },
  {
    path: "/admin/register",
    element: <RegisterPage />,
  },
  {
    path: "/admin/forgot-password",
    element: <ForgotPasswordPage />,
  },

  // 🧭 Admin Dashboard routes
  {
    path: "/admin",
    element: <AdminPanelLayout />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
    ],
  },

  // 👤 User Auth routes (no layout)
  {
    path: "/user/login",
    element: <LoginPage />,
  },
  {
    path: "/user/register",
    element: <RegisterPage />,
  },
  {
    path: "/user/forgot-password",
    element: <ForgotPasswordPage />,
  },

  // 👤 User Panel routes
  {
    path: "/user",
    element: <UserPanelLayout />,
    children: [
      { path: "dashboard", element: <UserDashboardPage /> },
    ],
  },
]);

export default router