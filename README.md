# Project Setup - Modern Web Application Template

A comprehensive, production-ready web application template built with React, TypeScript, Redux Toolkit, and Tailwind CSS. Features admin and user panels with authentication, dark/light mode, and responsive design.

## 🚀 Quick Start

```bash
# Clone this repository
git clone <repository-url>
cd medipark

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will start on `http://localhost:5000`

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser

## 🛠️ Installation Methods

### Method 1: Clone and Setup

```bash
git clone <repository-url>
cd medipark
npm install
npm run dev
```

### Method 2: Using Setup Scripts

**Windows:**
```powershell
npm run setup:win
```

**Linux/Mac:**
```bash
npm run setup:unix
```

## 🎯 Features

- **Authentication System**
  - Login/Registration with email and password
  - Forgot password with verification code
  - Role-based access (Admin/User)
  - Token-based authentication with Redux RTK Query
  - Persistent sessions with localStorage

- **Admin Panel**
  - Sticky navbar and footer
  - Collapsible sidebar
  - Dashboard with user information
  - Dark/Light mode toggle
  - Mobile responsive design

- **User Panel**
  - Dedicated user dashboard
  - Profile management
  - Settings page
  - Responsive layout

- **Website Layout**
  - Modern homepage with feature cards
  - Sticky navigation bar
  - Comprehensive footer with newsletter
  - Mobile-friendly design

- **Global State Management**
  - Redux Toolkit with RTK Query
  - Centralized authentication state
  - Type-safe with TypeScript

## 🔐 Demo Credentials

### Admin Account
- **Email:** `admin@gmail.com`
- **Password:** `123456`

### User Account
- **Email:** `user@gmail.com`
- **Password:** `123456`

## 📁 Project Structure

```
medipark/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── admin-panel/     # Admin panel components
│   │   ├── user-panel/      # User panel components
│   │   ├── website/         # Website layout components
│   │   └── ui/              # Base UI components (shadcn/ui)
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── home/            # Home page
│   │   └── user/            # User pages
│   ├── routes/              # Route configuration
│   ├── store/               # Redux store
│   │   ├── api/             # RTK Query API slices
│   │   └── slices/          # Redux slices
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── main.tsx             # Application entry point
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## 🎨 Tech Stack

- **Frontend Framework:** React 19
- **Language:** TypeScript
- **State Management:** Redux Toolkit + RTK Query
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Radix UI
- **Build Tool:** Vite
- **Theme:** next-themes (Dark/Light mode)

## 🔌 API Endpoints (Demo)

The application uses demo data. In production, replace the demo endpoints in `src/store/api/apiSlice.ts` with real API endpoints.

### Available Endpoints:
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/forgot-password` - Request password reset code
- `POST /api/verify-code-and-reset-password` - Reset password with code
- `GET /api/get-current-user` - Get authenticated user

## 🎯 Available Scripts

- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run setup` - Install dependencies and build

## 🌐 Routes

### Public Routes
- `/` - Homepage
- `/admin/login` - Admin login
- `/user/login` - User login
- `/admin/register` - Admin registration
- `/user/register` - User registration
- `/admin/forgot-password` - Admin forgot password
- `/user/forgot-password` - User forgot password

### Protected Routes (Admin)
- `/admin/dashboard` - Admin dashboard

### Protected Routes (User)
- `/user/dashboard` - User dashboard

## 🎨 Customization

### Theme Configuration
Edit `src/index.css` to customize colors and theme variables.

### Menu Configuration
- Admin menu: `src/lib/menu-list.ts`
- User menu: `src/lib/user-menu-list.ts`

### API Configuration
Update `src/store/api/apiSlice.ts` to connect to your backend API.

### Project Name
Replace "Project Setup" with your project name throughout the codebase:
- `src/components/website/website-navbar.tsx`
- `src/components/website/website-footer.tsx`
- `src/pages/home/home-page.tsx`

## 🐛 Troubleshooting

### Build Errors
If you encounter TypeScript errors:
```bash
npm run build
```
Check the error messages and ensure all types are properly defined.

### Port Already in Use
If port 5000 is in use, change it in `package.json`:
```json
"dev": "vite --port 3000"
```

### Clear Cache
If you encounter module resolution issues:
```bash
rm -rf node_modules package-lock.json
npm install
```


## 📝 Development Notes

- All authentication is currently using demo data
- Replace demo users in `src/store/api/apiSlice.ts` with real API calls
- Token and user data are stored in localStorage
- The application uses Redux for global state management
- All components are TypeScript typed

## 🔄 Creating New Projects

1. Clone this repository
2. Copy all files to your new project directory
3. Update `package.json` with your project name
4. Run `npm install`
5. Customize the codebase for your needs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this template for your projects.

## 👨‍💻 Author

Built with ❤️ for better web experiences.

---

## 🎉 Getting Started Checklist

- [ ] Install Node.js 18+
- [ ] Clone this repository
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Open `http://localhost:5000`
- [ ] Login with demo credentials
- [ ] Customize for your project needs

**Note:** This is a template/boilerplate. For production use, implement proper backend authentication, API security, and data validation.
