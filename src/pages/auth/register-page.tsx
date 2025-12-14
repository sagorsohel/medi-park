"use client";

import { type FormEvent, useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useRegisterUserMutation } from "@/services/authApi";
import { setCredentials, getUserRoleSlug } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterUserMutation();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string>("");

  // Determine redirect path based on URL
  const isAdminRegister = location.pathname.includes('/admin/register');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");

    // Validation
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      const result = await register({ email, password, name }).unwrap();

      // Set credentials in Redux store
      dispatch(setCredentials({
        user: result.data.user,
        token: result.data.token,
      }));

      // Navigate based on user role slug
      const roleSlug = getUserRoleSlug(result.data.user);
      const finalPath = roleSlug === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      navigate(finalPath, { replace: true });
    } catch (err: any) {
      setLocalError(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 items-center justify-center min-h-screen p-6")}>
      <Card className="overflow-hidden w-full max-w-4xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">
                  Sign up for a new {isAdminRegister ? 'Admin' : 'User'} account
                </p>
              </div>

              {localError && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  {localError}
                </div>
              )}

              {/* Name Field */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>

              {/* Email Field */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>

              {/* Password Field */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>

              {/* Confirm Password Field */}
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>

              {/* Submit Button */}
              <Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              {/* Social Buttons */}
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" disabled={isLoading}>
                  <span className="sr-only">Sign up with Apple</span>
                  Apple
                </Button>
                <Button variant="outline" type="button" disabled={isLoading}>
                  <span className="sr-only">Sign up with Google</span>
                  Google
                </Button>
                <Button variant="outline" type="button" disabled={isLoading}>
                  <span className="sr-only">Sign up with Meta</span>
                  Meta
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link
                  to={isAdminRegister ? "/admin/login" : "/user/login"}
                  className="underline underline-offset-2 hover:text-primary"
                >
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Right side */}
          <div className="bg-muted relative hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Join Us Today</h2>
                <p className="text-muted-foreground">
                  Create your account and start managing your bus operations efficiently.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Description */}
      <FieldDescription className="px-6 text-center">
        By creating an account, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}

