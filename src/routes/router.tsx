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
import BlogPage from '../pages/admin/health-insight/blog-page'
import AddBlogPage from '../pages/admin/health-insight/add-blog-page'
import UserDashboardPage from '../pages/user/user-dashboard-page'
import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import UserPanelLayout from '@/components/user-panel/user-panel-layout'
import { WebsiteLayout } from '@/components/website/website-layout'
import AboutPageManage from '@/pages/admin/about-page-manage/about-page-manage'
import CareerPageManagePage from '@/pages/admin/career-page-manage/career-page-manage'
import JobPostPage from '@/pages/admin/job-post/job-post-page'
import AddJobPage from '@/pages/admin/job-post/add-job-page'

import NewsPageManage from '@/pages/admin/news/news-page'
import AddNewsPage from '@/pages/admin/news/add-news-page'
import GelleryPageManage from '@/pages/admin/gellery/gellery'
import BlogsPageManage from '@/pages/admin/health-insights/blogs'
import NewsPage from '@/pages/news/news-page'
import ContactAdminPage from '@/pages/admin/contact/contact'
import FacilitiesPageAdmin from '@/pages/admin/facilities/facilities-page'
import AddFacilityPage from '@/pages/admin/facilities/add-facility-page'
import FacilitiesPage from '@/pages/facilities/facilities-page'
import FacilityDetailPage from '@/pages/facilities/facility-detail-page'
import MissionVisionPage from '@/pages/mission-vision/mission-vision-page'
import MissionPage from '@/pages/mission-vision/mission-page'
import VisionPage from '@/pages/mission-vision/vision-page'
import AdminFutureVenturesPage from '@/pages/admin/future-ventures/future-ventures-page'
import AddFutureVenturePage from '@/pages/admin/future-ventures/add-future-venture-page'
import EditFutureVenturePage from '@/pages/admin/future-ventures/edit-future-venture-page'
import FutureVentureDetailPage from '@/pages/future-ventures/future-venture-detail-page'
import FutureVenturesPage from '@/pages/future-ventures/future-ventures-page'
import DirectorsPage from '@/pages/admin/directors/directors-page'
import AddDirectorPage from '@/pages/admin/directors/add-director-page'
import NotFoundPage from '@/pages/404/not-found-page'
import ComingSoonPage from '@/pages/coming-soon/coming-soon-page'
import MessageOfChairmanPage from '@/pages/about/message-of-chairman'
import MessageOfManagingDirectorPage from '@/pages/about/message-of-managing-director'
import DirectorDetailPage from '@/pages/about/director-detail-page'
import ShareManagePage from '@/pages/admin/share-manage/share-manage-page'
import AppointmentPage from '@/pages/appointment/appointment-page'
import ReportsPage from '@/pages/reports/reports-page'
import TelemedicinePage from '@/pages/telemedicine/telemedicine-page'
import GuidePage from '@/pages/guide/guide-page'
import PublicHealthCheckupPage from '@/pages/health-checkup/public-health-checkup-page'
import PublicRoomRentPage from '@/pages/room-rent/public-room-rent-page'
import PublicEquipmentsPage from '@/pages/equipments/public-equipments-page'
import PublicHealthTipsPage from '@/pages/health-tips/public-health-tips-page'
import PublicVisitorsPolicyPage from '@/pages/visitors-policy/public-visitors-policy-page'
import InvestorDetailPage from '@/pages/investors/investor-detail-page'
import HealthCheckupManagePage from '@/pages/admin/health-checkup/health-checkup-page'
import AddHealthCheckupPage from '@/pages/admin/health-checkup/add-health-checkup-page'
import EquipmentManagePage from '@/pages/admin/equipment/equipment-page'
import HealthCheckupPackagesPage from '@/pages/admin/health-checkup-packages/health-checkup-packages-page'
import AddHealthCheckupPackagePage from '@/pages/admin/health-checkup-packages/add-health-checkup-package-page'
import PackagePagesPage from '@/pages/admin/package-pages/package-pages-page'
import AddPackagePagePage from '@/pages/admin/package-pages/add-package-page'
import RoomRentsManagePage from '@/pages/admin/room-rents/room-rents-page'
import HomepagePricingsPage from '@/pages/admin/homepage-pricings/homepage-pricings-page'
import AddHomepagePricingPage from '@/pages/admin/homepage-pricings/add-homepage-pricing-page'
import HeadingsManagePage from '@/pages/admin/headings-manage-page'
import OurValuesManagePage from '@/pages/admin/our-values-manage-page'

import PackageDetailPage from '@/pages/packages/package-detail-page'
import PublicPackagesPage from '@/pages/packages/public-packages-page'
import OurValuesPage from '@/pages/our-values/our-values-page'
import OurValuesDetailsPage from '@/pages/our-values/our-values-details-page'

const router = createBrowserRouter([
  // 🌐 Website routes (with website layout - sticky navbar & footer)
  {
    path: "/",
    element: <WebsiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "about/message-of-chairman", element: <MessageOfChairmanPage /> },
      { path: "about/message-of-managing-director", element: <MessageOfManagingDirectorPage /> },
      { path: "about/board-of-directors/:id", element: <DirectorDetailPage /> },
      { path: "mission-vision", element: <MissionVisionPage /> },
      { path: "mission", element: <MissionPage /> },
      { path: "vision", element: <VisionPage /> },
      { path: "awards", element: <AwardsPage /> },
      { path: "careers", element: <CareerPage /> },
      { path: "careers/job/:id", element: <JobDetailPage /> },
      { path: "news", element: <NewsPage /> },
      { path: "news/:id", element: <NewsDetailPage /> },
      { path: "facilities", element: <FacilitiesPage /> },
      { path: "facilities/:id", element: <FacilityDetailPage /> },
      { path: "future-ventures", element: <FutureVenturesPage /> },
      { path: "future-ventures/:id", element: <FutureVentureDetailPage /> },
      { path: "doctors", element: <DoctorsPage /> },
      { path: "doctors/:id", element: <DoctorDetailPage /> },
      { path: "health-insight", element: <BlogsPage /> },
      { path: "health-insight/:id", element: <BlogDetailPage /> },
      { path: "investors", element: <InvestorsPage /> },
      { path: "investors/:id", element: <InvestorDetailPage /> },
      { path: "gellery", element: <GelleryPage /> },
      { path: "contacts", element: <ContactPage /> },
      { path: "privacy-policy", element: <PrivacyPage /> },
      { path: "coming-soon", element: <ComingSoonPage /> },
      { path: "appointment", element: <AppointmentPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "telemedicine", element: <TelemedicinePage /> },
      { path: "guide", element: <GuidePage /> },
      { path: "health-checkup", element: <PublicHealthCheckupPage /> },
      { path: "room-rent", element: <PublicRoomRentPage /> },
      { path: "equipments", element: <PublicEquipmentsPage /> },
      { path: "health-tips", element: <PublicHealthTipsPage /> },
      { path: "visitors-policy", element: <PublicVisitorsPolicyPage /> },
      { path: "packages", element: <PublicPackagesPage /> },
      { path: "packages/:id", element: <PackageDetailPage /> },
      { path: "our-values", element: <OurValuesPage /> },
      { path: "our-values/:id", element: <OurValuesDetailsPage /> },
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
      { path: "website/careers", element: <CareerPageManagePage /> },
      { path: "job-posts", element: <JobPostPage /> },
      { path: "job-posts/new", element: <AddJobPage /> },
      { path: "job-posts/edit/:id", element: <AddJobPage /> },
      { path: "job-posts/view/:id", element: <AddJobPage /> },
      { path: "website/facilities", element: <FacilitiesPageAdmin /> },
      { path: "website/facilities/new", element: <AddFacilityPage /> },
      { path: "website/facilities/edit/:id", element: <AddFacilityPage /> },
      { path: "website/facilities/view/:id", element: <AddFacilityPage /> },
      { path: "website/gellery", element: <GelleryPageManage /> },
      { path: "website/news", element: <NewsPageManage /> },
      { path: "news/new", element: <AddNewsPage /> },
      { path: "news/edit/:id", element: <AddNewsPage /> },
      { path: "news/view/:id", element: <AddNewsPage /> },
      { path: "website/health-insight", element: <BlogsPageManage /> },
      { path: "website/contact", element: <ContactAdminPage /> },
      { path: "staff", element: <StaffPage /> },
      { path: "future-ventures", element: <AdminFutureVenturesPage /> },
      { path: "future-ventures/add", element: <AddFutureVenturePage /> },
      { path: "future-ventures/edit/:id", element: <EditFutureVenturePage /> },
      { path: "future-ventures/view/:id", element: <EditFutureVenturePage /> },
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
      { path: "health-insight", element: <BlogPage /> },
      { path: "health-insight/new", element: <AddBlogPage /> },
      { path: "health-insight/edit/:id", element: <AddBlogPage /> },
      { path: "health-insight/view/:id", element: <AddBlogPage /> },
      { path: "directors", element: <DirectorsPage /> },
      { path: "directors/new", element: <AddDirectorPage /> },
      { path: "directors/edit/:id", element: <AddDirectorPage /> },
      { path: "directors/view/:id", element: <AddDirectorPage /> },
      { path: "share-manage", element: <ShareManagePage /> },
      { path: "health-checkup", element: <HealthCheckupManagePage /> },
      { path: "health-checkup/new", element: <AddHealthCheckupPage /> },
      { path: "health-checkup/edit/:id", element: <AddHealthCheckupPage /> },
      { path: "health-checkup/view/:id", element: <AddHealthCheckupPage /> },
      { path: "health-checkup-packages", element: <HealthCheckupPackagesPage /> },
      { path: "health-checkup-packages/new", element: <AddHealthCheckupPackagePage /> },
      { path: "health-checkup-packages/edit/:id", element: <AddHealthCheckupPackagePage /> },
      { path: "package-pages", element: <PackagePagesPage /> },
      { path: "package-pages/new", element: <AddPackagePagePage /> },
      { path: "package-pages/edit/:id", element: <AddPackagePagePage /> },
      { path: "equipment", element: <EquipmentManagePage /> },
      { path: "room-rents", element: <RoomRentsManagePage /> },
      { path: "homepage-pricings", element: <HomepagePricingsPage /> },
      { path: "homepage-pricings/new", element: <AddHomepagePricingPage /> },
      { path: "homepage-pricings/edit/:id", element: <AddHomepagePricingPage /> },
      { path: "headings", element: <HeadingsManagePage /> },
      { path: "website/our-values", element: <OurValuesManagePage /> },
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

  // 🚫 404 Not Found - Catch all unmatched routes
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router
