"use client";

import { type FormEvent, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  useSendUserOtpMutation,
  useResetUserPasswordMutation,
  useSendAdminOtpMutation,
  useResetAdminPasswordMutation,
  useVerifyUserOtpMutation,
  useVerifyAdminOtpMutation
} from "@/services/authApi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, Mail } from "lucide-react";

type Step = 'email' | 'verify' | 'reset';

interface ApiError {
  data?: {
    message?: string;
  };
  status?: number;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [localError, setLocalError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60); // 60 seconds timer
  const [canResend, setCanResend] = useState<boolean>(false);

  const isAdminForgot = location.pathname.includes('/admin/forgot-password');
  const loginPath = isAdminForgot ? '/admin/login' : '/user/login';

  const [sendUserOtp, { isLoading: isSendingUserOtp }] = useSendUserOtpMutation();
  const [resetUserPassword, { isLoading: isResettingUser }] = useResetUserPasswordMutation();
  const [sendAdminOtp, { isLoading: isSendingAdminOtp }] = useSendAdminOtpMutation();
  const [resetAdminPassword, { isLoading: isResettingAdmin }] = useResetAdminPasswordMutation();
  const [verifyUserOtp] = useVerifyUserOtpMutation();
  const [verifyAdminOtp] = useVerifyAdminOtpMutation();

  const forgotPassword = isAdminForgot ? sendAdminOtp : sendUserOtp;
  const verifyOtp = isAdminForgot ? verifyAdminOtp : verifyUserOtp;
  const verifyAndReset = isAdminForgot ? resetAdminPassword : resetUserPassword;
  const isSendingCode = isAdminForgot ? isSendingAdminOtp : isSendingUserOtp;
  const isResetting = isAdminForgot ? isResettingAdmin : isResettingUser;

  // Timer effect for OTP step
  useEffect(() => {
    if (step === 'verify' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendCode = async (): Promise<void> => {
    setTimer(60);
    setCanResend(false);
    setCode("");
    try {
      const result = await forgotPassword({ email }).unwrap();
      setSuccessMessage(result.message);
    } catch (err: unknown) {
      const error = err as ApiError;
      setLocalError(error?.data?.message || 'Failed to resend verification code. Please try again.');
    }
  };

  const handleSendCode = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    try {
      const result = await forgotPassword({ email }).unwrap();
      setSuccessMessage(result.message);
      setStep('verify');
      setTimer(60);
      setCanResend(false);
      // Note: In production, OTP is sent via email, not returned in response
    } catch (err: unknown) {
      const error = err as ApiError;
      setLocalError(error?.data?.message || 'Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyCode = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLocalError("");

    try {
      // Verify OTP with the server
      const result = await verifyOtp({ email, otp: code }).unwrap();
      setSuccessMessage(result.message);
      setStep('reset');
      setLocalError("");
    } catch (err: unknown) {
      const error = err as ApiError;
      setLocalError(error?.data?.message || 'Invalid verification code. Please try again.');
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLocalError("");

    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      const result = await verifyAndReset({
        email,
        otp: code,
        password: newPassword,
        password_confirmation: confirmPassword
      }).unwrap();
      setSuccessMessage(result.message);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate(loginPath, { replace: true });
      }, 2000);
    } catch (err: unknown) {
      const error = err as ApiError;
      setLocalError(error?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <div className={cn("min-h-screen bg-background flex items-center justify-center p-4")}>
      <div className="w-full max-w-4xl overflow-hidden shadow-2xl rounded-2xl">
        <div className="grid md:grid-cols-2 bg-card">
          {/* Left side - Medical professional image */}
          <div className="relative hidden md:block">
            <img
              src="/login.png"
              alt="Medical professional"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side - Form */}
          <div className="bg-card p-8 md:p-12 flex flex-col justify-center min-h-[600px]">
            {step === 'email' && (
              <form onSubmit={handleSendCode} className="flex flex-col h-full justify-center">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground pb-4 text-center">
                    Text your user email in here
                  </h2>
                  {localError && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                      {localError}
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      placeholder="emailaddress@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSendingCode}
                      className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSendingCode}
                    className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 rounded-lg"
                  >
                    {isSendingCode ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
              </form>
            )}

            {step === 'verify' && (
              <form onSubmit={handleVerifyCode} className="flex flex-col h-full justify-center">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
                    Type OTP code in below
                  </h2>

                  {successMessage && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">
                      {successMessage}
                    </div>
                  )}
                  {localError && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                      {localError}
                    </div>
                  )}

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="code"
                      type="text"
                      placeholder="OTP"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      required
                      disabled={isResetting}
                      className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Time: {formatTime(timer)}</span>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-primary hover:text-primary/80 underline"
                      >
                        Sent again
                      </button>
                    ) : (
                      <span className="text-muted-foreground cursor-not-allowed">Sent again</span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={!code || code.length !== 6}
                    className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 rounded-lg"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="flex flex-col h-full justify-center">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
                    Create new password
                  </h2>

                  {successMessage && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">
                      {successMessage}
                    </div>
                  )}

                  {localError && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                      {localError}
                    </div>
                  )}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isResetting}
                      className="w-full pl-10 pr-12 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isResetting}
                      className="w-full pl-10 pr-12 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isResetting}
                    className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 rounded-lg"
                  >
                    {isResetting ? "Resetting..." : "Reset"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
