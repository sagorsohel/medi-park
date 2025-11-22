"use client";

import { type FormEvent, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useForgotPasswordMutation, useVerifyCodeAndResetPasswordMutation } from "@/store/api/apiSlice";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Step = 'email' | 'verify' | 'reset';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [forgotPassword, { isLoading: isSendingCode }] = useForgotPasswordMutation();
  const [verifyAndReset, { isLoading: isResetting }] = useVerifyCodeAndResetPasswordMutation();

  const isAdminForgot = location.pathname.includes('/admin/forgot-password');
  const loginPath = isAdminForgot ? '/admin/login' : '/user/login';

  const handleSendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    try {
      const result = await forgotPassword({ email }).unwrap();
      setSuccessMessage(result.message);
      setStep('verify');
      // In production, code would be sent via email
      // For demo, we'll show it in console (already logged in apiSlice)
      console.log('Verification code:', result.code);
    } catch (err: any) {
      setLocalError(err?.data?.message || 'Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyAndReset = async (event: FormEvent<HTMLFormElement>) => {
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
      const result = await verifyAndReset({ email, code, newPassword }).unwrap();
      setSuccessMessage(result.message);
      setStep('reset');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate(loginPath, { replace: true });
      }, 2000);
    } catch (err: any) {
      setLocalError(err?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 items-center justify-center min-h-screen p-6")}>
      <Card className="overflow-hidden w-full max-w-md">
        <CardContent className="p-6 md:p-8">
          {step === 'email' && (
            <form onSubmit={handleSendCode}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center mb-6">
                  <h1 className="text-2xl font-bold">Forgot Password</h1>
                  <p className="text-muted-foreground text-balance">
                    Enter your email to receive a verification code
                  </p>
                </div>

                {localError && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 mb-4">
                    {localError}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSendingCode}
                  />
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={isSendingCode}>
                    {isSendingCode ? "Sending..." : "Send Verification Code"}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Remember your password?{" "}
                  <Link
                    to={loginPath}
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    Sign in
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyAndReset}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center mb-6">
                  <h1 className="text-2xl font-bold">Verify Code</h1>
                  <p className="text-muted-foreground text-balance">
                    Enter the verification code sent to {email}
                  </p>
                </div>

                {successMessage && (
                  <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 mb-4">
                    {successMessage}
                  </div>
                )}

                {localError && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 mb-4">
                    {localError}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="code">Verification Code</FieldLabel>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                    disabled={isResetting}
                    className="text-center text-2xl tracking-widest"
                  />
                  <FieldDescription>
                    Check your email for the verification code. For demo, check the browser console.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isResetting}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isResetting}
                  />
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={isResetting}>
                    {isResetting ? "Resetting..." : "Reset Password"}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    Back to email
                  </button>
                </FieldDescription>
              </FieldGroup>
            </form>
          )}

          {step === 'reset' && (
            <div className="text-center">
              <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 mb-4">
                {successMessage}
              </div>
              <p className="text-muted-foreground mb-4">
                Redirecting to login page...
              </p>
              <Button asChild>
                <Link to={loginPath}>Go to Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

