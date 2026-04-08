"use client";

import { type FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAdminLoginMutation } from "@/services/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function CRMLoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const [email, setEmail] = useState("crm@example.com");
  const [password, setPassword] = useState("password");
  const [localError, setLocalError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");

    try {
      const result = await adminLogin({ email, password }).unwrap();

      dispatch(setCredentials({
        user: result.data.user,
        token: result.data.token,
      }));

      navigate('/accounting/software/dashboard', { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const errorData = err.data as { message?: string };
        setLocalError(errorData?.message || 'Login failed.');
      } else {
        setLocalError('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Accounting Software</span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-5xl font-black leading-tight">
            Manage your <br/> 
            <span className="text-secondary">Partners & Shares</span> <br/>
            Effectively.
          </h1>
            The unified portal for financial management, installment tracking, and share distributions.
        </div>

        <div className="text-sm text-primary-foreground/60">
          © 2026 MediPark Hospital Group. All rights reserved.
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Please enter your accounting credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {localError && (
              <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                {localError}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              {isLoading ? "Authenticating..." : "Login to Accounting Soft"}
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-slate-500">
                Facing issues? <a href="#" className="text-primary font-bold hover:underline">Contact System Admin</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
