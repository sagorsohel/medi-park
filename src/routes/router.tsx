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
import GelleryPage from '../pages/gellery/gellery'
import LoginPage from '../pages/auth/login-page'
import RegisterPage from '../pages/auth/register-page'
import ForgotPasswordPage from '../pages/auth/forgot-password-page'
import DashboardPage from '../pages/dashboard/dashboard-page'
import WebHomeManagePage from '../pages/admin/web-home-manage-page'
import StaffPage from '../pages/admin/staff-page'
import AddStaffPage from '../pages/admin/add-staff-page'
import DoctorPage from '../pages/admin/doctor/doctor-page'
import AddDoctorPage from '../pages/admin/doctor/add-doctor-page'
import InvestorPage from '../pages/admin/investor/investor-page'
import AddInvestorPage from '../pages/admin/investor/add-investor-page'
import InstallmentRulesPage from '../pages/admin/installment-rules/installment-rules-page'
import AddInstallmentRulePage from '../pages/admin/installment-rules/add-installment-rule-page'
import BlogPage from '../pages/admin/blog/blog-page'
import AddBlogPage from '../pages/admin/blog/add-blog-page'
import UserDashboardPage from '../pages/user/user-dashboard-page'
import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import UserPanelLayout from '@/components/user-panel/user-panel-layout'
import { WebsiteLayout } from '@/components/website/website-layout'
import AboutPageManage from '@/pages/admin/about-page-manage/about-page-manage'

import NewsPageManage from '@/pages/admin/news/news-page'
import AddNewsPage from '@/pages/admin/news/add-news-page'
import GelleryPageManage from '@/pages/admin/gellery/gellery'
import BlogsPageManage from '@/pages/admin/blogs/blogs'
import NewsPage from '@/pages/news/news-page'
import ContactAdminPage from '@/pages/admin/contact/contact'
import FacilitiesPage from '@/pages/admin/facilities/facilities-page'
import AddFacilityPage from '@/pages/admin/facilities/add-facility-page'

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
      { path: "gellery", element: <GelleryPage /> },
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
      { path: "website/facilities", element: <FacilitiesPage /> },
      { path: "website/facilities/new", element: <AddFacilityPage /> },
      { path: "website/facilities/edit/:id", element: <AddFacilityPage /> },
      { path: "website/facilities/view/:id", element: <AddFacilityPage /> },
      { path: "website/gellery", element: <GelleryPageManage /> },
      { path: "website/news", element: <NewsPageManage /> },
      { path: "news/new", element: <AddNewsPage /> },
      { path: "news/edit/:id", element: <AddNewsPage /> },
      { path: "news/view/:id", element: <AddNewsPage /> },
      { path: "website/blogs", element: <BlogsPageManage /> },
      { path: "website/contact", element: <ContactAdminPage /> },
      { path: "staff", element: <StaffPage /> },
      { path: "staff/new", element: <AddStaffPage /> },
      { path: "doctor", element: <DoctorPage /> },
      { path: "doctor/new", element: <AddDoctorPage /> },
      { path: "doctor/edit/:id", element: <AddDoctorPage /> },
      { path: "doctor/view/:id", element: <AddDoctorPage /> },
      { path: "investor", element: <InvestorPage /> },
      { path: "investor/new", element: <AddInvestorPage /> },
      { path: "investor/edit/:id", element: <AddInvestorPage /> },
      { path: "investor/view/:id", element: <AddInvestorPage /> },
      { path: "installment-rules", element: <InstallmentRulesPage /> },
      { path: "installment-rules/new", element: <AddInstallmentRulePage /> },
      { path: "installment-rules/edit/:id", element: <AddInstallmentRulePage /> },
      { path: "installment-rules/view/:id", element: <AddInstallmentRulePage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "blog/new", element: <AddBlogPage /> },
      { path: "blog/edit/:id", element: <AddBlogPage /> },
      { path: "blog/view/:id", element: <AddBlogPage /> },
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