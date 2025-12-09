"use client";

import { type FormEvent, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useAdminLoginMutation, useUserLoginMutation } from "@/services/authApi";
import { setCredentials, getUserRoleSlug } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Determine redirect path based on URL
  const isAdminLogin = location.pathname.includes('/admin/login');
  const [adminLogin, { isLoading: isAdminLoading }] = useAdminLoginMutation();
  const [userLogin, { isLoading: isUserLoading }] = useUserLoginMutation();
  const isLoading = isAdminLoading || isUserLoading;
  const login = isAdminLogin ? adminLogin : userLogin;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");

    try {
      const result = await login({ email, password }).unwrap();

      // Set credentials in Redux store
      dispatch(setCredentials({
        user: result.data.user,
        token: result.data.token,
      }));

      console.log(result);
      // Navigate based on user role slug
      const roleSlug = result?.data?.user?.roles[0].slug;
      const finalPath = roleSlug === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      navigate(finalPath, { replace: true });
    } catch (err: unknown) {
      console.error('Login error:', err);
      // Extract error message from API response
      if (err && typeof err === 'object' && 'data' in err) {
        const errorData = err.data as { message?: string };
        setLocalError(errorData?.message || 'Login failed. Please try again.');
      } else {
        setLocalError('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <div className={cn("min-h-screen h-full bg-background flex items-center justify-center overflow-hidden")}>
      <div className="w-full flex items-center justify-center overflow-hidden shadow-2xl">
        <div className="grid md:grid-cols-2 bg-card rounded-2xl h-full overflow-hidden">
          {/* Left side - Medical professional image */}
          <div className="relative hidden md:block h-full">
            <img
              src="/login.png"
              alt="Medical professional"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side - Login form */}
          <div className="bg-card p-8 md:p-12 flex flex-col justify-center h-full">
            {/* Logo */}
            <div className="flex justify-end mb-8">
              <div className="flex absolute top-20 right-12 items-center gap-2">
                <img src="/logo.png" alt="MediPark" className="h-8 w-auto" />
              </div>
            </div>

            {/* System Description */}


            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {localError && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  {localError}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter Email Id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-12 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 rounded-lg"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link
                  to={isAdminLogin ? "/admin/forgot-password" : "/user/forgot-password"}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
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
