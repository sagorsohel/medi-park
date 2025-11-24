"use client";

import { type FormEvent, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useLoginMutation } from "@/store/api/apiSlice";
import { setCredentials } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  // Determine redirect path based on URL
  const isAdminLogin = location.pathname.includes('/admin/login');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");

    try {
      const result = await login({ email, password }).unwrap();

      // Set credentials in Redux store
      dispatch(setCredentials(result));

      // Navigate based on user role or URL path
      const finalPath = result.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      navigate(finalPath, { replace: true });
    } catch (err: unknown) {
      console.log(err)
      setLocalError('Login failed. Please try again.');
    }
  };

  return (
    <div className={cn("min-h-screen bg-[#2a2a2a] flex items-center justify-center ")}>
      <div className="w-full  overflow-hidden shadow-2xl">
        <div className="grid md:grid-cols-2 bg-white rounded-2xl">
          {/* Left side - Medical professional image */}
          <div className="relative hidden md:block">
            <img
              src="/login.png"
              alt="Medical professional"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side - Login form */}
          <div className="bg-white p-8 md:p-12 flex flex-col">
            {/* Logo */}
            <div className="flex justify-end mb-8">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="MediPark" className="h-8 w-auto" />
              </div>
            </div>

            {/* System Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                A. What the System Does (In Simple Terms)
              </h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <strong>Admins</strong> control system settings and manage HR and Investors.
                </li>
                <li>
                  <strong>Managers</strong> oversee investors and track investments.
                </li>
                <li>
                  <strong>HR staff</strong> manage employee information and salaries.
                </li>
                <li>
                  <strong>Support teams</strong> communicate with investors to solve problems quickly.
                </li>
                <li>
                  <strong>Investors</strong> can see investments, pay dues, and contact support via the mobile app.
                </li>
              </ul>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {localError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                  {localError}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter Email Id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link
                  to={isAdminLogin ? "/admin/forgot-password" : "/user/forgot-password"}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Having Issues with your Password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
