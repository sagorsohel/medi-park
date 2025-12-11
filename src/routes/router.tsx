import { createBrowserRouter } from 'react-router'
import HomePage from '../pages/home/home-page'
import AboutPage from '../pages/about/about-page'
import AwardsPage from '../pages/awards/awards-page'
import CareerPage from '../pages/career/career-page'
import JobDetailPage from '../pages/career/job-detail-page'
import NewsDetailPage from '../pages/news/news-detail-page'
import DoctorsPage from '../pages/doctors/doctors-page'
import DoctorDetailPage from '../pages/doctors/doctor-detail-page'
import BlogsPage from '../pages/blogs/blogs-page'
import BlogDetailPage from '../pages/blogs/blog-detail-page'
import InvestorsPage from '../pages/investors/investors-page'
import ContactPage from '../pages/contact/contact-page'
import PrivacyPage from '../pages/privacy/privacy-page'
import LoginPage from '../pages/auth/login-page'
import RegisterPage from '../pages/auth/register-page'
import ForgotPasswordPage from '../pages/auth/forgot-password-page'
import DashboardPage from '../pages/dashboard/dashboard-page'
import WebHomeManagePage from '../pages/admin/web-home-manage-page'
import StaffPage from '../pages/admin/staff-page'
import AddStaffPage from '../pages/admin/add-staff-page'
import DoctorPage from '../pages/admin/doctor/doctor-page'
import AddDoctorPage from '../pages/admin/doctor/add-doctor-page'
import UserDashboardPage from '../pages/user/user-dashboard-page'
import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import UserPanelLayout from '@/components/user-panel/user-panel-layout'
import { WebsiteLayout } from '@/components/website/website-layout'
import AboutPageManage from '@/pages/admin/about-page-manage/about-page-manage'

import NewsPageManage from '@/pages/admin/news/news'
import NewsPage from '@/pages/news/news-page'

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
      { path: "news", element: <NewsPage /> },
      { path: "news/:id", element: <NewsDetailPage /> },
      { path: "doctors", element: <DoctorsPage /> },
      { path: "doctors/:id", element: <DoctorDetailPage /> },
      { path: "blogs", element: <BlogsPage /> },
      { path: "blogs/:id", element: <BlogDetailPage /> },
      { path: "investors", element: <InvestorsPage /> },
      { path: "contacts", element: <ContactPage /> },
      { path: "privacy-policy", element: <PrivacyPage /> },
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
      { path: "website/home", element: <WebHomeManagePage /> },
      { path: "website/about", element: <AboutPageManage /> },
      { path: "website/news", element: <NewsPageManage /> },
      { path: "staff", element: <StaffPage /> },
      { path: "staff/new", element: <AddStaffPage /> },
      { path: "doctor", element: <DoctorPage /> },
      { path: "doctor/new", element: <AddDoctorPage /> },
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