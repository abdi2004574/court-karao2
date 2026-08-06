import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Store, ArrowRight, Sparkles } from "lucide-react";
import { useLocation, Link } from "wouter";
import { startLogin } from "@/const";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<"player" | "owner">("player");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleGuestExplore = (role: "player" | "owner") => {
    localStorage.setItem("guest_mode", "true");
    localStorage.setItem("guest_role", role);
    if (role === "player") {
      setLocation("/player/dashboard");
    } else {
      setLocation("/owner/dashboard");
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    localStorage.removeItem("guest_mode");

    try {
      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If sign in fails, try to sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: selectedRole,
            },
          },
        });

        if (signUpError) {
          toast.error(signUpError.message);
          return;
        }

        if (signUpData.user) {
          toast.success("Account created! Please check your email for verification.");
        }
      } else {
        toast.success("Signed in successfully!");
        // In a real app, we would now sync with the backend or redirect
        // For this demo, we'll redirect to the appropriate dashboard
        if (selectedRole === "player") {
          setLocation("/player/dashboard");
        } else {
          setLocation("/owner/dashboard");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during authentication");
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col justify-center items-center p-4">
      <div className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/")}>
        <div className="w-9 h-9 bg-[#CCFF00] rounded-xl flex items-center justify-center text-black font-bold text-xl">CK</div>
        <span className="font-bold text-xl tracking-tight">Court<span className="text-[#CCFF00]">Karao</span></span>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] text-xs font-semibold mb-3 border border-[#CCFF00]/20">
            <Sparkles className="w-3.5 h-3.5" /> Karachi's Premier Sports Booking SaaS
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to CourtKarao</h1>
          <p className="text-sm text-zinc-400 mt-2">Select your role and sign in to manage or book courts</p>
        </div>

        <Card className="bg-[#111314] border-white/[0.06] shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Choose Your Role</CardTitle>
            <CardDescription className="text-zinc-400">Are you booking a court or managing one?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("player")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedRole === "player"
                    ? "bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00]"
                    : "bg-[#08090a] border-white/[0.06] text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-semibold text-sm">Player</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("owner")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedRole === "owner"
                    ? "bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00]"
                    : "bg-[#08090a] border-white/[0.06] text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Store className="w-6 h-6" />
                <span className="font-semibold text-sm">Court Owner</span>
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#08090a] border-white/[0.08] text-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#08090a] border-white/[0.08] text-white"
                />
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 rounded border-zinc-700 bg-[#08090a] text-[#CCFF00] focus:ring-[#CCFF00]"
                />
                <label htmlFor="agree" className="text-xs text-zinc-400 leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <Link href="/privacy-policy" className="text-[#CCFF00] hover:underline">Privacy Policy</Link>
                  {" "}and{" "}
                  <Link href="/terms-of-use" className="text-[#CCFF00] hover:underline">Terms of Use</Link>.
                </label>
              </div>

              <Button
                type="submit"
                disabled={!agreed}
                className={`w-full font-semibold h-11 ${
                  agreed
                    ? "bg-[#CCFF00] text-black hover:bg-[#b3e600]"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                Sign In / Sign Up <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/[0.06]"></div>
              <span className="flex-shrink mx-4 text-xs text-zinc-500">OR DEMO</span>
              <div className="flex-grow border-t border-white/[0.06]"></div>
            </div>

            <Button
              variant="outline"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/player/dashboard`
                  }
                });
                if (error) toast.error(error.message);
              }}
              className="w-full bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.1] h-11 mb-3"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </Button>

            <Button
              variant="outline"
              onClick={() => handleGuestExplore(selectedRole)}
              className="w-full bg-transparent border-white/[0.1] text-white hover:bg-white/[0.05] h-11"
            >
              Explore Demo as Guest ({selectedRole === "player" ? "Player" : "Owner"})
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
