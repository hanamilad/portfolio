import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email")
});

export default function Auth() {
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (isResetMode) {
      // Validate email only for reset
      const result = resetSchema.safeParse({ email });
      if (!result.success) {
        const fieldErrors: { email?: string } = {};
        result.error.errors.forEach((err) => {
          if (err.path[0] === "email") fieldErrors.email = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`
        });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Password reset email sent! Check your inbox.");
          setIsResetMode(false);
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Validate for login
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        const fieldErrors: { email?: string; password?: string } = {};
        result.error.errors.forEach((err) => {
          if (err.path[0] === "email") fieldErrors.email = err.message;
          if (err.path[0] === "password") fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setLoading(true);
      try {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          navigate("/admin");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background mesh-gradient p-4">
      <div className="w-full max-w-md space-y-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Portfolio
        </Button>

        <Card className="p-8 glass">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {isResetMode ? "Reset Password" : "Admin Login"}
            </h1>
            <p className="text-muted-foreground">
              {isResetMode
                ? "Enter your email to receive a reset link"
                : "Sign in to manage your portfolio"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {!isResetMode && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:shadow-glow"
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : isResetMode
                ? "Send Reset Link"
                : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsResetMode(!isResetMode);
                setErrors({});
              }}
              className="text-sm text-primary hover:underline"
            >
              {isResetMode
                ? "Back to login"
                : "Forgot password?"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
